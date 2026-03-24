import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'K9 Sniper | Premium Pets & Global Supplies',
  description = 'K9 Sniper is your premier destination for high-quality pets and supplies. We offer global pet transport, premium birds, dogs, cats, and expert pet care advice.',
  keywords = 'K9 Sniper, pet shop, premium pets, pet supplies, global pet transport, birds for sale, dogs for sale, cats for sale, pet care',
  image = 'https://k9sniper.com/og-image.jpg',
  url = 'https://k9sniper.com',
  type = 'website'
}) => {
  const siteTitle = title.includes('K9 Sniper') ? title : `${title} | K9 Sniper`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
