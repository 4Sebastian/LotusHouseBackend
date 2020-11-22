"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

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
    var userName, password, shelterName;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            userName = req.body.username;
            password = req.body.hashedPassword;
            shelterName = req.body.shelterName;

            if (!(!userName || !password)) {
              _context2.next = 8;
              break;
            }

            if (userName) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt("return", res.send({
              error: 'User name required'
            }));

          case 6:
            if (password) {
              _context2.next = 8;
              break;
            }

            return _context2.abrupt("return", res.send({
              error: 'password required'
            }));

          case 8:
            if (shelterName) {
              _context2.next = 10;
              break;
            }

            return _context2.abrupt("return", res.send({
              error: 'shelter name required'
            }));

          case 10:
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
                        return bcrypt.compare(password, users[cnt].hashedPassword);

                      case 5:
                        compareRes = _context.sent;

                        if (userName == users[cnt].userName && compareRes && shelterName == users[cnt].shelterName) {
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

          case 11:
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
    var userName, shelterName, email, phoneNumber, secret, token, verifiedToken, msg;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            userName = req.body.name;
            shelterName = req.body.shelter;
            email = req.body.email;
            phoneNumber = req.body.phoneNumber; //const buffer = await crypto.randomBytes(16);
            //const verifiedToken = buffer.toString("hex");

            if (userName) {
              _context5.next = 8;
              break;
            }

            return _context5.abrupt("return", res.send({
              error: 'User name required'
            }));

          case 8:
            if (shelterName) {
              _context5.next = 12;
              break;
            }

            return _context5.abrupt("return", res.send({
              error: 'shelter name required'
            }));

          case 12:
            if (email) {
              _context5.next = 16;
              break;
            }

            return _context5.abrupt("return", res.send({
              error: 'email required'
            }));

          case 16:
            if (phoneNumber) {
              _context5.next = 20;
              break;
            }

            return _context5.abrupt("return", res.send({
              error: 'phone number required'
            }));

          case 20:
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
                text: "".concat(userName, " from ").concat(shelterName, ", has requested to create an account in the app. Their email to reference them is ").concat(email, "; their phone number to reference them is ").concat(phoneNumber, ". If everything is good to go, here is the verification they would use within the next 10 days starting TODAY: ").concat(verifiedToken),
                html: "<p>".concat(userName, " from ").concat(shelterName, ",</p>\n                        <p>\n                        has requested to create an account in the app. Their email to reference them is ").concat(email, "; their phone number to reference them is ").concat(phoneNumber, ".\n                        </p>\n                        <p>\n                        If everything is good to go, here is the verification they would use within the next 10 days starting TODAY:\n                        </p>\n                        <p>\n                            <h1>").concat(verifiedToken, "</h1>\n                        </p>")
              };
              sgMail.send(msg);
              res.send({
                msges: 'Successfully sent email'
              });
            } catch (ex) {
              console.log(ex);
              res.send(ex, 500);
            }

          case 24:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());
router.post('/updateUser', authCheck, /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var shelterName, userName;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            shelterName = req.body.shelter;
            userName = req.body.userName;

            _user["default"].find(function (err, users) {
              for (var i = 0; i < users.length; i++) {
                if (users[i].userName = userName) {
                  return res.send({
                    message: 'Username Taken'
                  });
                }
              }
            });

            _user["default"].find({
              shelterName: shelterName
            }, function (err, users) {
              users[0].username = userName;
              users[0].save().then(function (user) {
                res.status(200).send('Updated succesfully');
              })["catch"](function (err) {
                res.status(400).send('Failed to update');
              });
              return res.send({
                message: 'User updated'
              });
            });

          case 4:
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
router.post('/updatePassword', authCheck, /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var shelterName, password;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            shelterName = req.body.shelter;
            password = req.body.password;

            _user["default"].find(function (err, users) {
              for (var i = 0; i < users.length; i++) {
                if (users[i].hashedPassword = password) {
                  return res.send({
                    message: 'Username Taken'
                  });
                }
              }
            });

            _user["default"].find({
              shelterName: shelterName
            }, /*#__PURE__*/function () {
              var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(err, users) {
                var hashedPassword;
                return _regenerator["default"].wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.prev = 0;
                        _context7.next = 3;
                        return bcrypt.hash(password, saltRounds);

                      case 3:
                        hashedPassword = _context7.sent;
                        users[0].hashedPassword = hashedPassword;
                        users.save().then(function (user) {
                          res.status(200).json({
                            'user': 'Update Done'
                          });
                        });
                        return _context7.abrupt("return", res.send({
                          message: 'User created'
                        }));

                      case 9:
                        _context7.prev = 9;
                        _context7.t0 = _context7["catch"](0);
                        res.status(400);
                        return _context7.abrupt("return", res.send({
                          error: _context7.t0
                        }));

                      case 13:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7, null, [[0, 9]]);
              }));

              return function (_x15, _x16) {
                return _ref8.apply(this, arguments);
              };
            }());

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
router.post('/deleteAccount', authCheck, /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res) {
    var userName, shelterName, email, hashedPassword;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            userName = req.body.name;
            shelterName = req.body.shelter;
            email = req.body.email;
            hashedPassword = req.body.hashedPassword;

            _user["default"].find({
              shelterName: shelterName
            }, /*#__PURE__*/function () {
              var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(err, user) {
                var compareRes;
                return _regenerator["default"].wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        _context9.next = 2;
                        return bcrypt.compare(hashedPassword, users[0].hashedPassword);

                      case 2:
                        compareRes = _context9.sent;

                        if (!(user[0].userName == userName && compareRes && user[0].shelterName == shelterName && user[0].email == email && user[0].hashedPassword == hashedPassword)) {
                          _context9.next = 8;
                          break;
                        }

                        user[0].deleteOne();
                        return _context9.abrupt("return", res.send({
                          message: 'User deleted'
                        }));

                      case 8:
                        return _context9.abrupt("return", res.send({
                          message: 'User not deleted'
                        }));

                      case 9:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9);
              }));

              return function (_x19, _x20) {
                return _ref10.apply(this, arguments);
              };
            }());

          case 5:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function (_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}());
router.post('/passwordResetRequest', /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res) {
    var userName, email, buffer, passwordResetToken;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            userName = req.body.username;
            email = req.body.email;
            _context11.next = 4;
            return crypto.randomBytes(32);

          case 4:
            buffer = _context11.sent;
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
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function (_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}());
router.post('/passwordReset', /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res) {
    var password, passwordResetToken, userName;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            password = req.body.hashedPassword;
            passwordResetToken = req.body.passwordResetToken;
            userName = req.body.userName;

            try {
              _user["default"].find( /*#__PURE__*/function () {
                var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(err, users) {
                  var cnt, found, buffer, newPasswordResetToken, hashedPassword;
                  return _regenerator["default"].wrap(function _callee12$(_context12) {
                    while (1) {
                      switch (_context12.prev = _context12.next) {
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
                            _context12.next = 15;
                            break;
                          }

                          buffer = crypto.randomBytes(32);
                          newPasswordResetToken = buffer.toString("hex");
                          _context12.next = 8;
                          return bcrypt.hash(password, saltRounds);

                        case 8:
                          hashedPassword = _context12.sent;
                          users[cnt - 1].hashedPassword = hashedPassword;
                          users[cnt - 1].passwordResetToken = newPasswordResetToken;
                          users[cnt - 1].save();
                          res.send({
                            message: 'Successfully reset password'
                          });
                          _context12.next = 16;
                          break;

                        case 15:
                          res.send({
                            message: 'incorrect token'
                          });

                        case 16:
                        case "end":
                          return _context12.stop();
                      }
                    }
                  }, _callee12);
                }));

                return function (_x25, _x26) {
                  return _ref13.apply(this, arguments);
                };
              }());
            } catch (ex) {
              console.log(ex);
              res.send(ex, 500);
            }

          case 4:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function (_x23, _x24) {
    return _ref12.apply(this, arguments);
  };
}());
router.post('/getAllNames', /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res) {
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _user["default"].find(function (err, users) {
              var names = "";

              for (var i = 0; i < users.length; i++) {
                names += users[i].shelterName + "||";
              }

              res.send({
                message: names
              });
            });

          case 1:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));

  return function (_x27, _x28) {
    return _ref14.apply(this, arguments);
  };
}());
module.exports = router;