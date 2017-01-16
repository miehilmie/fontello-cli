import 'colors';
import pjson from '../package.json';
import program from 'commander';
import Fontello from './fontello';

import process from 'process';


program
  .version(pjson.version)
  .usage('[command] [options]')
  .option('--host [url]', 'Host to request session id .')
  .option('--proxy [proxy]', 'Proxy .')
  .option('--config <path>', 'path to your config.json .')
  .option('--file <filename>', 'your config.json file name .')
  .option('--css [path]', 'Path to css folder .')
  .option('--font [path]', 'Path to font folder .');

program
  .command('save')
  .description('download fontello. without --css and --font flags, the full download is extracted.')
  .action(function (env, options) {
    return new Fontello().install({
      config: program.config,
      css: program.css,
      font: program.font,
      host: program.host,
      proxy: program.proxy
    }, program.debug);
  })
  .option('--css [path]', 'Path to css folder .')
  .option('--font [path]', 'Path to font folder .');

program.command('open')
  .description('open the fontello website with your config file preloaded.')
  .action((env, options) => {
    return new Fontello().open({
      host: program.host,
      proxy: program.proxy
    }, program.debug);
  })
  .option('--host [url]', 'Host to request session id .')
  .option('--proxy [proxy]', 'Proxy .');

program
  .command('init')
  .description('initializing fontello-cli configuration')
  .action((env, options) => {
    return new Fontello().init({
      config: program.config,
      file: program.file
    }, program.debug);
  })
  .option('--config <path>', 'path to your config.json .')
  .option('--file <filename>', 'your config.json file name .');

program.on('--help', function(){
  console.log('  Examples:');
  console.log('');
  console.log('    $ fontello-cli init [ --config ./assets ]');
  console.log('    $ fontello-cli open');
  console.log('    $ fontello-cli save');
  console.log('');
});


program.parse(process.argv);
