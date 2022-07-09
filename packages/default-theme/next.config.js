/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  distDir: 'dist/.next',
  pageExtensions: ['tsx'],
  swcMinify:false,
  cleanDistDir: true,
//   useFileSystemPublicRoutes:false,
};

module.exports = nextConfig;
