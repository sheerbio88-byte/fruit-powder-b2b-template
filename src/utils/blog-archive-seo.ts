const BLOG_OG_DEFAULT = { url: '/brand/og-default.jpg', width: 800, height: 600 };

const categoryDescriptions: Record<string, string> = {
  Uncategorized: 'Articles about fruit and vegetable powders from Sheer Superfood.',
};

const categoryTitles: Record<string, string> = {
  Uncategorized: 'Uncategorized',
};

export function getBlogArchiveOpenGraph(_categoryTitle?: string) {
  return { type: 'website' as const, images: [BLOG_OG_DEFAULT] };
}

export function getBlogListMetadata(page: number) {
  const pageSuffix = page > 1 ? ` — Page ${page}` : '';
  return {
    title: `Blog${pageSuffix}`,
    description: 'Articles on fruit and vegetable powders from Sheer Superfood.',
    openGraph: getBlogArchiveOpenGraph(),
  };
}

export function getBlogCategoryMetadata(categoryTitle: string, page: number) {
  const pageSuffix = page > 1 ? ` — Page ${page}` : '';
  const title = categoryTitles[categoryTitle] ?? categoryTitle;
  const description =
    categoryDescriptions[categoryTitle] ??
    `Articles in ${categoryTitle} from Sheer Superfood.`;

  return {
    title: `${title}${pageSuffix}`,
    description,
    openGraph: getBlogArchiveOpenGraph(categoryTitle),
  };
}

export function getBlogTagMetadata(tagTitle: string, page: number) {
  const pageSuffix = page > 1 ? ` — Page ${page}` : '';
  return {
    title: `${tagTitle}${pageSuffix} | Sheer Superfood Blog`,
    description: `Blog posts tagged "${tagTitle}" from Sheer Superfood.`,
    openGraph: getBlogArchiveOpenGraph(),
  };
}
