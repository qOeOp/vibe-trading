import { allDocs } from 'content-collections';
import { loader } from 'fumadocs-core/source';

export const source = loader({
  baseUrl: '/docs',
  source: {
    files: allDocs.map((doc) => ({
      type: 'page',
      path: doc._meta.filePath,
      data: doc,
    })),
  },
});
