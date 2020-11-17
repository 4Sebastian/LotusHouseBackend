"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _readOnlyError2 = _interopRequireDefault(require("@babel/runtime/helpers/readOnlyError"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _user = _interopRequireDefault(require("../models/user"));

var _express = _interopRequireDefault(require("express"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var authCheck = require('../middlewares/authCheck').authCheck;

var router = _express["default"].Router();

var bcrypt = require('bcrypt');

var crypto = require('crypto');

var sgMail = require('@sendgrid/mail');

var jwt = require('jsonwebtoken');

var saltRounds = 10;

require('dotenv').config({
  path: '../../src/.env'
});

router.post('/login', /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var userName, password;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            userName = req.body.username;
            password = req.body.hashedPassword;

            if (!(!userName || !password)) {
              _context2.next = 7;
              break;
            }

            if (userName) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt("return", res.send({
              error: 'User name required'
            }));

          case 5:
            if (password) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt("return", res.send({
              error: 'password required'
            }));

          case 7:
            _user["default"].find( /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(err, users) {
                var cnt, found, compareRes, secret, token;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        cnt = 0;
                        found = false;

                      case 2:
                        if (!(!found && cnt < users.length)) {
                          _context.next = 10;
                          break;
                        }

                        _context.next = 5;
                        return bcrypt.compare(password, users[0].hashedPassword);

                      case 5:
                        compareRes = _context.sent;

                        if (userName == users[cnt].userName && compareRes) {
                          found = true;
                        }

                        cnt++;
                        _context.next = 2;
                        break;

                      case 10:
                        _context.prev = 10;

                        if (!found) {
                          _context.next = 18;
                          break;
                        }

                        secret = "" + process.env.JWT_SECRET;
                        token = jwt.sign({
                          userID: userName
                        }, secret, {
                          expiresIn: 60 * 60
                        });
                        console.log("logged in");
                        return _context.abrupt("return", res.send({
                          token: token
                        }));

                      case 18:
                        res.status(401);
                        return _context.abrupt("return", res.send({
                          error: 'Invalid username or password'
                        }));

                      case 20:
                        _context.next = 27;
                        break;

                      case 22:
                        _context.prev = 22;
                        _context.t0 = _context["catch"](10);
                        console.log(_context.t0);
                        res.status(401);
                        return _context.abrupt("return", res.send({
                          error: 'Invalid username or password'
                        }));

                      case 27:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[10, 22]]);
              }));

              return function (_x3, _x4) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.post('/signup', authCheck, /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    var userName, email, password, shelterName;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            userName = req.body.username;
            email = req.body.email;
            password = req.body.hashedPassword;
            shelterName = req.body.shelterName;

            if (!(!userName || !password)) {
              _context4.next = 6;
              break;
            }

            return _context4.abrupt("return", res.send({
              error: "need username and password"
            }));

          case 6:
            _user["default"].find( /*#__PURE__*/function () {
              var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(err, users) {
                var cnt, found, msg, hashedPassword, temp, user;
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        cnt = 0;
                        found = false;
                        msg = "";

                        while (!found && cnt < users.length) {
                          if (userName == users[cnt].userName || email == users[cnt].email || shelterName == users[cnt].shelterName) {
                            found = true;

                            if (userName == users[cnt].userName) {
                              msg = "The username is already taken";
                            } else if (email == users[cnt].email) {
                              msg = "The email is already taken";
                            } else if (shelterName == users[cnt].shelterName) {
                              msg = "The shelter name is already taken";
                            } else {
                              msg = "something is just wrong!";
                            }
                          }

                          cnt++;
                        }

                        if (found) {
                          _context3.next = 21;
                          break;
                        }

                        _context3.prev = 5;
                        _context3.next = 8;
                        return bcrypt.hash(password, saltRounds);

                      case 8:
                        hashedPassword = _context3.sent;
                        temp = {
                          "userName": userName,
                          "hashedPassword": hashedPassword,
                          "email": email,
                          "shelterName": shelterName
                        };
                        user = new _user["default"](temp);
                        user.save().then(function (user) {
                          res.status(200).send('Added succesfully');
                          console.log("worked");
                        })["catch"](function (err) {
                          res.status(400).send('Failed to create new record');
                          console.log(err);
                        });
                        _context3.next = 19;
                        break;

                      case 14:
                        _context3.prev = 14;
                        _context3.t0 = _context3["catch"](5);
                        console.log(_context3.t0);
                        res.status(400);
                        return _context3.abrupt("return", res.send({
                          error: _context3.t0
                        }));

                      case 19:
                        _context3.next = 23;
                        break;

                      case 21:
                        res.status(400).send(msg);
                        console.log(err);

                      case 23:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, null, [[5, 14]]);
              }));

              return function (_x7, _x8) {
                return _ref4.apply(this, arguments);
              };
            }());

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
router.post('/register', /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
    var userName, shelterName, email, secret, token, verifiedToken, msg;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            userName = req.body.name;
            shelterName = req.body.shelter;
            email = req.body.email; //const buffer = await crypto.randomBytes(16);
            //const verifiedToken = buffer.toString("hex");

            if (userName) {
              _context5.next = 7;
              break;
            }

            return _context5.abrupt("return", res.send({
              error: 'User name required'
            }));

          case 7:
            if (shelterName) {
              _context5.next = 11;
              break;
            }

            return _context5.abrupt("return", res.send({
              error: 'shelter name required'
            }));

          case 11:
            if (email) {
              _context5.next = 15;
              break;
            }

            return _context5.abrupt("return", res.send({
              error: 'email required'
            }));

          case 15:
            secret = "" + process.env.JWT_SECRET;
            token = jwt.sign({
              userID: userName
            }, secret, {
              expiresIn: '10d'
            });
            verifiedToken = token;

            try {
              //const passwordResetUrl = `${"" + process.env.FRONTEND_URL}/passwordReset?passwordResetToken=${passwordResetToken}`;
              sgMail.setApiKey("" + process.env.SENDGRID_KEY);
              msg = {
                to: 'lotushouseapp@gmail.com',
                from: '' + process.env.FROM_EMAIL,
                subject: 'Requested Shelter Account Creation',
                text: "".concat(userName, " from ").concat(shelterName, ", has requested to create an account in the app. Their email to reference them is ").concat(email, ". If everything is good to go, here is the verification they would use within the next 10 days starting TODAY: ").concat(verifiedToken),
                html: "<p>".concat(userName, " from ").concat(shelterName, ",</p>\n                        <p>\n                        has requested to create an account in the app. Their email to reference them is ").concat(email, ".\n                        </p>\n                        <p>\n                        If everything is good to go, here is the verification they would use within the next 10 days starting TODAY:\n                        </p>\n                        <p>\n                            <h1>").concat(verifiedToken, "</h1>\n                        </p>")
              };
              sgMail.send(msg);
              res.send({
                msges: 'Successfully sent email'
              });
            } catch (ex) {
              console.log(ex);
              res.send(ex, 500);
            }

          case 19:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}()); // router.put('/updateUser', authCheck, async function (req, res) {
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

router.post('/passwordResetRequest', /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var userName, email, buffer, passwordResetToken;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            userName = req.body.username;
            email = req.body.email;
            _context6.next = 4;
            return crypto.randomBytes(32);

          case 4:
            buffer = _context6.sent;
            passwordResetToken = buffer.toString("hex");

            try {
              _user["default"].find(function (err, users) {
                var cnt = 0;
                var found = false;

                while (!found && cnt < users.length) {
                  if (userName == users[cnt].userName && email == users[cnt].email) {
                    found = true;
                  }

                  cnt++;
                }

                if (found) {
                  users[cnt - 1].passwordResetToken = passwordResetToken;
                  users[cnt - 1].save(); //const passwordResetUrl = `${"" + process.env.FRONTEND_URL}/passwordReset?passwordResetToken=${passwordResetToken}`;

                  sgMail.setApiKey("" + process.env.SENDGRID_KEY);
                  var msg = {
                    to: '' + email,
                    from: '' + process.env.FROM_EMAIL,
                    subject: 'Password Reset Request',
                    text: "Dear user,You can reset your password with this code: ".concat(passwordResetToken, ". Enter this code in the app to change your password."),
                    html: "<p>Dear user,</p>\n                <p>\n                    You can reset your password with this code:\n                </p>\n                <p>\n                    <h1>".concat(passwordResetToken, "</h1>\n                </p>\n                <p>\n                    Enter this code in the app to change your password.\n                </p>\n                ")
                  };
                  sgMail.send(msg);
                  res.send({
                    msges: 'Successfully sent email'
                  });
                } else {
                  if (!userName || !email) {
                    if (!userName) {
                      return res.send({
                        error: 'User name required'
                      });
                    }

                    if (!email) {
                      return res.send({
                        error: 'Email required'
                      });
                    }
                  } else {
                    return res.send({
                      error: 'Please check username and email'
                    });
                  }
                }
              });
            } catch (ex) {
              console.log(ex);
              res.send(ex, 500);
            }

          case 7:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}());
router.post('/passwordReset', /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var password, passwordResetToken, userName;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            password = req.body.hashedPassword;
            passwordResetToken = req.body.passwordResetToken;
            userName = req.body.userName;

            try {
              _user["default"].find( /*#__PURE__*/function () {
                var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(err, users) {
                  var cnt, found, buffer, newPasswordResetToken, hashedPassword;
                  return _regenerator["default"].wrap(function _callee7$(_context7) {
                    while (1) {
                      switch (_context7.prev = _context7.next) {
                        case 0:
                          cnt = 0;
                          found = false;

                          while (!found && cnt < users.length) {
                            if (userName == users[cnt].userName && passwordResetToken == users[cnt].passwordResetToken) {
                              found = true;
                            }

                            cnt++;
                          }

                          if (!found) {
                            _context7.next = 15;
                            break;
                          }

                          buffer = crypto.randomBytes(32);
                          newPasswordResetToken = buffer.toString("hex");
                          _context7.next = 8;
                          return bcrypt.hash(password, saltRounds);

                        case 8:
                          hashedPassword = _context7.sent;
                          users[cnt - 1].hashedPassword = hashedPassword;
                          users[cnt - 1].passwordResetToken = newPasswordResetToken;
                          users[cnt - 1].save();
                          res.send({
                            message: 'Successfully reset password'
                          });
                          _context7.next = 16;
                          break;

                        case 15:
                          res.send({
                            message: 'incorrect token'
                          });

                        case 16:
                        case "end":
                          return _context7.stop();
                      }
                    }
                  }, _callee7);
                }));

                return function (_x15, _x16) {
                  return _ref8.apply(this, arguments);
                };
              }());
            } catch (ex) {
              console.log(ex);
              res.send(ex, 500);
            }

          case 4:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function (_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}());
router.post('/getAllNames', /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res) {
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _user["default"].find(function (err, users) {
              var names = "";

              for (var i = 0; i < users.length; (0, _readOnlyError2["default"])("i"), i++) {
                names += ((0, _readOnlyError2["default"])("names"), users.shelterName + "||");
              }

              res.send({
                message: names
              });
            });

          case 1:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function (_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}());
module.exports = router;