interface PageLink{
  rel: string
  type: string
  href: string
}

interface PageScript{
  src: string
  async: boolean
  defer: boolean
}

interface PageContextBuilder<T>{
  pageLinks: PageLink[]
  pageScripts: PageScript[]
  pageCtx: T
  pageName?: string
  addScriptTag(tag: PageScript): PageContextBuilder<T>
  addLinkTag(tag: PageLink): PageContextBuilder<T>
  setPageName(name: string): PageContextBuilder<T>
}

// eslint-disable-next-line import/prefer-default-export
export function buildPageContext<T>(pageCtx: T): PageContextBuilder<T> {
  return {
    pageCtx,
    pageLinks: [],
    pageScripts: [],
    addLinkTag(tag: PageLink) {
      this.pageLinks.push(tag);
      return this;
    },
    addScriptTag(tag: PageScript) {
      this.pageScripts.push(tag);
      return this;
    },
    setPageName(name: string) {
      this.pageName = name;
      return this;
    },
  }.addLinkTag({
    rel: 'stylesheet',
    type: 'text/css',
    href: 'static/main.css',
  }).addLinkTag({
    rel: 'stylesheet',
    type: 'text/css',
    href: 'static/components.css',
  }).addScriptTag({
    src: 'static/main.js',
    defer: true,
    async: true,
  }).addScriptTag({
    src: 'static/components.js',
    defer: true,
    async: true,
  });
}
