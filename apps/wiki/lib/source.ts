import { allDocs } from '../.content-collections/generated';
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