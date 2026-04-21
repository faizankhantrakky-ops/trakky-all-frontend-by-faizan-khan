/** @type {import('next-sitemap').IConfig} */
const fs = require('fs');

let extraPaths = [];
try {
  extraPaths = JSON.parse(fs.readFileSync('./sitemap-urls.json', 'utf8'));
} catch (e) {
  extraPaths = [];
}

module.exports = {
  siteUrl: 'https://salonmanagementsoftware.trakky.in',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  // global default priority (jo override nahi hoti)
  priority: 0.7,
  exclude: [],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
    additionalSitemaps: [
      'https://salonmanagementsoftware.trakky.in/sitemap.xml'
    ]
  },
  additionalPaths: async (config) => {
    const paths = [];

    // ✅ Priority-wise URLs
    const priorityUrls = [
      { loc: '/', priority: 0.9 },
      { loc: '/salon', priority: 0.8 },
      { loc: '/pricing', priority: 0.7 },
      { loc: '/schedule-demo', priority: 0.6 },
    ];

    // Add transformed URLs with priority
    for (const page of priorityUrls) {
      const transformed = await config.transform(config, page.loc);
      transformed.priority = page.priority; // set custom priority
      paths.push(transformed);
    }

    // agar extraPaths json me kuch aur URLs hain
    for (const p of extraPaths) {
      const transformed = await config.transform(config, p.loc || p);
      // agar extraPaths me priority di ho toh use karo, nahi toh default
      transformed.priority = p.priority || 0.7;
      paths.push(transformed);
    }

    return paths;
  },
};
