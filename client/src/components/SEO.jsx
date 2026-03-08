import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
  title,
  description,
  name = "EduHub",
  type = "website",
  image = "/og-image.png", // Default OG image path
}) => {
  const fullTitle = title ? `${title} | ${name}` : `${name} - Premium LMS`;
  const defaultDescription =
    "Unlock your potential with EduHub. The most advanced learning management system for students and teachers.";

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />

      {/* OpenGraph tags for social sharing (Facebook, etc.) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta
        property="og:description"
        content={description || defaultDescription}
      />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={name} />

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta
        name="twitter:description"
        content={description || defaultDescription}
      />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
