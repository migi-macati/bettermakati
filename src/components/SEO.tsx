import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const absoluteUrl = (base: string, value: string) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  if (!base) return value;
  return new URL(value, base).toString();
};

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  siteName = 'BetterMakati',
  noIndex = false,
  jsonLd,
}: SEOProps) {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const configuredBase = import.meta.env.VITE_WEBSITE_URL || '';
  const canonicalBase = 'https://bettermakati.org';
  const baseUrl = (configuredBase || canonicalBase).replace(/\/$/, '');
  const isFilipino = i18n.resolvedLanguage === 'fil';

  const defaultTitle = t('seo.defaultTitle');
  const defaultDescription =
    import.meta.env.VITE_SITE_DESCRIPTION || t('seo.defaultDescription');
  const defaultKeywords =
    import.meta.env.VITE_SITE_KEYWORDS || t('seo.defaultKeywords');

  const fullTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const fullDescription = description || defaultDescription;
  const fullKeywords = keywords || defaultKeywords;
  const pathname = location.pathname || '/';
  const fullUrl = url
    ? absoluteUrl(baseUrl, url)
    : baseUrl
      ? `${baseUrl}${pathname === '/' ? '/' : pathname}`
      : '';
  const fullImage = absoluteUrl(baseUrl, image || import.meta.env.VITE_OG_IMAGE_URL || '/og-image.png');
  const twitterHandle = import.meta.env.VITE_TWITTER_HANDLE || '';

  const websiteSchema = fullUrl
    ? {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: fullTitle,
        description: fullDescription,
        url: fullUrl,
        isPartOf: { '@type': 'WebSite', name: siteName, url: baseUrl || fullUrl },
      }
    : null;
  const schemas = [
    ...(websiteSchema ? [websiteSchema] : []),
    ...(jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []),
  ];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <meta name="author" content={siteName} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />
      <meta name="language" content={isFilipino ? 'Filipino' : 'English'} />

      <meta property="og:type" content={type} />
      {fullUrl && <meta property="og:url" content={fullUrl} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      {fullImage && <meta property="og:image" content={fullImage} />}
      <meta property="og:image:alt" content={t('seo.imageAlt')} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={isFilipino ? 'fil_PH' : 'en_PH'} />

      <meta name="twitter:card" content="summary_large_image" />
      {fullUrl && <meta name="twitter:url" content={fullUrl} />}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      {fullImage && <meta name="twitter:image" content={fullImage} />}
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}

      <meta name="theme-color" content="#036738" />
      {fullUrl && <link rel="canonical" href={fullUrl} />}
      {schemas.length > 0 && <script type="application/ld+json">{JSON.stringify(schemas)}</script>}
    </Helmet>
  );
}
