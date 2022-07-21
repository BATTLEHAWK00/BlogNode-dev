import ejs = require('ejs');
import * as fs from 'fs';
import { fromSrc } from '@src/util/system';

const htmlRender = ejs.compile(fs.readFileSync(fromSrc('html.ejs')).toString());

interface HtmlStructure{
  pageTitle: string
  pageHead: string
  scriptTags: ScriptTag[]
  pageBody: string
  pageLang: string
  pageCtx: unknown
}

interface ScriptTag{
  src: string
  defer: boolean
  async: boolean
}

function renderHtml(content: HtmlStructure): string {
  return htmlRender(content);
}

export default {
  renderHtml,
};
