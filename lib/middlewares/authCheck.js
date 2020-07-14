"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var jwt = require('jsonwebtoken');

var secret = "" + process.env.JWT_SECRET;

exports.authCheck = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var token;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!req.headers.authorization) {
              _context.next = 6;
              break;
            }

            token = req.headers.authorization.split(' ')[1]; //const token = req.headers.authorization;

            _context.next = 4;
            return jwt.verify(token, secret, function (err, decoded) {
              if (err) {
                res.send(401);
                console.log(token);
                console.log(err);
              } else {
                next();
              }
            });

          case 4:
            _context.next = 7;
            break;

          case 6:
            res.send(401);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();