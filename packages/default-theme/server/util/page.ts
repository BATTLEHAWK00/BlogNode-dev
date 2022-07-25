interface PageLink {
  rel: string
  type: string
  href: string
}

interface PageScript {
  src: string
  async: boolean
  defer: boolean
}

interface PageContextBuilder<T> {
  pageLinks: PageLink[]
  pageScripts: PageScript[]
  pageCtx: T
  pageName?: string
  pageTitle?: string

  addScriptTag(tag: PageScript): PageContextBuilder<T>

  addLinkTag(tag: PageLink): PageContextBuilder<T>

  setPageName(name: string): PageContextBuilder<T>

  setPageTitle(title: string): PageContextBuilder<T>
}

// eslint-disable-next-line import/prefer-default-export
export function buildPageContext<T>(pageCtx: T): PageContextBuilder<T> {
  const builder: PageContextBuilder<T> = {
    pageCtx,
    pageLinks: [],
    pageScripts: [],
    setPageTitle(title: string) {
      this.pageTitle = title;
      return this;
    },
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
  };
  builder.addLinkTag({
    rel: 'stylesheet',
    type: 'text/css',
    href: 'static/main.css',
  })
    .addLinkTag({
      rel: 'stylesheet',
      type: 'text/css',
      href: 'static/components.css',
    })
    .addScriptTag({
      src: 'static/main.js',
      defer: true,
      async: true,
    })
    .addScriptTag({
      src: 'static/components.js',
      defer: true,
      async: true,
    });
  return builder;
}
