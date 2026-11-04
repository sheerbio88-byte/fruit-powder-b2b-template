import { ORGANIZATION_ID } from '~/utils/organization-schema';

export interface CollectionPostItem {
  title: string;
  url: string;
}

export function buildBlogCollectionSchema(opts: {
  name: string;
  description: string;
  url: string;
  posts: CollectionPostItem[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    isPartOf: { '@type': 'WebSite', name: 'Sheer Superfood' },
    publisher: { '@id': ORGANIZATION_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: opts.posts.length,
      itemListElement: opts.posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: post.title,
        url: post.url,
      })),
    },
  };
}