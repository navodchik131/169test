'use strict';

const _path = require('path'),
	aliasConfig = {},
	sourceBundlePath = '../sources/js/bundles/';

aliasConfig.bundles = {
    index:                                    _path.resolve(`${ sourceBundlePath }index.js`)
};

module.exports = aliasConfig;