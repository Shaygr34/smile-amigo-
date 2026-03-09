import { defineField, defineType } from "sanity";

export default defineType({
  name: "pageAbout",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "object",
      fields: [
        { name: "en", type: "string", title: "English" },
        { name: "he", type: "string", title: "Hebrew" },
      ],
    }),
    defineField({
      name: "subline",
      title: "Subline",
      type: "object",
      fields: [
        { name: "en", type: "string", title: "English" },
        { name: "he", type: "string", title: "Hebrew" },
      ],
    }),
    defineField({
      name: "bio",
      title: "Bio / Story",
      type: "object",
      fields: [
        { name: "en", type: "text", title: "English", rows: 10 },
        { name: "he", type: "text", title: "Hebrew", rows: 10 },
      ],
      description: "Paragraphs separated by double newlines.",
    }),
    defineField({
      name: "approachTitle",
      title: "Approach Section Title",
      type: "object",
      fields: [
        { name: "en", type: "string", title: "English" },
        { name: "he", type: "string", title: "Hebrew" },
      ],
    }),
    defineField({
      name: "approach",
      title: "Approach Paragraphs",
      type: "object",
      fields: [
        { name: "en", type: "text", title: "English", rows: 6 },
        { name: "he", type: "text", title: "Hebrew", rows: 6 },
      ],
      description: "Paragraphs separated by double newlines.",
    }),
    defineField({
      name: "locations",
      title: "Locations",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", type: "string", title: "Name" }),
            defineField({
              name: "description",
              title: "Description",
              type: "object",
              fields: [
                { name: "en", type: "string", title: "English" },
                { name: "he", type: "string", title: "Hebrew" },
              ],
            }),
            defineField({
              name: "status",
              title: "Status",
              type: "string",
              options: {
                list: [
                  { title: "Active", value: "active" },
                  { title: "Coming Soon", value: "coming-soon" },
                ],
              },
              initialValue: "active",
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "status" },
          },
        },
      ],
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    prepare() {
      return { title: "About Page" };
    },
  },
});
