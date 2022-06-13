/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  distDir: 'dist/.next',
  pageExtensions: ['tsx'],
  cleanDistDir: true,
  webpack: function (config, { isServer, webpack }) {
    if (isServer) {
        config.plugins.push(
            new webpack.IgnorePlugin({ resourceRegExp: /blognode/ })
        );
    }
    return config;
}
};

module.exports = nextConfig;
