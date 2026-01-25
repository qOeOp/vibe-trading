import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";

const docs = defineCollection({
  name: "docs",
  directory: "content",
  include: "**/*.{md,mdx}",
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    full: z.boolean().optional(),
    content: z.string().optional(),
  }),
  transform: async (page, context) => {
    const body = await compileMDX(context, page);
    return {
      ...page,
      title: page.title || page._meta.fileName,
      body,
    };
  },
});

const metas = defineCollection({
  name: "metas",
  directory: "content",
  include: "**/meta.json",
  parser: "json",
  schema: z.object({
    title: z.string().optional(),
    pages: z.array(z.string()).optional(),
  }),
});

export default defineConfig({
  collections: [docs, metas],
});
