import logging from '@src/system/logging';
import config from '@src/system/config';
import ejs = require('ejs');
import fs from 'fs';
import { fromSrc } from '@src/util/system';
import { BlogNodeError } from '../system/error';

const logger = logging.getLogger('HtmlRender');

const templateFilePath = fromSrc('html.ejs');

let htmlRender = ejs.compile(fs.readFileSync(templateFilePath).toString());

if (config.isDev) {
  fs.watchFile(templateFilePath, { interval: 200 }, () => {
    htmlRender = ejs.compile(fs.readFileSync(templateFilePath).toString());
    logger.debug('Reloaded html template.');
  });
}

export interface ScriptTag{
  src: string
  defer: boolean
  async: boolean
  type?: string
}

export interface LinkTag{
  rel: string
  type: string
  href: string
}

interface HtmlStructure{
  pageTitle: string
  pageHead: string
  scriptTags: ScriptTag[]
  linkTags: LinkTag[]
  pageBody: string
  pageLang: string
  pageCtx: unknown
  pageName: string
}

function renderHtml(content: HtmlStructure): string {
  try {
    return htmlRender(content);
  } catch (e) {
    throw new BlogNodeError('Error occurred when rendering html structure:', { cause: e instanceof Error ? e : undefined });
  }
}

export default {
  renderHtml,
};
