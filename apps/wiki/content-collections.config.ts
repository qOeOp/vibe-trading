import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";

const docs = defineCollection({
  name: "docs",
  directory: "content",
  include: "**/*.{md,mdx}",
  schema: (z) => ({
    title: z.string(),
    description: z.string().optional(),
    icon: z.string().optional(),
    full: z.boolean().optional(),
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
