#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 SEO Critical Issues Fix Script\n');
console.log('=====================================\n');

// Issue 1: Fix robots.txt
console.log('1. Fixing robots.txt - Removing SEMrush block...');
const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
const robotsContent = `# Robots.txt for speakabout.ai
# Last updated: 2025

User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /portal/
Disallow: /debug*
Disallow: /test*
Disallow: /_next/static/
Disallow: /node_modules/
Disallow: /.git/

# Allow all crawlers to access the site
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: SemrushBot
Allow: /

User-agent: AhrefsBot
Allow: /

User-agent: DuckDuckBot
Allow: /

# Sitemap location
Sitemap: https://www.speakabout.ai/sitemap.xml
`;

fs.writeFileSync(robotsPath, robotsContent);
console.log('✅ robots.txt fixed - SEMrush and other SEO tools now allowed\n');

// Issue 2: Expand sitemap to include all speaker pages
console.log('2. Expanding sitemap.ts to include all important pages...');
const sitemapContent = `import type { MetadataRoute } from "next"
import { getAllSpeakers } from "@/lib/speakers-data"

const BASE_URL = "https://www.speakabout.ai"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  
  // Get all speakers for individual pages
  const speakers = await getAllSpeakers()
  
  // Main pages with high priority
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: \`\${BASE_URL}\`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: \`\${BASE_URL}/speakers\`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: \`\${BASE_URL}/top-ai-speakers-2025\`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: \`\${BASE_URL}/blog\`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: \`\${BASE_URL}/our-services\`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: \`\${BASE_URL}/contact\`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: \`\${BASE_URL}/our-team\`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]
  
  // Industry pages with high SEO value
  const industryPages: MetadataRoute.Sitemap = [
    {
      url: \`\${BASE_URL}/industries/technology-keynote-speakers\`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: \`\${BASE_URL}/industries/healthcare-keynote-speakers\`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: \`\${BASE_URL}/industries/leadership-business-strategy-ai-speakers\`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: \`\${BASE_URL}/industries/retail-ai-speakers\`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: \`\${BASE_URL}/industries/manufacturing-ai-speakers\`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: \`\${BASE_URL}/industries/sales-marketing-ai-speakers\`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: \`\${BASE_URL}/industries/automotive-ai-speakers\`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ]
  
  // Individual speaker pages - VERY IMPORTANT FOR SEO
  const speakerPages: MetadataRoute.Sitemap = speakers.map((speaker) => ({
    url: \`\${BASE_URL}/speakers/\${speaker.slug}\`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))
  
  return [...mainPages, ...industryPages, ...speakerPages]
}
`;

const sitemapPath = path.join(process.cwd(), 'app', 'sitemap.ts');
fs.writeFileSync(sitemapPath, sitemapContent);
console.log('✅ sitemap.ts expanded to include all speaker pages\n');

// Issue 3: Add JSON-LD structured data
console.log('3. Creating JSON-LD structured data component...');
const structuredDataContent = `export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Speak About AI",
    "url": "https://www.speakabout.ai",
    "logo": "https://www.speakabout.ai/new-ai-logo.png",
    "description": "The premier AI-exclusive keynote speakers bureau trusted by Fortune 500 companies",
    "sameAs": [
      "https://www.linkedin.com/company/speak-about-ai",
      "https://twitter.com/speakaboutai"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-650-123-4567",
      "contactType": "sales",
      "areaServed": "Worldwide",
      "availableLanguage": ["English"]
    }
  }
}

export function generateSpeakerSchema(speaker: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": speaker.name,
    "jobTitle": speaker.title || "AI Keynote Speaker",
    "description": speaker.bio,
    "image": speaker.image ? \`https://www.speakabout.ai\${speaker.image}\` : undefined,
    "url": \`https://www.speakabout.ai/speakers/\${speaker.slug}\`,
    "worksFor": {
      "@type": "Organization",
      "name": speaker.company || "Independent"
    },
    "knowsAbout": speaker.expertise || ["Artificial Intelligence", "Machine Learning", "Technology"]
  }
}

export function generateServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Keynote Speaker Booking",
    "provider": {
      "@type": "Organization",
      "name": "Speak About AI"
    },
    "areaServed": "Worldwide",
    "description": "Book world-class AI keynote speakers for conferences, corporate events, and summits"
  }
}
`;

const schemaPath = path.join(process.cwd(), 'lib', 'structured-data.ts');
fs.writeFileSync(schemaPath, structuredDataContent);
console.log('✅ Structured data component created\n');

// Issue 4: Check for missing og-image
console.log('4. Checking for og-image.jpg...');
const ogImagePath = path.join(process.cwd(), 'public', 'og-image.jpg');
if (!fs.existsSync(ogImagePath)) {
  console.log('⚠️  og-image.jpg is missing! Please add a 1200x630 image to /public/og-image.jpg');
  console.log('   This is critical for social media sharing\n');
} else {
  console.log('✅ og-image.jpg exists\n');
}

// Issue 5: Create comprehensive metadata helper
console.log('5. Creating metadata helper for consistent SEO...');
const metadataHelperContent = `import type { Metadata } from "next"

const BASE_URL = "https://www.speakabout.ai"
const DEFAULT_OG_IMAGE = \`\${BASE_URL}/og-image.jpg\`

interface GenerateMetadataProps {
  title: string
  description: string
  keywords?: string[]
  image?: string
  path?: string
  type?: "website" | "article" | "profile"
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  image = DEFAULT_OG_IMAGE,
  path = "",
  type = "website"
}: GenerateMetadataProps): Metadata {
  const url = \`\${BASE_URL}\${path}\`
  
  // Add default keywords to all pages
  const allKeywords = [
    ...keywords,
    "AI speakers",
    "keynote speakers",
    "artificial intelligence",
    "AI conference",
    "book AI speaker"
  ]
  
  return {
    title,
    description,
    keywords: allKeywords.join(", "),
    authors: [{ name: "Speak About AI" }],
    creator: "Speak About AI",
    publisher: "Speak About AI",
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: path || "/"
    },
    openGraph: {
      type,
      locale: "en_US",
      url,
      siteName: "Speak About AI",
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@speakaboutai"
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1
      }
    }
  }
}
`;

const metadataHelperPath = path.join(process.cwd(), 'lib', 'metadata-helper.ts');
fs.writeFileSync(metadataHelperPath, metadataHelperContent);
console.log('✅ Metadata helper created\n');

console.log('=====================================');
console.log('🎉 SEO Critical Fixes Complete!\n');
console.log('Next Steps:');
console.log('1. Add a 1200x630 og-image.jpg to /public/ if missing');
console.log('2. Deploy these changes to production');
console.log('3. Submit sitemap to Google Search Console');
console.log('4. Request re-indexing for key pages');
console.log('5. Wait 24-48 hours for search engines to recrawl');
console.log('\nKey Changes Made:');
console.log('- ✅ Allowed SEMrush and other SEO tools in robots.txt');
console.log('- ✅ Expanded sitemap to include ALL speaker pages');
console.log('- ✅ Created structured data schemas');
console.log('- ✅ Created metadata helper for consistency');