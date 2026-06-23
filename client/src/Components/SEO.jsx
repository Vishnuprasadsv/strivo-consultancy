import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, name, type }) => {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title ? `${title} | Strivo Consultancy` : 'Strivo Consultancy'}</title>
      <meta name='description' content={description} />
      
      {/* Facebook tags */}
      <meta property='og:type' content={type || 'website'} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      
      {/* Twitter tags */}
      <meta name='twitter:creator' content={name} />
      <meta name='twitter:card' content={type || 'summary_large_image'} />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
    </Helmet>
  );
};

export default SEO;
