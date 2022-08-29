import Markdown from 'markdown-it';

const markdownParser = new Markdown({
  html: true,
});

function render(markdownText: string): string {
  return markdownParser.render(markdownText);
}

export default {
  render,
};
