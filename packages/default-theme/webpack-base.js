const path = require('path');

const alias = {
  '@components': path.resolve(__dirname, 'components/'),
  '@layout': path.resolve(__dirname, 'components/layout'),
  '@pages': path.resolve(__dirname, 'pages/'),
  '@util': path.resolve(__dirname, 'util/'),
  '@': path.resolve(__dirname),
};

module.exports = {
  alias,
};
