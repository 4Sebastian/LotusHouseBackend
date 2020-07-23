"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var Event = new Schema({
  formDate: {
    type: String
  },
  title: {
    type: String
  },
  date: {
    type: String
  },
  description: {
    type: String
  }
});

var _default = _mongoose["default"].model('Event', Event);

exports["default"] = _default;