import React from 'react';

export const StructuredData: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://subhamagarwal.vercel.app/#person",
        "name": "Subham Agarwal",
        "jobTitle": "Full Stack Developer",
        "url": "https://subhamagarwal.vercel.app/",
        "email": "subhamag2003@gmail.com",
        "sameAs": [
          "https://github.com/subhamagarrwal",
          "https://www.linkedin.com/in/subham-agarwal2003"
        ],
        "knowsAbout": [
          "React",
          "Node.js", 
          "MongoDB",
          "JavaScript",
          "TypeScript",
          "Full Stack Development",
          "Web Development",
          "Express.js",
          "Firebase",
          "GraphQL"
        ],
        "description": "Experienced Full Stack Developer specializing in React, Node.js, MongoDB, and modern web technologies.",
        "image": "https://subhamagarwal.vercel.app/image.png"
      },
      {
        "@type": "WebSite",
        "@id": "https://subhamagarwal.vercel.app/#website",
        "url": "https://subhamagarwal.vercel.app/",
        "name": "Subham Agarwal Portfolio",
        "description": "Portfolio website of Subham Agarwal - Full Stack Developer",
        "publisher": {
          "@id": "https://subhamagarwal.vercel.app/#person"
        },
        "inLanguage": "en-US"
      },
      {
        "@type": "WebPage",
        "@id": "https://subhamagarwal.vercel.app/#webpage",
        "url": "https://subhamagarwal.vercel.app/",
        "name": "Subham Agarwal - Full Stack Developer Portfolio",
        "isPartOf": {
          "@id": "https://subhamagarwal.vercel.app/#website"
        },
        "about": {
          "@id": "https://subhamagarwal.vercel.app/#person"
        },
        "description": "Experienced Full Stack Developer specializing in React, Node.js, MongoDB, and modern web technologies. View my projects, skills, and contact me for opportunities.",
        "breadcrumb": {
          "@id": "https://subhamagarwal.vercel.app/#breadcrumb"
        },
        "inLanguage": "en-US"
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://subhamagarwal.vercel.app/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://subhamagarwal.vercel.app/"
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default StructuredData;
