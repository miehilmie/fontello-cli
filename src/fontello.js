
import fs from 'fs';
import needle from 'needle';
import open from 'open';
import path from 'path';
import unzip2 from 'unzip2';
import colors from 'colors';
import jsonfile from 'jsonfile';

import fcfg from './config';
import utils from './utils';
import request from './request';

export default class fontello {

  install(options, debug) {

    if (options.css && options.font) {
      if (!utils.dirIsValid(options.css)) {
        console.log('--css path provided is not a directory.\n'.red);
        process.exit(1);
      }
      if (!utils.dirIsValid(options.font)) {
        console.log('--font path provided is not a directory.\n'.red);
        process.exit(1);
      }
    }

    const fontelloConfig = path.join(process.cwd(), fcfg.fontelloConfigFileName);

    if (!fs.existsSync(fontelloConfig)) {
      console.log(colors.red(`File ${fcfg.fontelloConfigFileName} doesn't exist in current working directory. Run fontello-cli init to initialize.`))
      return 0;
    }

    const dataJson = jsonfile.readFileSync(fontelloConfig)

    if (!dataJson.config || !dataJson.config.path || !dataJson.config.file) {
      console.log(colors.red(`${fcfg.fontelloConfigFileName} cannot be read correctly.`))
      return 0;
    }

    const config = path.join(dataJson.config.path, dataJson.config.file);

    if (!fs.existsSync(config)) {
      console.log(colors.red(`${config} doesn't exists. Run fontello-cli open first.`))
      return 0;
    }

    if ( ! dataJson.sessionId) {
      console.log(colors.red(`.fontello.json doesn't contain sessionId. Run fontello-cli open first.`))
      return 0;
    }


    const zipFile = request.downloadZip({
      sessionId: dataJson.sessionId,
      host: options.host,
      proxy: options.proxy
    })

    const cssPath = options.css ? options.css : dataJson.config.path;
    const fontPath = options.font ? options.css : dataJson.config.path;

    return zipFile.pipe(unzip2.Parse())
      .on('entry', (entry) => {

        const pathName = entry.path;
        const type = entry.type;

        if (type === 'File') {
          let ref;
          const dirName = (ref = path.dirname(pathName).match(/\/([^\/]*)$/)) != null ? ref[1] : void 0;
          const fileName = path.basename(pathName);

          if (fileName === fcfg.configFileName) {
            return entry.pipe(fs.createWriteStream(config));
          }

          switch (dirName) {
            case 'css':
              const cssOutputPath = path.join(cssPath, fileName);
              return entry.pipe(fs.createWriteStream(cssOutputPath));
            case 'font':
              const fontOutputPath = path.join(fontPath, fileName);
              return entry.pipe(fs.createWriteStream(fontOutputPath));
            default:
              return entry.autodrain();
          }
        }
      })
      .on('finish', () => {
        return console.log('Install complete.\n'.green);
      });

  }

  open(options, debug) {

    const fontelloConfig = path.join(process.cwd(), fcfg.fontelloConfigFileName);

    if (!fs.existsSync(fontelloConfig)) {
      console.log(colors.red(`File ${fcfg.fontelloConfigFileName} doesn't exist in current working directory. Run fontello-cli init to initialize.`))
      return 0;
    }

    const dataJson = jsonfile.readFileSync(fontelloConfig)

    if (!dataJson.config || !dataJson.config.path || !dataJson.config.file) {
      console.log(colors.red(`${fcfg.fontelloConfigFileName} cannot be read correctly.`))
      return 0;
    }

    const config = path.join(dataJson.config.path, dataJson.config.file);

    if (!fs.existsSync(config)) {
      console.log(colors.red(`${config} cannot be opened or file not exists.`))
      return 0;
    }

    return request.requestSession({
      host: options.host,
      proxy: options.proxy,
      config: config
    })
      .then(sessionId => {
        dataJson.sessionId = sessionId;

        const sessionUrl = fcfg.fontelloHost
          .concat('/')
          .concat(sessionId);

        jsonfile.spaces = 4
        jsonfile.writeFileSync(fontelloConfig, dataJson);

        console.log(colors.green(`opening browser: ${sessionUrl}`))

        open(sessionUrl);
      })
      .catch(error => {
        console.log(colors.red(`${error}`))
      });
  }

  init(options, debug) {

    const fontelloConfig = path.join(process.cwd(), fcfg.fontelloConfigFileName);
    if (fs.existsSync(fontelloConfig)) {
      console.log(colors.red(`File ${fcfg.fontelloConfigFileName} already exists.`))
      return 0;
    }

    const dataJson = {
      config: {
        path: options.config || process.cwd(),
        file: options.file || fcfg.configFileName,
      }
    };

    jsonfile.spaces = 4
    jsonfile.writeFileSync(fontelloConfig, dataJson);

    console.log(colors.green(`File`))
  }

};


