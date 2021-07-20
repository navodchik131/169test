'use strict';

const _path = require('path'),
	aliasConfig = {},
	sourceBundlePath = '../sources/js/bundles/';

aliasConfig.bundles = {
    products:                                    _path.resolve(`${ sourceBundlePath }products.js`)
};

module.exports = aliasConfig;