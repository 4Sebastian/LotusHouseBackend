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

router.route('/login').post( /*#__PURE__*/function () {
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
                var secret, compareRes, token;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        secret = "" + process.env.JWT_SECRET;
                        _context.next = 3;
                        return bcrypt.compare(password, users[0].hashedPassword);

                      case 3:
                        compareRes = _context.sent;
                        _context.prev = 4;

                        if (!(compareRes && userName == users[0].userName)) {
                          _context.next = 11;
                          break;
                        }

                        token = jwt.sign({
                          userID: userName
                        }, secret, {
                          expiresIn: 60 * 60
                        });
                        console.log("logged in");
                        return _context.abrupt("return", res.send({
                          token: token
                        }));

                      case 11:
                        res.status(401);
                        return _context.abrupt("return", res.send({
                          error: 'Invalid username or password'
                        }));

                      case 13:
                        _context.next = 20;
                        break;

                      case 15:
                        _context.prev = 15;
                        _context.t0 = _context["catch"](4);
                        console.log(_context.t0);
                        res.status(401);
                        return _context.abrupt("return", res.send({
                          error: 'Invalid username or password'
                        }));

                      case 20:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[4, 15]]);
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
router.route('/signup').post( /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var username, email, password, hashedPassword, temp, user;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            username = req.body.username;
            email = req.body.email;
            password = req.body.hashedPassword;

            if (!(!username || !password)) {
              _context3.next = 5;
              break;
            }

            return _context3.abrupt("return", res.send({
              error: "need username and password"
            }));

          case 5:
            _context3.prev = 5;
            _context3.next = 8;
            return bcrypt.hash(password, saltRounds);

          case 8:
            hashedPassword = _context3.sent;
            temp = {
              "userName": username,
              "hashedPassword": hashedPassword,
              "email": email
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
            logger.error(_context3.t0);
            res.status(400);
            return _context3.abrupt("return", res.send({
              error: _context3.t0
            }));

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[5, 14]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
router.put('/updateUser', authCheck, /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _user["default"].find(function (err, users) {
              var userName = req.body.userName;
              var email = req.body.email;

              if (email == users[0].email) {
                users[0].username = userName;
              }

              users[0].save().then(function (user) {
                res.status(200).send('Updated succesfully');
                console.log("worked");
              })["catch"](function (err) {
                res.status(400).send('Failed to update');
                console.log("did not work");
              });
              return res.send({
                message: 'User updated'
              });
            });

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
router.put('/updatePassword', authCheck, /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _user["default"].find( /*#__PURE__*/function () {
              var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(err, users) {
                var password, hashedPassword;
                return _regenerator["default"].wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        password = req.body.password;
                        _context5.prev = 1;
                        _context5.next = 4;
                        return bcrypt.hash(password, saltRounds);

                      case 4:
                        hashedPassword = _context5.sent;
                        users[0].hashedPassword = hashedPassword;
                        users.save().then(function (user) {
                          res.status(200).json({
                            'user': 'Update Done'
                          });
                        });
                        return _context5.abrupt("return", res.send({
                          message: 'User created'
                        }));

                      case 10:
                        _context5.prev = 10;
                        _context5.t0 = _context5["catch"](1);
                        console.log(_context5.t0);
                        res.status(400);
                        return _context5.abrupt("return", res.send({
                          error: _context5.t0
                        }));

                      case 15:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5, null, [[1, 10]]);
              }));

              return function (_x11, _x12) {
                return _ref6.apply(this, arguments);
              };
            }());

          case 1:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());
router.post('/passwordResetRequest', /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res) {
    var userName, email, buffer, passwordResetToken;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            userName = req.body.username;
            email = req.body.email;
            _context7.next = 4;
            return crypto.randomBytes(32);

          case 4:
            buffer = _context7.sent;
            passwordResetToken = buffer.toString("hex");

            try {
              _user["default"].find(function (err, users) {
                if (userName == users[0].userName && email == users[0].email) {
                  users[0].passwordResetToken = passwordResetToken;
                  users[0].save(); //const passwordResetUrl = `${"" + process.env.FRONTEND_URL}/passwordReset?passwordResetToken=${passwordResetToken}`;

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
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function (_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}());
router.post('/passwordReset', /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res) {
    var password, passwordResetToken, hashedPassword;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            password = req.body.hashedPassword;
            passwordResetToken = req.body.passwordResetToken;
            _context8.next = 4;
            return bcrypt.hash(password, saltRounds);

          case 4:
            hashedPassword = _context8.sent;

            try {
              _user["default"].find(function (err, users) {
                if (passwordResetToken == users[0].passwordResetToken) {
                  var buffer = crypto.randomBytes(32);
                  var newPasswordResetToken = buffer.toString("hex");
                  users[0].hashedPassword = hashedPassword;
                  users[0].passwordResetToken = newPasswordResetToken;
                  users[0].save();
                  res.send({
                    message: 'Successfully reset password'
                  });
                }
              });
            } catch (ex) {
              console.log(ex);
              res.send(ex, 500);
            }

          case 6:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function (_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}());
module.exports = router;