import { defineField, defineType } from "sanity";

export default defineType({
  name: "socialHighlight",
  title: "Social Highlight",
  type: "document",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: [
          { title: "Instagram", value: "instagram" },
          { title: "TikTok", value: "tiktok" },
        ],
      },
      initialValue: "instagram",
    }),
    defineField({
      name: "postUrl",
      title: "Post URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      description: "Screenshot or saved image of the post.",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Short caption or description of the post.",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Sort Order",
      name: "sortOrder",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "caption",
      subtitle: "platform",
      media: "thumbnail",
    },
  },
});
