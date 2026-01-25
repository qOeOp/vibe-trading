// content-collections.ts
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";
var docs = defineCollection({
  name: "docs",
  directory: "content",
  include: "**/*.{md,mdx}",
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    full: z.boolean().optional(),
    content: z.string().optional()
  }),
  transform: async (page, context) => {
    const body = await compileMDX(context, page);
    return {
      ...page,
      title: page.title || page._meta.fileName,
      body
    };
  }
});
var metas = defineCollection({
  name: "metas",
  directory: "content",
  include: "**/meta.json",
  parser: "json",
  schema: z.object({
    title: z.string().optional(),
    pages: z.array(z.string()).optional()
  })
});
var content_collections_default = defineConfig({
  collections: [docs, metas]
});
export {
  content_collections_default as default
};
