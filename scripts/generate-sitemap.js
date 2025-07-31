#!/usr/bin/env node

// Simple sitemap generator and validator
const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://subhamagarwal.vercel.app';
const PUBLIC_DIR = path.join(__dirname, 'public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');

// URLs to include in sitemap
const urls = [
  {
    loc: DOMAIN + '/',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: '1.0'
  },
  {
    loc: DOMAIN + '/resume/SubhamAgarwal_Resume.pdf',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly', 
    priority: '0.7'
  }
];

// Generate sitemap XML
function generateSitemap() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}T00:00:00+00:00</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(SITEMAP_PATH, xml);
  console.log('✅ Sitemap generated successfully at:', SITEMAP_PATH);
  console.log('📄 URLs included:', urls.length);
  console.log('🔗 Submit to Google: ' + DOMAIN + '/sitemap.xml');
}

// Validate sitemap exists and is readable
function validateSitemap() {
  try {
    const content = fs.readFileSync(SITEMAP_PATH, 'utf8');
    if (content.includes('<?xml') && content.includes('<urlset')) {
      console.log('✅ Sitemap validation passed');
      return true;
    } else {
      console.log('❌ Sitemap format invalid');
      return false;
    }
  } catch (error) {
    console.log('❌ Sitemap not found or unreadable:', error.message);
    return false;
  }
}

// Main execution
if (require.main === module) {
  console.log('🔄 Generating sitemap...');
  generateSitemap();
  validateSitemap();
}

module.exports = { generateSitemap, validateSitemap };
