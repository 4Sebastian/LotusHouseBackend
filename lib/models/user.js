"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var User = new Schema({
  userName: {
    type: String
  },
  hashedPassword: {
    type: String
  },
  email: {
    type: String
  },
  shelterName: {
    type: String
  },
  passwordResetToken: {
    type: String
  }
});

var _default = _mongoose["default"].model('User', User);

exports["default"] = _default;