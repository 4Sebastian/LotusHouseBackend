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
    const shelterName = req.body.shelterName;

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
    if (!shelterName) {
        return res.send({
            error: 'shelter name required'
        })
    }

    User.find(async (err, users) => {

        var cnt = 0;
        var found = false;
        while (!found && cnt < users.length) {
            const compareRes = await bcrypt.compare(password, users[cnt].hashedPassword);
            if (userName == users[cnt].userName && compareRes && shelterName == users[cnt].shelterName) {
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
        while (!found && cnt < users.length) {
            const compareRes = await bcrypt.compare(password, users[cnt].hashedPassword);
            if (userName == users[cnt].userName || email == users[cnt].email || shelterName == users[cnt].shelterName || compareRes) {
                found = true;
                if (userName == users[cnt].userName) {
                    msg = "The username is already taken";
                } else if (email == users[cnt].email) {
                    msg = "The email is already taken";
                } else if (shelterName == users[cnt].shelterName) {
                    msg = "The shelter name is already taken";
                } else if (compareRes) {
                    msg = "The password is already taken";
                } else {
                    msg = "something is just wrong!";
                }
            }
            cnt++;
        }

        if (!found) {
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
                        console.log("worked");
                        return res.status(200).send('Added succesfully');

                    })
                    .catch(err => {
                        console.log(err);
                        return res.status(400).send('Failed to create new record');

                    });
            }
            catch (ex) {
                console.log(ex);
                return res.status(400).send({ error: "An interesting error occurred" });
            }
        } else {
            console.log(err);
            return res.status(400).send(msg);

        }


    });
});

router.post('/register', async (req, res) => {
    const userName = req.body.name;
    const shelterName = req.body.shelter;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    //const buffer = await crypto.randomBytes(16);
    //const verifiedToken = buffer.toString("hex");

    if (!userName) {
        return res.send({
            error: 'User name required'
        })
    } else if (!shelterName) {
        return res.send({
            error: 'shelter name required'
        })
    } else if (!email) {
        return res.send({
            error: 'email required'
        })
    } else if (!phoneNumber) {
        return res.send({
            error: 'phone number required'
        })
    } else {
        const secret = "" + process.env.JWT_SECRET;
        const token = jwt.sign({ userID: userName }, secret, { expiresIn: '10d' });
        const verifiedToken = token;

        try {
            //const passwordResetUrl = `${"" + process.env.FRONTEND_URL}/passwordReset?passwordResetToken=${passwordResetToken}`;
            sgMail.setApiKey("" + process.env.SENDGRID_KEY);
            const msg =
            {
                to: 'lotushouseapp@gmail.com',
                from: '' + process.env.FROM_EMAIL,
                subject: 'Requested Shelter Account Creation',
                text: `${userName} from ${shelterName}, has requested to create an account in the app. Their email to reference them is ${email}; their phone number to reference them is ${phoneNumber}. If everything is good to go, here is the verification they would use within the next 10 days starting TODAY: ${verifiedToken}`,
                html: `<p>${userName} from ${shelterName},</p>
                        <p>
                        has requested to create an account in the app. Their email to reference them is ${email}; their phone number to reference them is ${phoneNumber}.
                        </p>
                        <p>
                        If everything is good to go, here is the verification they would use within the next 10 days starting TODAY:
                        </p>
                        <p>
                            <h1>${verifiedToken}</h1>
                        </p>`,
            };
            sgMail.send(msg);
            return res.send({ msges: 'Successfully sent email' });
        }
        catch (ex) {
            console.log(ex);
            return res.send("errorzzz", 500);
        }
    }
});

router.post('/updateUser', authCheck, async function (req, res) {
    const shelterName = req.body.shelter;
    const userName = req.body.userName;
    // var found = false;

    // User.find((err, users) => {
    //     for(var i = 0; i < users.length; i++){
    //         if(users[i].userName == userName){
    //             found = true;
    //             return res.status(400).send({ message: 'Username Taken'});
    //         }
    //     }
    // });

    if (!foundUsername(userName)) {
        User.find({ shelterName: shelterName }, (err, users) => {

            try {
                users[0].username = userName;
                users[0].save();
                return res.status(200).send('Updated succesfully');
            }
            catch (ex) {
                res.status(400);
                console.log(ex);
                return res.send({ error: ex });
            }

        });
    } else {
        return res.status(400).send({ message: 'Username Taken' });
    }

});

function foundUsername(userName) {
    User.find((err, users) => {
        for (var i = 0; i < users.length; i++) {
            if (users[i].userName == userName) {
                return true;
            }
        }
        return false;
    });


}


router.post('/updatePassword', authCheck, async function (req, res) {
    const shelterName = req.body.shelter;
    const password = req.body.password;
    // var found = false;

    // User.find(async (err, users) => {
    //     for(var i = 0; i < users.length; i++){
    //         const compareRes = await bcrypt.compare(password, users[i].hashedPassword);
    //         if(users[i].hashedPassword == compareRes){
    //             found = true;
    //             return res.status(400).send({ message: 'Password Taken'});
    //         }
    //     }
    // });

    if (!foundPassword(password)) {
        User.find({ shelterName: shelterName }, async (err, users) => {

            try {
                const hashedPassword = await bcrypt.hash(password, saltRounds)
                users[0].hashedPassword = hashedPassword;
                users.save();
                return res.status(200).send({ message: 'Password Updated' });

            }
            catch (ex) {
                res.status(400);
                console.log(ex);
                return res.send({ error: ex });
            }
        });
    } else {
        return res.status(400).send({ message: 'Password Taken' });
    }


});

function foundPassword(password) {
    User.find(async (err, users) => {
        for (var i = 0; i < users.length; i++) {
            const compareRes = await bcrypt.compare(password, users[i].hashedPassword);
            if (users[i].hashedPassword == compareRes) {
                found = true;
                return true;
            }
        }

        return false;
    });
}



router.post('/deleteAccount', authCheck, async function (req, res) {
    const userName = req.body.name;
    const shelterName = req.body.shelter;
    const email = req.body.email;
    const hashedPassword = req.body.hashedPassword;
    User.find({ shelterName: shelterName }, async (err, user) => {
        const compareRes = await bcrypt.compare(hashedPassword, user[0].hashedPassword);
        if (user[0].userName == userName && compareRes && user[0].email == email) {
            user[0].deleteOne();
            res.status(200);
            return res.send({
                message: 'User deleted',
                condition1: user[0].userName == userName,
                condition2: compareRes,
                condition3: user[0].email == email
            });
        } else {

            res.status(404);
            return res.send({
                message: 'User not deleted',
                condition1: user[0].userName == userName,
                condition2: compareRes,
                condition3: user[0].email == email
            });
        }
    });
});


router.post('/passwordResetRequest', async (req, res) => {
    const userName = req.body.username
    const email = req.body.email;
    const buffer = await crypto.randomBytes(32);
    const shelterName = req.body.shelterName;
    const passwordResetToken = buffer.toString("hex");
    try {
        User.find((err, users) => {
            var cnt = 0;
            var found = false;

            while (!found && cnt < users.length) {
                if (userName == users[cnt].userName && email == users[cnt].email && shelterName == users[cnt].shelterName) {
                    found = true;
                }
                cnt++;
            }
            if (found) {
                users[cnt - 1].passwordResetToken = passwordResetToken;
                users[cnt - 1].save();
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
                return res.send({ msges: 'Successfully sent email' });
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
        return res.send(ex, 500);
    }
});


router.post('/passwordReset', async (req, res) => {
    const password = req.body.hashedPassword;
    const passwordResetToken = req.body.passwordResetToken;
    const shelterName = req.body.shelterName;

    try {
        User.find(async (err, users) => {
            var cnt = 0;
            var found = false;

            while (!found && cnt < users.length) {
                if (passwordResetToken == users[cnt].passwordResetToken && shelterName == users[cnt].shelterName) {
                    found = true;
                }
                cnt++;
            }
            if (found) {
                const buffer = crypto.randomBytes(32);
                const newPasswordResetToken = buffer.toString("hex");
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                users[cnt - 1].hashedPassword = hashedPassword;
                users[cnt - 1].passwordResetToken = newPasswordResetToken;
                users[cnt - 1].save();
                return res.send({ message: 'Successfully reset password' });
            } else {
                return res.send({ message: 'incorrect token' });
            }
        });
    }
    catch (ex) {
        console.log(ex);
        return res.send(ex, 500);
    }
});

router.post('/getAllNames', async (req, res) => {
    User.find((err, users) => {
        var names = "";
        for (var i = 0; i < users.length; i++) {
            names += users[i].shelterName + "||";
        }
        return res.send({ message: names });
    });
});


module.exports = router;