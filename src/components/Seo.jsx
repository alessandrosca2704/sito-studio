import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Seo({
  title,
  description,
  url,
  image,
  type = 'website',
  locale = 'it_IT',
  imageWidth = 1200,
  imageHeight = 630,
  imageType = 'image/jpeg'
}){
  const siteName = 'Studio Scarimbolo';
  const resolvedImage = image || '';
  const isSecureImage = resolvedImage && /^https:\/\//i.test(resolvedImage);

  return (
    <Helmet>
      {title ? <title>{title}</title> : null}
      {description ? <meta name="description" content={description} /> : null}
      {url ? <link rel="canonical" href={url} /> : null}

      {type ? <meta property="og:type" content={type} /> : null}
      {url ? <meta property="og:url" content={url} /> : null}
      <meta property="og:site_name" content={siteName} />
      {locale ? <meta property="og:locale" content={locale} /> : null}
      {title ? <meta property="og:title" content={title} /> : null}
      {description ? <meta property="og:description" content={description} /> : null}
      {resolvedImage ? <meta property="og:image" content={resolvedImage} /> : null}
      {isSecureImage ? <meta property="og:image:secure_url" content={resolvedImage} /> : null}
      {resolvedImage && imageWidth ? <meta property="og:image:width" content={String(imageWidth)} /> : null}
      {resolvedImage && imageHeight ? <meta property="og:image:height" content={String(imageHeight)} /> : null}
      {resolvedImage && imageType ? <meta property="og:image:type" content={imageType} /> : null}

      <meta name="twitter:card" content="summary_large_image" />
      {title ? <meta name="twitter:title" content={title} /> : null}
      {description ? <meta name="twitter:description" content={description} /> : null}
      {resolvedImage ? <meta name="twitter:image" content={resolvedImage} /> : null}
    </Helmet>
  );
}
