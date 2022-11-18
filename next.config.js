/** @type {import('next').NextConfig} */

console.log(process.env);

const runtimeCaching = require('next-pwa/cache');

const { i18n } = require('./next-i18next.config');

const getHostnameFromRegex = (url) => {
    // run against regex
    const matches = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
    // extract hostname (will be empty string if no match is found)
    return matches ? matches[1] : '';
};

const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching,
    buildExcludes: [/middleware-manifest\.json$/]
});

const nextConfig = {
    productionBrowserSourceMaps: true,
    compress: true,
    basePath: process.env.BASE_DEPLOY_PATH ?? '',
    assetPrefix: process.env.BASE_DEPLOY_PATH ?? '',
    distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
    reactStrictMode: true,
    swcMinify: true,
    i18n,
    optimizeFonts: true,
    compiler: {
        emotion: true,
        removeConsole: process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? { exclude: ['info'] } : false
    },
    images: {
        minimumCacheTTL: 600,
        formats: ['image/avif', 'image/webp'],
        domains: ['s3.eu-west-1.wasabisys.com', 's3.eu-central-1.wasabisys.com', 'sireto.com']
    },
    publicRuntimeConfig: {
        CONTACT_US_URL: process.env.CONTACT_US_URL,
        GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID,
        WAITLIST_FORM_URL: process.env.WAITLIST_FORM_URL,
        INDIVIDUAL_FORM_URL: process.env.INDIVIDUAL_FORM_URL,
        BUSINESS_FORM_URL: process.env.BUSINESS_FORM_URL,
        ENTERPRISE_FORM_URL: process.env.ENTERPRISE_FORM_URL,

        // Custom Domain Variables
        IS_CUSTOM_DOMAIN: process.env.IS_CUSTOM_DOMAIN || false,
        CUSTOM_DOMAIN: process.env.CUSTOM_DOMAIN,
        CUSTOM_DOMAIN_JSON: process.env.CUSTOM_DOMAIN_JSON,
        ENABLE_CHECK_MY_DATA: process.env.ENABLE_CHECK_MY_DATA || false,

        // api hosts
        API_ENDPOINT_HOST: process.env.API_ENDPOINT_HOST
    }
};

module.exports = withPWA({
    ...nextConfig,
    ...(process.env.NODE_ENV === 'production' && {
        typescript: {
            ignoreBuildErrors: true
        },
        eslint: {
            ignoreDuringBuilds: true
        }
    })
});
