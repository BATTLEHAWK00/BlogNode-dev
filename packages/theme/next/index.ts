export interface ThemeInfo{
  themePath: string,
  themeName: string,
  staticDir?: string,
}

export type ThemeRegisterer = ()=> ThemeInfo;

export default {};
