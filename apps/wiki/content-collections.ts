import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";

const docs = defineCollection({
  name: "docs",
  directory: "content",
  include: "**/*.{md,mdx}",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    icon: z.string().optional(),
    full: z.boolean().optional(),
    content: z.string().optional(), // Explicit content property
  }),
  transform: async (page, context) => {
    const body = await compileMDX(context, page);
    return {
      ...page,
      body,
    };
  },
});

export default defineConfig({
  collections: [docs],
});
