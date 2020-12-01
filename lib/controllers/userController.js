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
                var cnt, found, msg, compareRes, hashedPassword, temp, user;
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        cnt = 0;
                        found = false;
                        msg = "";

                      case 3:
                        if (!(!found && cnt < users.length)) {
                          _context3.next = 11;
                          break;
                        }

                        _context3.next = 6;
                        return bcrypt.compare(password, users[cnt].hashedPassword);

                      case 6:
                        compareRes = _context3.sent;

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
                        _context3.next = 3;
                        break;

                      case 11:
                        if (found) {
                          _context3.next = 27;
                          break;
                        }

                        _context3.prev = 12;
                        _context3.next = 15;
                        return bcrypt.hash(password, saltRounds);

                      case 15:
                        hashedPassword = _context3.sent;
                        temp = {
                          "userName": userName,
                          "hashedPassword": hashedPassword,
                          "email": email,
                          "shelterName": shelterName
                        };
                        user = new _user["default"](temp);
                        user.save().then(function (user) {
                          console.log("worked");
                          return res.status(200).send('Added succesfully');
                        })["catch"](function (err) {
                          console.log(err);
                          return res.status(400).send('Failed to create new record');
                        });
                        _context3.next = 25;
                        break;

                      case 21:
                        _context3.prev = 21;
                        _context3.t0 = _context3["catch"](12);
                        console.log(_context3.t0);
                        return _context3.abrupt("return", res.status(400).send({
                          error: "An interesting error occurred"
                        }));

                      case 25:
                        _context3.next = 29;
                        break;

                      case 27:
                        console.log(err);
                        return _context3.abrupt("return", res.status(400).send(msg));

                      case 29:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, null, [[12, 21]]);
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
            _context5.prev = 23;
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
            return _context5.abrupt("return", res.send({
              msges: 'Successfully sent email'
            }));

          case 30:
            _context5.prev = 30;
            _context5.t0 = _context5["catch"](23);
            console.log(_context5.t0);
            return _context5.abrupt("return", res.send("errorzzz", 500));

          case 34:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[23, 30]]);
  }));

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());
router.post('/updateUser', authCheck, /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    var shelterName, userName, found, cnt;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            shelterName = req.body.shelter;
            userName = req.body.userName;
            found = false; // User.find((err, users) => {
            //     for(var i = 0; i < users.length; i++){
            //         if(users[i].userName == userName){
            //             found = true;
            //             return res.status(400).send({ message: 'Username Taken'});
            //         }
            //     }
            // });

            cnt = 0; // if (!found) {

            _user["default"].find({
              shelterName: shelterName
            }, function (err, users) {
              while (cnt < users.length) {
                console.log("current: " + users[cnt].userName + ": and checking: " + userName);

                if (userName == users[cnt].userName) {
                  found = true;
                }

                cnt++;
              }

              if (!found) {
                try {
                  users[0].userName = userName;
                  users[0].save();
                  console.log(shelterName + ": uhuh:" + users[0].userName);
                  return res.status(200).send('Updated succesfully');
                } catch (ex) {
                  res.status(400);
                  console.log(ex);
                  return res.send({
                    error: ex
                  });
                }
              } else {
                return res.status(400).send({
                  message: 'Username Taken'
                });
              }
            }); // } else {
            //     return res.status(400).send({ message: 'Username Taken' });
            // }


          case 5:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}()); // function foundUsername(userName) {
//     User.find((err, users) => {
//         // for (var i = 0; i < users.length; i++) {
//         //     if (users[i].userName == userName) {
//         //         return true;
//         //     }
//         // }
//         return false;
//     });
// }

router.post('/updatePassword', authCheck, /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var shelterName, password, found;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            shelterName = req.body.shelter;
            password = req.body.password;
            found = false; // User.find(async (err, users) => {
            //     for(var i = 0; i < users.length; i++){
            //         const compareRes = await bcrypt.compare(password, users[i].hashedPassword);
            //         if(users[i].hashedPassword == compareRes){
            //             found = true;
            //             return res.status(400).send({ message: 'Password Taken'});
            //         }
            //     }
            // });
            // if (!foundPassword(password)) {

            _user["default"].find({
              shelterName: shelterName
            }, /*#__PURE__*/function () {
              var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(err, users) {
                var hashedPassword;
                return _regenerator["default"].wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        while (cnt < users.length) {
                          console.log("current: " + users[cnt].userName + ": and checking: " + userName);

                          if (userName == users[cnt].userName) {
                            found = true;
                          }

                          cnt++;
                        }

                        if (found) {
                          _context7.next = 18;
                          break;
                        }

                        _context7.prev = 2;
                        _context7.next = 5;
                        return bcrypt.hash(password, saltRounds);

                      case 5:
                        hashedPassword = _context7.sent;
                        users[0].hashedPassword = hashedPassword;
                        users[0].save();
                        return _context7.abrupt("return", res.status(200).send({
                          message: 'Password Updated'
                        }));

                      case 11:
                        _context7.prev = 11;
                        _context7.t0 = _context7["catch"](2);
                        res.status(400);
                        console.log(_context7.t0);
                        return _context7.abrupt("return", res.send({
                          error: _context7.t0
                        }));

                      case 16:
                        _context7.next = 19;
                        break;

                      case 18:
                        return _context7.abrupt("return", res.status(400).send({
                          message: 'Password Taken'
                        }));

                      case 19:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7, null, [[2, 11]]);
              }));

              return function (_x15, _x16) {
                return _ref8.apply(this, arguments);
              };
            }()); // } else {
            //     return res.status(400).send({ message: 'Password Taken' });
            // }


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

function foundPassword(password) {
  _user["default"].find( /*#__PURE__*/function () {
    var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(err, users) {
      var cnt, compareRes;
      return _regenerator["default"].wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              cnt = 0;

            case 1:
              if (!(cnt < users.length)) {
                _context9.next = 10;
                break;
              }

              _context9.next = 4;
              return bcrypt.compare(password, users[cnt].hashedPassword);

            case 4:
              compareRes = _context9.sent;

              if (!(users[cnt++].hashedPassword == compareRes)) {
                _context9.next = 8;
                break;
              }

              found = true;
              return _context9.abrupt("return", true);

            case 8:
              _context9.next = 1;
              break;

            case 10:
              return _context9.abrupt("return", false);

            case 11:
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
}

router.post('/deleteAccount', authCheck, /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res) {
    var userName, shelterName, email, hashedPassword;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            userName = req.body.name;
            shelterName = req.body.shelter;
            email = req.body.email;
            hashedPassword = req.body.hashedPassword;

            _user["default"].find({
              shelterName: shelterName
            }, /*#__PURE__*/function () {
              var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(err, user) {
                var compareRes;
                return _regenerator["default"].wrap(function _callee10$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        _context10.next = 2;
                        return bcrypt.compare(hashedPassword, user[0].hashedPassword);

                      case 2:
                        compareRes = _context10.sent;

                        if (!(user[0].userName == userName && compareRes && user[0].email == email)) {
                          _context10.next = 9;
                          break;
                        }

                        user[0].deleteOne();
                        res.status(200);
                        return _context10.abrupt("return", res.send({
                          message: 'User deleted',
                          condition1: user[0].userName == userName,
                          condition2: compareRes,
                          condition3: user[0].email == email
                        }));

                      case 9:
                        res.status(404);
                        return _context10.abrupt("return", res.send({
                          message: 'User not deleted',
                          condition1: user[0].userName == userName,
                          condition2: compareRes,
                          condition3: user[0].email == email
                        }));

                      case 11:
                      case "end":
                        return _context10.stop();
                    }
                  }
                }, _callee10);
              }));

              return function (_x21, _x22) {
                return _ref11.apply(this, arguments);
              };
            }());

          case 5:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function (_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}());
router.post('/passwordResetRequest', /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res) {
    var userName, email, buffer, shelterName, passwordResetToken;
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            userName = req.body.username;
            email = req.body.email;
            _context12.next = 4;
            return crypto.randomBytes(32);

          case 4:
            buffer = _context12.sent;
            shelterName = req.body.shelterName;
            passwordResetToken = buffer.toString("hex");
            _context12.prev = 7;

            _user["default"].find(function (err, users) {
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
                return res.send({
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

            _context12.next = 15;
            break;

          case 11:
            _context12.prev = 11;
            _context12.t0 = _context12["catch"](7);
            console.log(_context12.t0);
            return _context12.abrupt("return", res.send(_context12.t0, 500));

          case 15:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[7, 11]]);
  }));

  return function (_x23, _x24) {
    return _ref12.apply(this, arguments);
  };
}());
router.post('/passwordReset', /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res) {
    var password, passwordResetToken, shelterName;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            password = req.body.hashedPassword;
            passwordResetToken = req.body.passwordResetToken;
            shelterName = req.body.shelterName;
            _context14.prev = 3;

            _user["default"].find( /*#__PURE__*/function () {
              var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(err, users) {
                var cnt, found, buffer, newPasswordResetToken, hashedPassword;
                return _regenerator["default"].wrap(function _callee13$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        cnt = 0;
                        found = false;

                        while (!found && cnt < users.length) {
                          if (passwordResetToken == users[cnt].passwordResetToken && shelterName == users[cnt].shelterName) {
                            found = true;
                          }

                          cnt++;
                        }

                        if (!found) {
                          _context13.next = 15;
                          break;
                        }

                        buffer = crypto.randomBytes(32);
                        newPasswordResetToken = buffer.toString("hex");
                        _context13.next = 8;
                        return bcrypt.hash(password, saltRounds);

                      case 8:
                        hashedPassword = _context13.sent;
                        users[cnt - 1].hashedPassword = hashedPassword;
                        users[cnt - 1].passwordResetToken = newPasswordResetToken;
                        users[cnt - 1].save();
                        return _context13.abrupt("return", res.send({
                          message: 'Successfully reset password'
                        }));

                      case 15:
                        return _context13.abrupt("return", res.send({
                          message: 'incorrect token'
                        }));

                      case 16:
                      case "end":
                        return _context13.stop();
                    }
                  }
                }, _callee13);
              }));

              return function (_x27, _x28) {
                return _ref14.apply(this, arguments);
              };
            }());

            _context14.next = 11;
            break;

          case 7:
            _context14.prev = 7;
            _context14.t0 = _context14["catch"](3);
            console.log(_context14.t0);
            return _context14.abrupt("return", res.send(_context14.t0, 500));

          case 11:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[3, 7]]);
  }));

  return function (_x25, _x26) {
    return _ref13.apply(this, arguments);
  };
}());
router.post('/getAllNames', /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(req, res) {
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _user["default"].find(function (err, users) {
              var names = "";

              for (var i = 0; i < users.length; i++) {
                names += users[i].shelterName + "||";
              }

              return res.send({
                message: names
              });
            });

          case 1:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));

  return function (_x29, _x30) {
    return _ref15.apply(this, arguments);
  };
}());
module.exports = router;