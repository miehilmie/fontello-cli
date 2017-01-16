import fs from 'fs';
import needle from 'needle';
import colors from 'colors';

const Util = {
    dirIsValid(path) {
        var e;
        try {
            return fs.statSync(path).isDirectory();
        } catch (_error) {
            return false;
        }
    },
};

export default Util;