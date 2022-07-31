// import template from '@src/util/template';
import ejs from 'ejs';
import path from 'path';

describe('util', () => {
  describe('template', () => {
    const testData = {
      pageHead: 'testHead',
      pageBody: 'testBody',
      pageTitle: 'testTitle',
      pageLang: 'en',
      scriptTags: [],
      linkTags: [],
      pageCtx: {},
      pageName: 'test',
    };
    it('test', async () => {
      await ejs.renderFile(path.resolve('src/html.ejs'), testData);
    });
    it('util.template', () => {
      // template.renderHtml(testData);
    });
  });
});
