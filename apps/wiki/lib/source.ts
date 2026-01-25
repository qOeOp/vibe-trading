import { allDocs, allMetas } from '../.content-collections/generated';
import { loader } from 'fumadocs-core/source';

export const source = loader({
  baseUrl: '/docs',
  source: {
    files: [
      ...allDocs.map((doc) => ({
        type: 'page' as const,
        path: doc._meta.filePath,
        data: doc,
      })),
      ...allMetas.map((meta) => ({
        type: 'meta' as const,
        path: meta._meta.filePath,
        data: meta,
      })),
    ],
  },
});
