'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _needle = require('needle');

var _needle2 = _interopRequireDefault(_needle);

var _open2 = require('open');

var _open3 = _interopRequireDefault(_open2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _unzip = require('unzip2');

var _unzip2 = _interopRequireDefault(_unzip);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _jsonfile = require('jsonfile');

var _jsonfile2 = _interopRequireDefault(_jsonfile);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fontello = function () {
  function fontello() {
    _classCallCheck(this, fontello);
  }

  _createClass(fontello, [{
    key: 'install',
    value: function install(options, debug) {

      if (options.css && options.font) {
        if (!_utils2.default.dirIsValid(options.css)) {
          console.log('--css path provided is not a directory.\n'.red);
          process.exit(1);
        }
        if (!_utils2.default.dirIsValid(options.font)) {
          console.log('--font path provided is not a directory.\n'.red);
          process.exit(1);
        }
      }

      var fontelloConfig = _path2.default.join(process.cwd(), _config2.default.fontelloConfigFileName);

      if (!_fs2.default.existsSync(fontelloConfig)) {
        console.log(_colors2.default.red('File ' + _config2.default.fontelloConfigFileName + ' doesn\'t exist in current working directory. Run fontello-cli init to initialize.'));
        return 0;
      }

      var dataJson = _jsonfile2.default.readFileSync(fontelloConfig);

      if (!dataJson.config || !dataJson.config.path || !dataJson.config.file) {
        console.log(_colors2.default.red(_config2.default.fontelloConfigFileName + ' cannot be read correctly.'));
        return 0;
      }

      var config = _path2.default.join(dataJson.config.path, dataJson.config.file);

      if (!_fs2.default.existsSync(config)) {
        console.log(_colors2.default.red(config + ' doesn\'t exists. Run fontello-cli open first.'));
        return 0;
      }

      if (!dataJson.sessionId) {
        console.log(_colors2.default.red('.fontello.json doesn\'t contain sessionId. Run fontello-cli open first.'));
        return 0;
      }

      var zipFile = _request2.default.downloadZip({
        sessionId: dataJson.sessionId,
        host: options.host,
        proxy: options.proxy
      });

      var cssPath = options.css ? options.css : dataJson.config.path;
      var fontPath = options.font ? options.css : dataJson.config.path;

      return zipFile.pipe(_unzip2.default.Parse()).on('entry', function (entry) {

        var pathName = entry.path;
        var type = entry.type;

        if (type === 'File') {
          var ref = void 0;
          var dirName = (ref = _path2.default.dirname(pathName).match(/\/([^\/]*)$/)) != null ? ref[1] : void 0;
          var fileName = _path2.default.basename(pathName);

          if (fileName === _config2.default.configFileName) {
            return entry.pipe(_fs2.default.createWriteStream(config));
          }

          switch (dirName) {
            case 'css':
              var cssOutputPath = _path2.default.join(cssPath, fileName);
              return entry.pipe(_fs2.default.createWriteStream(cssOutputPath));
            case 'font':
              var fontOutputPath = _path2.default.join(fontPath, fileName);
              return entry.pipe(_fs2.default.createWriteStream(fontOutputPath));
            default:
              return entry.autodrain();
          }
        }
      }).on('finish', function () {
        return console.log('Install complete.\n'.green);
      });
    }
  }, {
    key: 'open',
    value: function open(options, debug) {

      var fontelloConfig = _path2.default.join(process.cwd(), _config2.default.fontelloConfigFileName);

      if (!_fs2.default.existsSync(fontelloConfig)) {
        console.log(_colors2.default.red('File ' + _config2.default.fontelloConfigFileName + ' doesn\'t exist in current working directory. Run fontello-cli init to initialize.'));
        return 0;
      }

      var dataJson = _jsonfile2.default.readFileSync(fontelloConfig);

      if (!dataJson.config || !dataJson.config.path || !dataJson.config.file) {
        console.log(_colors2.default.red(_config2.default.fontelloConfigFileName + ' cannot be read correctly.'));
        return 0;
      }

      var config = _path2.default.join(dataJson.config.path, dataJson.config.file);

      if (!_fs2.default.existsSync(config)) {
        console.log(_colors2.default.red(config + ' cannot be opened or file not exists.'));
        return 0;
      }

      return _request2.default.requestSession({
        host: options.host,
        proxy: options.proxy,
        config: config
      }).then(function (sessionId) {
        dataJson.sessionId = sessionId;

        var sessionUrl = _config2.default.fontelloHost.concat('/').concat(sessionId);

        _jsonfile2.default.spaces = 4;
        _jsonfile2.default.writeFileSync(fontelloConfig, dataJson);

        console.log(_colors2.default.green('opening browser: ' + sessionUrl));

        (0, _open3.default)(sessionUrl);
      }).catch(function (error) {
        console.log(_colors2.default.red('' + error));
      });
    }
  }, {
    key: 'init',
    value: function init(options, debug) {

      var fontelloConfig = _path2.default.join(process.cwd(), _config2.default.fontelloConfigFileName);
      if (_fs2.default.existsSync(fontelloConfig)) {
        console.log(_colors2.default.red('File ' + _config2.default.fontelloConfigFileName + ' already exists.'));
        return 0;
      }

      var dataJson = {
        config: {
          path: options.config || process.cwd(),
          file: options.file || _config2.default.configFileName
        }
      };

      _jsonfile2.default.spaces = 4;
      _jsonfile2.default.writeFileSync(fontelloConfig, dataJson);

      console.log(_colors2.default.green('File'));
    }
  }]);

  return fontello;
}();

exports.default = fontello;
;