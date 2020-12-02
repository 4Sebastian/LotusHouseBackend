"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var Room = new Schema({
  name: {
    type: String
  },
  number: {
    type: String
  },
  events: {
    type: [String]
  },
  shelterName: {
    type: String
  },
  formDate: {
    type: String
  }
});

var _default = _mongoose["default"].model('Room', Room);

exports["default"] = _default;