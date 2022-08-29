export interface IBlogNodeRenderer{
  name: string
  render(template: string, layout?: string, payload?: unknown): Promise<string>
}
