"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var jwt = require('jsonwebtoken');

var secret = "" + process.env.JWT_SECRET;

exports.authCheck = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
    var bearerHeader, bearer, token;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            bearerHeader = req.headers['authorization'];

            if (!(typeof bearerHeader !== 'undefined')) {
              _context.next = 8;
              break;
            }

            bearer = bearerHeader.split(' ');
            token = bearer[1]; //const token = req.headers.authorization;

            _context.next = 6;
            return jwt.verify(token, secret, function (err, decoded) {
              if (err) {
                res.send(401);
                console.log(token);
                console.log(err);
              } else {
                //req.body.uses = decoded.uses;
                next();
              }
            });

          case 6:
            _context.next = 9;
            break;

          case 8:
            res.send(401);

          case 9:
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