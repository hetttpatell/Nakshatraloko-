import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
  title = "Naksatraloka - Authentic Rudraksha & Spiritual Products",
  description = "Naksatraloka offers authentic Rudraksha, spiritual products, and astrology solutions. Explore divine energy products online with free shipping.",
  keywords = "Rudraksha, spiritual products, astrology, healing beads, rudraksha mala, spiritual jewelry",
  image = "https://naksatraloka.com/Logo.png",
  url = "",
  type = "website",
  schema = null,
}) => {
  const websiteUrl = "https://naksatraloka.com";
  const canonicalUrl = url ? `${websiteUrl}${url}` : websiteUrl;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Naksatraloka" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data (Schema.org) */}
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
};

// Helper function to create Product schema
export const createProductSchema = (product) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images?.map(img => img.imageData) || [],
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price || product.sizes?.[0]?.price || 0,
      availability: product.isActive 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Naksatraloka"
      }
    },
    aggregateRating: product.productRatings ? {
      "@type": "AggregateRating",
      ratingValue: product.productRatings,
      bestRating: "5",
      worstRating: "1",
      ratingCount: "1"
    } : null
  };
};

// Helper function to create BreadcrumbList schema
export const createBreadcrumbSchema = (crumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  };
};

export default SEO;
