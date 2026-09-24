import sanitizeHtml from "sanitize-html";

const allowedTags = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "img",
];

export function sanitizeRichText(value: string) {
  let hasSectionHeading = false;
  return sanitizeHtml(value, {
    allowedTags,
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading", "decoding"],
    },
    transformTags: {
      "*": (tagName, attribs) => {
        if (/^h[1-6]$/.test(tagName)) {
          const heading = tagName === "h1" || tagName === "h2" || !hasSectionHeading ? "h2" : "h3";
          hasSectionHeading = true;
          return { tagName: heading, attribs };
        }
        if (tagName === "img") {
          return { tagName, attribs: { ...attribs, alt: attribs.alt || "", loading: "lazy", decoding: "async" } };
        }
        if (tagName === "a" && attribs.href) {
          return { tagName, attribs: { ...attribs, href: attribs.href.replace(/^(https?):([^/])/i, "$1://$2") } };
        }
        return { tagName, attribs };
      },
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      img: ["http", "https"],
    },
    allowProtocolRelative: false,
    disallowedTagsMode: "discard",
  });
}
