import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
}

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  siteName = 'BetterMakati',
}: SEOProps) {
  const defaultTitle = 'BetterMakati | Independent civic portal for Makati City';
  const defaultDescription =
    import.meta.env.VITE_SITE_DESCRIPTION ||
    'Independent civic information portal for Makati City.';
  const defaultKeywords =
    import.meta.env.VITE_SITE_KEYWORDS ||
    'Makati, Makati City, public services, local government, civic information';

  const fullTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const fullDescription = description || defaultDescription;
  const fullKeywords = keywords || defaultKeywords;
  const fullUrl = url || import.meta.env.VITE_WEBSITE_URL || '';
  const fullImage =
    image ||
    import.meta.env.VITE_OG_IMAGE_URL ||
    (fullUrl ? `${fullUrl}/og-image.jpg` : '');
  const twitterHandle = import.meta.env.VITE_TWITTER_HANDLE || '';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <meta name="author" content={siteName} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />

      <meta property="og:type" content={type} />
      {fullUrl && <meta property="og:url" content={fullUrl} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      {fullImage && <meta property="og:image" content={fullImage} />}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_PH" />

      <meta property="twitter:card" content="summary_large_image" />
      {fullUrl && <meta property="twitter:url" content={fullUrl} />}
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={fullDescription} />
      {fullImage && <meta property="twitter:image" content={fullImage} />}
      {twitterHandle && <meta property="twitter:site" content={twitterHandle} />}

      <meta name="theme-color" content="#0066eb" />
      {fullUrl && <link rel="canonical" href={fullUrl} />}
    </Helmet>
  );
}
