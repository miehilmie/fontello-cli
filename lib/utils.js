'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _needle = require('needle');

var _needle2 = _interopRequireDefault(_needle);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Util = {
    dirIsValid: function dirIsValid(path) {
        var e;
        try {
            return _fs2.default.statSync(path).isDirectory();
        } catch (_error) {
            return false;
        }
    }
};

exports.default = Util;