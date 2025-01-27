import sanitizeHtml from 'sanitize-html'

export const sanitizeContent = (html: string): string => {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["h1", "h2", "p"]),
    allowedAttributes: {
      a: ["href", "name", "target"],
      img: ["src", "alt"],
    },
  });
};
