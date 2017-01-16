import config from './config';
import needle from 'needle';

const Request = {

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
    requestSession(options) {

        const url = options.host ? options.host : config.fontelloHost;

        let requestOptions = {
            multipart: true
        };

        if (options.proxy != null) {
            requestOptions.proxy = options.proxy;
        }

        const data = {
            config: {
                file: options.config,
                content_type: 'application/json'
            }
        };

        var promise = new Promise(function (resolve, reject) {
            needle.post(url, data, requestOptions, (error, response, body) => {
                if (error) return reject(error);

                resolve(body);
            });
        })

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
    downloadZip(options) {
        let requestOptions = {};

        let url = options.host ? options.host : config.fontelloHost;

        if (options.proxy != null) {
            requestOptions.proxy = options.proxy;
        }

        url = url
            .concat('/')
            .concat(options.sessionId)
            .concat('/get');

        const zipFile = needle.get(url, requestOptions, (error, response, body) => {
            if (error) throw error;
        });

        return zipFile;
    }
};

export default Request;