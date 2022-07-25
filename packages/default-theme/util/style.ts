// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LoadStyleModule(style: any) {
  return (className: string): string => style[className];
}

class ClassStyleManager {
  private classList: Set<string> = new Set<string>();

  switch(className: string) {
    if (this.classList.has(className)) this.classList.delete(className);
    else this.classList.add(className);
  }

  add(className: string) {
    this.classList.add(className);
  }

  delete(className: string) {
    this.classList.delete(className);
  }

  size() {
    return this.classList.size;
  }

  render() {
    return Array.from(this.classList).join(' ');
  }
}

export function getStyleManager() {
  return new ClassStyleManager();
}
