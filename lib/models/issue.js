"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var Schema = _mongoose["default"].Schema;
var Issue = new Schema({
  title: {
    type: String
  },
  responsible: {
    type: String
  },
  description: {
    type: String
  },
  severity: {
    type: String
  },
  status: {
    type: String,
    "default": 'Open'
  }
});

var _default = _mongoose["default"].model('Issue', Issue);

exports["default"] = _default;