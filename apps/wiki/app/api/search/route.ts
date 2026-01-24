import { createSearchAPI } from 'fumadocs-core/search/server';
import { source } from '@/lib/source';

export const { GET } = createSearchAPI('simple', {
  indexes: source.getPages().map((page) => ({
    title: page.data.title || 'Untitled',
    content: (page.data as any).content || '',
    url: page.url,
  })),
});
