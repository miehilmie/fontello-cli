'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _needle = require('needle');

var _needle2 = _interopRequireDefault(_needle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Request = {

    /**
     * @params
     * options object({
     *  config full path to config.json file
     *  host (optional)
     *  proxy string (optional)
     * })
     *
     * @return
     * Promise
     *
     * @response
     * sessionId string session id
     */
    requestSession: function requestSession(options) {

        var url = options.host ? options.host : _config2.default.fontelloHost;

        var requestOptions = {
            multipart: true
        };

        if (options.proxy != null) {
            requestOptions.proxy = options.proxy;
        }

        var data = {
            config: {
                file: options.config,
                content_type: 'application/json'
            }
        };

        var promise = new Promise(function (resolve, reject) {
            _needle2.default.post(url, data, requestOptions, function (error, response, body) {
                if (error) return reject(error);

                resolve(body);
            });
        });

        return promise;
    },


    /**
     * @params
     * options object({
     *  sessionId
     *  host (optional)
     *  proxy string (optional)
     * })
     *
     * @return
     * Pipe
     *
     * @response
     * sessionId string session id
     */
    downloadZip: function downloadZip(options) {
        var requestOptions = {};

        var url = options.host ? options.host : _config2.default.fontelloHost;

        if (options.proxy != null) {
            requestOptions.proxy = options.proxy;
        }

        url = url.concat('/').concat(options.sessionId).concat('/get');

        var zipFile = _needle2.default.get(url, requestOptions, function (error, response, body) {
            if (error) throw error;
        });

        return zipFile;
    }
};

exports.default = Request;