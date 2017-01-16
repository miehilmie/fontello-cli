'use strict';

require('colors');

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _fontello = require('./fontello');

var _fontello2 = _interopRequireDefault(_fontello);

var _process = require('process');

var _process2 = _interopRequireDefault(_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version(_package2.default.version).usage('[command] [options]').option('--host [url]', 'Host to request session id .').option('--proxy [proxy]', 'Proxy .').option('--config <path>', 'path to your config.json .').option('--file <filename>', 'your config.json file name .').option('--css [path]', 'Path to css folder .').option('--font [path]', 'Path to font folder .');

_commander2.default.command('save').description('download fontello. without --css and --font flags, the full download is extracted.').action(function (env, options) {
  return new _fontello2.default().install({
    config: _commander2.default.config,
    css: _commander2.default.css,
    font: _commander2.default.font,
    host: _commander2.default.host,
    proxy: _commander2.default.proxy
  }, _commander2.default.debug);
}).option('--css [path]', 'Path to css folder .').option('--font [path]', 'Path to font folder .');

_commander2.default.command('open').description('open the fontello website with your config file preloaded.').action(function (env, options) {
  return new _fontello2.default().open({
    host: _commander2.default.host,
    proxy: _commander2.default.proxy
  }, _commander2.default.debug);
}).option('--host [url]', 'Host to request session id .').option('--proxy [proxy]', 'Proxy .');

_commander2.default.command('init').description('initializing fontello-cli configuration').action(function (env, options) {
  return new _fontello2.default().init({
    config: _commander2.default.config,
    file: _commander2.default.file
  }, _commander2.default.debug);
}).option('--config <path>', 'path to your config.json .').option('--file <filename>', 'your config.json file name .');

_commander2.default.on('--help', function () {
  console.log('  Examples:');
  console.log('');
  console.log('    $ fontello-cli init [ --config ./assets ]');
  console.log('    $ fontello-cli open');
  console.log('    $ fontello-cli save');
  console.log('');
});

_commander2.default.parse(_process2.default.argv);