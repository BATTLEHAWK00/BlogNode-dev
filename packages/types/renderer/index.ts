export interface IBlogNodeRendererConfig{

}
export interface IBlogNodeRenderer{
  name: string
  render(template: string, layout?: string, payload?: unknown): Promise<string>
  prepare(config: IBlogNodeRendererConfig): Promise<void>
}

declare global{
  function registerRenderer(renderer: IBlogNodeRenderer): void;
}
