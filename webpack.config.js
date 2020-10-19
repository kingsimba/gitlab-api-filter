var path = require('path');

module.exports = {
    mode: 'production',
    entry: './dist/index.js',
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'gitlab-api-filter.js',
        libraryTarget: 'commonjs'
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.(js|mjs|jsx)$/,
                loader: 'string-replace-loader',
                options: {
                    search: '#!/usr/bin/env node',
                    replace: '',
                }
            }
        ]
    }
};