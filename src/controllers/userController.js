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


router.route('/login').post(async (req, res) => {
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
        const secret = "" + process.env.JWT_SECRET;


        const compareRes = await bcrypt.compare(password, users[0].hashedPassword);

        try {
            if (compareRes && userName == users[0].userName) {
                const token = jwt.sign(
                    {
                        userID: userName

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

router.route('/signup').post(async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.hashedPassword;

    if (!username || !password) {
        return res.send({
            error: "need username and password"
        })
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        const temp = {
            "userName": username,
            "hashedPassword": hashedPassword,
            "email": email
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
        logger.error(ex);
        res.status(400);
        return res.send({ error: ex });
    }
});

router.put('/updateUser', authCheck, async function (req, res) {
    User.find((err, users) => {
        const userName = req.body.userName;
        const email = req.body.email;
        if (email == users[0].email) {
            users[0].username = userName;
        }
        users[0].save()
            .then(user => {
                res.status(200).send('Updated succesfully');
                console.log("worked");
            })
            .catch(err => {
                res.status(400).send('Failed to update');
                console.log("did not work");
            });
        return res.send({ message: 'User updated' });
    });
});


router.put('/updatePassword', authCheck, async function (req, res) {
    User.find(async (err, users) => {
        const password = req.body.password;
        try {
            const hashedPassword = await bcrypt.hash(password, saltRounds)
            users[0].hashedPassword = hashedPassword;
            users.save().then(user => {
                res.status(200).json({ 'user': 'Update Done' });
            });
            return res.send({ message: 'User created' });
        }
        catch (ex) {
            console.log(ex);
            res.status(400);
            return res.send({ error: ex });
        }
    });

});


router.post('/passwordResetRequest', authCheck, async (req, res) => {
    const userName = req.body.username
    const email = req.body.email;
    const buffer = await crypto.randomBytes(32);
    const passwordResetToken = buffer.toString("hex");
    try {
        User.find((err, users) => {
            if (userName == users[0].userName && email == users[0].email) {
                users[0].passwordResetToken = passwordResetToken;
                users[0].save();
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
                res.send({ message: 'Successfully sent email' });
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
                }else{
                    return res.send({ error: 'Please check username and email'})
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
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
        User.find((err, users) => {
            if (passwordResetToken == users[0].passwordResetToken) {
                const buffer = crypto.randomBytes(32);
                const newPasswordResetToken = buffer.toString("hex");
                users[0].hashedPassword = hashedPassword;
                users[0].passwordResetToken = newPasswordResetToken;
                users[0].save();
                res.send({ message: 'Successfully reset password' });
            }
        });
    }
    catch (ex) {
        console.log(ex);
        res.send(ex, 500);
    }
});


module.exports = router;