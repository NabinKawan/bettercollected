const path = require('path');
module.exports = {
    debug: false,
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'nl', 'np']
    },
    reloadOnPrerender: process.env.NODE_ENV !== 'production',
    localePath: path.resolve('./src/assets/locales/')
};
