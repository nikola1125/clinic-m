import { defineType, defineArrayMember } from "sanity";

export default defineType({
  name: "blockContent",
  title: "Block Content",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Underline", value: "underline" },
          { title: "Highlight", value: "highlight" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "External link",
            fields: [
              {
                name: "href",
                type: "url",
                title: "URL",
              },
              {
                name: "blank",
                type: "boolean",
                title: "Open in new tab",
                initialValue: true,
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt text",
        },
        {
          name: "caption",
          type: "string",
          title: "Caption",
        },
      ],
    }),
    defineArrayMember({
      name: "callout",
      type: "object",
      title: "Callout Box",
      fields: [
        {
          name: "style",
          type: "string",
          title: "Style",
          options: {
            list: [
              { title: "Info", value: "info" },
              { title: "Warning", value: "warning" },
              { title: "Tip", value: "tip" },
              { title: "Important", value: "important" },
            ],
          },
          initialValue: "info",
        },
        {
          name: "text",
          type: "text",
          title: "Content",
          rows: 3,
        },
      ],
      preview: {
        select: { title: "text", subtitle: "style" },
        prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
          return {
            title: title ? title.slice(0, 60) : "Callout",
            subtitle: subtitle ? `${subtitle.toUpperCase()} callout` : "Callout",
          };
        },
      },
    }),
  ],
});
