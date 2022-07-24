import client from '@blognode/renderer-react/client';

import 'remixicon/fonts/remixicon.css';
import './styles/main.css';

const pageMap = require.context('./pages', true, /\.tsx$/, 'lazy');
const pageName = document.getElementById('__pagename')?.innerText;

if (module.hot) {
  module.hot.accept();
}

(async () => {
  const pageComponent = (await pageMap(`./${pageName}.tsx`)).default;
  client.init(pageComponent);
})();
