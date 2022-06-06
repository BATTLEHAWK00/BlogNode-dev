export default class ThemeProcessor {
  private themeDir?:string;

  private themeName?:string;

  constructor(themeDir?:string) {
    this.themeDir = themeDir;
  }

  async register() {
    const pkgDir = this.themeDir || '@blognode/default-theme';
    const m = (await import(pkgDir)).default;
    this.themeDir = m.themeDir;
    this.themeName = m.themeName;
  }

  getThemeDir() {
    if (!this.themeDir) throw new Error('Theme registration failed!');
    return this.themeDir;
  }

  getThemeName() {
    if (!this.themeDir) throw new Error('Theme registration failed!');
    return this.themeName;
  }
}
