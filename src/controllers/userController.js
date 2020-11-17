import User from '../models/user';
import express from 'express';
import mongoose from 'mongoose';
const authCheck = require('../middlewares/authCheck').authCheck;

const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

require('dotenv').config({ path: '../../src/.env' });


router.post('/login', async (req, res) => {
    const userName = req.body.username;
    const password = req.body.hashedPassword;

    if (!userName || !password) {
        if (!userName) {
            return res.send({
                error: 'User name required'
            })
        }
        if (!password) {
            return res.send({
                error: 'password required'
            })
        }
    }

    User.find(async (err, users) => {

        var cnt = 0;
        var found = false;
        while(!found && cnt < users.length){
            const compareRes = await bcrypt.compare(password, users[0].hashedPassword);
            if(userName == users[cnt].userName && compareRes){
                found = true;
            }
            cnt++;
        }
        
        try {
            if (found) {
                const secret = "" + process.env.JWT_SECRET;
                const token = jwt.sign(
                    {
                        userID: userName,

                    },
                    secret,
                    {
                        expiresIn: 60 * 60
                    }
                );
                console.log("logged in");
                return res.send({ token });
            }
            else {
                res.status(401);
                return res.send({
                    error: 'Invalid username or password'
                });
            }
        }
        catch (ex) {
            console.log(ex);
            res.status(401);
            return res.send({
                error: 'Invalid username or password'
            });
        }
    });
});

router.post('/signup', authCheck, async (req, res) => {
    const userName = req.body.username;
    const email = req.body.email;
    const password = req.body.hashedPassword;
    const shelterName = req.body.shelterName;

    if (!userName || !password) {
        return res.send({
            error: "need username and password"
        })
    }

    User.find(async (err, users) => {
        var cnt = 0;
        var found = false;
        var msg = "";
        while(!found && cnt < users.length){
            if(userName == users[cnt].userName || email == users[cnt].email || shelterName == users[cnt].shelterName){
                found = true;
                if(userName == users[cnt].userName){
                    msg = "The username is already taken";
                }else if(email == users[cnt].email){
                    msg = "The email is already taken";
                }else if(shelterName == users[cnt].shelterName){
                    msg = "The shelter name is already taken";
                }else{
                    msg = "something is just wrong!";
                }
            }
            cnt++;
        }        
        
        if(!found){
            try {
                const hashedPassword = await bcrypt.hash(password, saltRounds)
                const temp = {
                    "userName": userName,
                    "hashedPassword": hashedPassword,
                    "email": email,
                    "shelterName": shelterName
                };
                let user = new User(temp);
                user.save()
                    .then(user => {
                        res.status(200).send('Added succesfully');
                        console.log("worked");
                    })
                    .catch(err => {
                        res.status(400).send('Failed to create new record');
                        console.log(err);
                    });
            }
            catch (ex) {
                console.log(ex);
                res.status(400);
                return res.send({ error: ex });
            }
        }else{
            res.status(400).send(msg);
            console.log(err);
        }

        
    });
});

router.post('/register', async (req, res) => {
    const userName = req.body.name;
    const shelterName = req.body.shelter;
    const email = req.body.email;
    //const buffer = await crypto.randomBytes(16);
    //const verifiedToken = buffer.toString("hex");

    if (!userName) {
        return res.send({
            error: 'User name required'
        })
    }else if(!shelterName){
        return res.send({
            error: 'shelter name required'
        })
    }else if(!email){
        return res.send({
            error: 'email required'
        })
    }else{
        const secret = "" + process.env.JWT_SECRET;
        const token = jwt.sign({ userID: userName },secret, { expiresIn: '10d' });    
        const verifiedToken = token;
    
        try {
            //const passwordResetUrl = `${"" + process.env.FRONTEND_URL}/passwordReset?passwordResetToken=${passwordResetToken}`;
            sgMail.setApiKey("" + process.env.SENDGRID_KEY);
            const msg =
            {
                to: 'lotushouseapp@gmail.com',
                from: '' + process.env.FROM_EMAIL,
                subject: 'Requested Shelter Account Creation',
                text: `${userName} from ${shelterName}, has requested to create an account in the app. Their email to reference them is ${email}. If everything is good to go, here is the verification they would use within the next 10 days starting TODAY: ${verifiedToken}`,
                html:  `<p>${userName} from ${shelterName},</p>
                        <p>
                        has requested to create an account in the app. Their email to reference them is ${email}.
                        </p>
                        <p>
                        If everything is good to go, here is the verification they would use within the next 10 days starting TODAY:
                        </p>
                        <p>
                            <h1>${verifiedToken}</h1>
                        </p>`,
            };
            sgMail.send(msg);
            res.send({ msges: 'Successfully sent email' });
        }
        catch (ex) {
        console.log(ex);
        res.send(ex, 500);
        }
    }
});

// router.put('/updateUser', authCheck, async function (req, res) {
//     User.find((err, users) => {
//         const userName = req.body.userName;
//         const email = req.body.email;
//         if (email == users[0].email) {
//             users[0].username = userName;
//         }
//         users[0].save()
//             .then(user => {
//                 res.status(200).send('Updated succesfully');
//                 console.log("worked");
//             })
//             .catch(err => {
//                 res.status(400).send('Failed to update');
//                 console.log("did not work");
//             });
//         return res.send({ message: 'User updated' });
//     });
// });


// router.put('/updatePassword', authCheck, async function (req, res) {
//     User.find(async (err, users) => {
//         const password = req.body.password;
//         try {
//             const hashedPassword = await bcrypt.hash(password, saltRounds)
//             users[0].hashedPassword = hashedPassword;
//             users.save().then(user => {
//                 res.status(200).json({ 'user': 'Update Done' });
//             });
//             return res.send({ message: 'User created' });
//         }
//         catch (ex) {
//             console.log(ex);
//             res.status(400);
//             return res.send({ error: ex });
//         }
//     });

// });


router.post('/passwordResetRequest', async (req, res) => {
    const userName = req.body.username
    const email = req.body.email;
    const buffer = await crypto.randomBytes(32);
    const passwordResetToken = buffer.toString("hex");
    try {
        User.find((err, users) => {
            var cnt = 0;
            var found = false;
            
            while(!found && cnt < users.length){
                if(userName == users[cnt].userName && email == users[cnt].email){
                    found = true;
                }
                cnt++;
            }
            if (found) {
                users[cnt-1].passwordResetToken = passwordResetToken;
                users[cnt-1].save();
                //const passwordResetUrl = `${"" + process.env.FRONTEND_URL}/passwordReset?passwordResetToken=${passwordResetToken}`;
                sgMail.setApiKey("" + process.env.SENDGRID_KEY);
                const msg =
                {
                    to: '' + email,
                    from: '' + process.env.FROM_EMAIL,
                    subject: 'Password Reset Request',
                    text: `Dear user,You can reset your password with this code: ${passwordResetToken}. Enter this code in the app to change your password.`,
                    html: `<p>Dear user,</p>
                <p>
                    You can reset your password with this code:
                </p>
                <p>
                    <h1>${passwordResetToken}</h1>
                </p>
                <p>
                    Enter this code in the app to change your password.
                </p>
                `,
                };
                sgMail.send(msg);
                res.send({ msges: 'Successfully sent email' });
            } else {
                if (!userName || !email) {
                    if (!userName) {
                        return res.send({
                            error: 'User name required'
                        })
                    }
                    if (!email) {
                        return res.send({
                            error: 'Email required'
                        })
                    }
                } else {
                    return res.send({ error: 'Please check username and email' })
                }
            }
        });
    }
    catch (ex) {
        console.log(ex);
        res.send(ex, 500);
    }
});


router.post('/passwordReset', async (req, res) => {
    const password = req.body.hashedPassword;
    const passwordResetToken = req.body.passwordResetToken;
    const userName = req.body.userName;

    try {
        User.find(async (err, users) => {
            var cnt = 0;
            var found = false;

            while(!found && cnt < users.length){
                if(userName == users[cnt].userName && passwordResetToken == users[cnt].passwordResetToken){
                    found = true;
                }
                cnt++;
            }
            if (found) {
                const buffer = crypto.randomBytes(32);
                const newPasswordResetToken = buffer.toString("hex");
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                users[cnt-1].hashedPassword = hashedPassword;
                users[cnt-1].passwordResetToken = newPasswordResetToken;
                users[cnt-1].save();
                res.send({ message: 'Successfully reset password' });
            } else {
                res.send({ message: 'incorrect token' });
            }
        });
    }
    catch (ex) {
        console.log(ex);
        res.send(ex, 500);
    }
});

router.post('/getAllNames', async (req, res) => {
    User.find((err, users) => {
        var names = "";
        for(var i = 0; i < users.length; i++){
            names += users.shelterName + "||";
        }
        res.send({ message: names });
    });
});


module.exports = router;