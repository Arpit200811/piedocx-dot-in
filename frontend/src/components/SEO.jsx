import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({ title, description, keywords, image }) => {
  const location = useLocation();
  const siteUrl = 'https://www.piedocx.com'; // Replace with your actual domain
  const currentUrl = `${siteUrl}${location.pathname}`;
  const defaultTitle = 'Piedocx - IT Services & Solutions | Software Development Company';
  const defaultDescription = 'Piedocx is a leading IT company in Lucknow providing software development, industrial training, web development, and digital marketing services.';
  const defaultKeywords = 'software development, web development, industrial training, internship, Lucknow, IT company, digital marketing, app development';
  const defaultImage = `${siteUrl}/logo.png`;

  const metaTitle = title ? `${title} | Piedocx` : defaultTitle;
  const metaDescription = description || defaultDescription;
  const metaKeywords = keywords || defaultKeywords;
  const metaImage = image ? `${siteUrl}${image}` : defaultImage;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="title" content={metaTitle} />
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="author" content="Piedocx Technologies" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content="Piedocx Technologies" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={metaTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={metaImage} />

      {/* Robot Tags */}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={currentUrl} />
    </Helmet>
  );
};

export default SEO;
