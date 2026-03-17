const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pixelated.agency';

export default function sitemap() {
    return [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${siteUrl}/#portfolio`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ];
}
