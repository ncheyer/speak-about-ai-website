#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface SEOMetrics {
  totalPages: number;
  pagesWithH1: number;
  pagesWithMetadata: number;
  pagesWithGoodContent: number; // >500 words
  pagesWithSchema: number;
  brokenPages: string[];
  thinContentPages: string[];
  missingH1Pages: string[];
  missingMetaPages: string[];
  sitemapHealth: boolean;
  robotsTxtValid: boolean;
  overallHealthScore: number;
}

interface PageMetrics {
  url: string;
  hasH1: boolean;
  h1Text: string;
  hasMetadata: boolean;
  metaTitle: string;
  metaDescription: string;
  wordCount: number;
  hasSchema: boolean;
  internalLinks: number;
  images: number;
  imagesWithAlt: number;
}

class SEOMonitor {
  private appDir: string;
  private metrics: SEOMetrics = {
    totalPages: 0,
    pagesWithH1: 0,
    pagesWithMetadata: 0,
    pagesWithGoodContent: 0,
    pagesWithSchema: 0,
    brokenPages: [],
    thinContentPages: [],
    missingH1Pages: [],
    missingMetaPages: [],
    sitemapHealth: false,
    robotsTxtValid: false,
    overallHealthScore: 0,
  };
  private pageMetrics: PageMetrics[] = [];

  constructor(appDir: string) {
    this.appDir = appDir;
  }

  async runMonitoring(): Promise<void> {
    console.log('🔍 SEO Monitoring Report\n');
    console.log('=' .repeat(80));
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('=' .repeat(80) + '\n');

    // 1. Check sitemap
    await this.checkSitemap();

    // 2. Check robots.txt
    await this.checkRobotsTxt();

    // 3. Analyze all pages
    await this.analyzeAllPages();

    // 4. Calculate health score
    this.calculateHealthScore();

    // 5. Generate report
    this.generateReport();

    // 6. Export detailed metrics
    this.exportMetrics();
  }

  private async checkSitemap(): Promise<void> {
    const sitemapPath = path.join(this.appDir, 'app', 'sitemap.ts');
    
    if (fs.existsSync(sitemapPath)) {
      const content = fs.readFileSync(sitemapPath, 'utf-8');
      
      // Check for debug/test pages
      const hasDebugPages = content.includes('debug') || 
                           content.includes('test') || 
                           content.includes('check-sheet');
      
      // Check for proper structure
      const hasStaticPages = content.includes('staticPages');
      const hasDynamicPages = content.includes('speakerPages') || content.includes('blogPostPages');
      
      this.metrics.sitemapHealth = !hasDebugPages && hasStaticPages && hasDynamicPages;
    }
  }

  private async checkRobotsTxt(): Promise<void> {
    const robotsPath = path.join(this.appDir, 'public', 'robots.txt');
    
    if (fs.existsSync(robotsPath)) {
      const content = fs.readFileSync(robotsPath, 'utf-8');
      
      // Check for essential directives
      const hasUserAgent = content.includes('User-agent:');
      const hasSitemap = content.includes('Sitemap:');
      const blocksDebug = content.includes('Disallow: /debug');
      const blocksTest = content.includes('Disallow: /test');
      
      this.metrics.robotsTxtValid = hasUserAgent && hasSitemap && blocksDebug && blocksTest;
    }
  }

  private async analyzeAllPages(): Promise<void> {
    const pageFiles = await glob('**/page.tsx', {
      cwd: path.join(this.appDir, 'app'),
      ignore: ['**/node_modules/**', '**/.next/**']
    });

    this.metrics.totalPages = pageFiles.length;

    for (const file of pageFiles) {
      const filePath = path.join(this.appDir, 'app', file);
      const url = this.getUrlFromPath(file);
      
      // Skip debug/test pages from metrics
      if (url.includes('debug') || url.includes('test') || url.includes('check-sheet')) {
        continue;
      }

      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const pageMetric = this.analyzePage(content, url);
        this.pageMetrics.push(pageMetric);

        // Update aggregate metrics
        if (pageMetric.hasH1) this.metrics.pagesWithH1++;
        if (pageMetric.hasMetadata) this.metrics.pagesWithMetadata++;
        if (pageMetric.wordCount >= 500) this.metrics.pagesWithGoodContent++;
        if (pageMetric.hasSchema) this.metrics.pagesWithSchema++;

        // Track issues
        if (!pageMetric.hasH1) this.metrics.missingH1Pages.push(url);
        if (!pageMetric.hasMetadata) this.metrics.missingMetaPages.push(url);
        if (pageMetric.wordCount < 300) this.metrics.thinContentPages.push(url);

      } catch (error) {
        this.metrics.brokenPages.push(url);
      }
    }
  }

  private analyzePage(content: string, url: string): PageMetrics {
    // Check for H1
    const h1Match = content.match(/<[hH]1[^>]*>([^<]+)<\/[hH]1>/);
    const hasH1 = !!h1Match;
    const h1Text = h1Match ? h1Match[1].replace(/{[^}]+}/g, '').trim() : '';

    // Check for metadata
    const hasMetadata = content.includes('export const metadata') || 
                       content.includes('export async function generateMetadata');
    
    // Extract meta title and description
    let metaTitle = '';
    let metaDescription = '';
    
    if (hasMetadata) {
      const titleMatch = content.match(/title:\s*["'`]([^"'`]+)["'`]/);
      const descMatch = content.match(/description:\s*["'`]([^"'`]+)["'`]/);
      metaTitle = titleMatch ? titleMatch[1] : '';
      metaDescription = descMatch ? descMatch[1] : '';
    }

    // Count words
    const textContent = content
      .replace(/<[^>]+>/g, ' ')
      .replace(/\{[^}]+\}/g, ' ')
      .replace(/import.*from.*;/g, '')
      .replace(/export.*{.*}/g, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*/g, '');
    const words = textContent.split(/\s+/).filter(word => word.length > 2);
    const wordCount = words.length;

    // Check for schema
    const hasSchema = content.includes('application/ld+json') || 
                     content.includes('schema.org');

    // Count internal links
    const linkMatches = content.match(/<Link[^>]*href=["']([^"']+)["'][^>]*>/gi) || [];
    const internalLinks = linkMatches.filter(link => {
      const href = link.match(/href=["']([^"']+)["']/);
      return href && href[1].startsWith('/');
    }).length;

    // Count images and alt tags
    const imageMatches = content.match(/<[Ii]m(age|g)[^>]*\/?>|<img[^>]*\/?>/gi) || [];
    const images = imageMatches.length;
    const imagesWithAlt = imageMatches.filter(img => img.includes('alt=')).length;

    return {
      url,
      hasH1,
      h1Text,
      hasMetadata,
      metaTitle,
      metaDescription,
      wordCount,
      hasSchema,
      internalLinks,
      images,
      imagesWithAlt,
    };
  }

  private calculateHealthScore(): void {
    const weights = {
      h1: 20,
      metadata: 20,
      content: 25,
      schema: 10,
      sitemap: 10,
      robots: 5,
      images: 10,
    };

    let score = 0;
    const validPages = this.pageMetrics.length;

    if (validPages > 0) {
      // H1 score
      score += (this.metrics.pagesWithH1 / validPages) * weights.h1;
      
      // Metadata score
      score += (this.metrics.pagesWithMetadata / validPages) * weights.metadata;
      
      // Content score
      score += (this.metrics.pagesWithGoodContent / validPages) * weights.content;
      
      // Schema score
      score += (this.metrics.pagesWithSchema / validPages) * weights.schema;
    }

    // Sitemap score
    if (this.metrics.sitemapHealth) score += weights.sitemap;
    
    // Robots.txt score
    if (this.metrics.robotsTxtValid) score += weights.robots;
    
    // Images with alt text score
    const totalImages = this.pageMetrics.reduce((sum, p) => sum + p.images, 0);
    const imagesWithAlt = this.pageMetrics.reduce((sum, p) => sum + p.imagesWithAlt, 0);
    if (totalImages > 0) {
      score += (imagesWithAlt / totalImages) * weights.images;
    }

    this.metrics.overallHealthScore = Math.round(score);
  }

  private generateReport(): void {
    const validPages = this.pageMetrics.length;
    
    console.log('📊 OVERALL HEALTH SCORE: ' + this.getHealthEmoji(this.metrics.overallHealthScore) + 
                ` ${this.metrics.overallHealthScore}%\n`);

    console.log('✅ PASSED CHECKS:');
    console.log('-'.repeat(40));
    
    if (this.metrics.sitemapHealth) {
      console.log('  ✓ Sitemap is clean (no debug/test pages)');
    }
    if (this.metrics.robotsTxtValid) {
      console.log('  ✓ Robots.txt properly configured');
    }
    if (this.metrics.pagesWithH1 === validPages) {
      console.log('  ✓ All pages have H1 tags');
    }
    if (this.metrics.pagesWithMetadata === validPages) {
      console.log('  ✓ All pages have metadata');
    }
    if (this.metrics.pagesWithGoodContent === validPages) {
      console.log('  ✓ All pages have sufficient content (500+ words)');
    }

    console.log('\n❌ FAILED CHECKS:');
    console.log('-'.repeat(40));
    
    if (!this.metrics.sitemapHealth) {
      console.log('  ✗ Sitemap contains debug/test pages');
    }
    if (!this.metrics.robotsTxtValid) {
      console.log('  ✗ Robots.txt missing essential directives');
    }
    if (this.metrics.missingH1Pages.length > 0) {
      console.log(`  ✗ ${this.metrics.missingH1Pages.length} pages missing H1 tags`);
    }
    if (this.metrics.missingMetaPages.length > 0) {
      console.log(`  ✗ ${this.metrics.missingMetaPages.length} pages missing metadata`);
    }
    if (this.metrics.thinContentPages.length > 0) {
      console.log(`  ✗ ${this.metrics.thinContentPages.length} pages with thin content (<300 words)`);
    }

    console.log('\n📈 METRICS SUMMARY:');
    console.log('-'.repeat(40));
    console.log(`  Total pages analyzed: ${validPages}`);
    console.log(`  Pages with H1 tags: ${this.metrics.pagesWithH1}/${validPages} (${this.getPercentage(this.metrics.pagesWithH1, validPages)}%)`);
    console.log(`  Pages with metadata: ${this.metrics.pagesWithMetadata}/${validPages} (${this.getPercentage(this.metrics.pagesWithMetadata, validPages)}%)`);
    console.log(`  Pages with good content: ${this.metrics.pagesWithGoodContent}/${validPages} (${this.getPercentage(this.metrics.pagesWithGoodContent, validPages)}%)`);
    console.log(`  Pages with schema markup: ${this.metrics.pagesWithSchema}/${validPages} (${this.getPercentage(this.metrics.pagesWithSchema, validPages)}%)`);

    if (this.metrics.missingH1Pages.length > 0) {
      console.log('\n⚠️  PAGES MISSING H1:');
      this.metrics.missingH1Pages.slice(0, 5).forEach(page => {
        console.log(`    - ${page}`);
      });
      if (this.metrics.missingH1Pages.length > 5) {
        console.log(`    ... and ${this.metrics.missingH1Pages.length - 5} more`);
      }
    }

    if (this.metrics.thinContentPages.length > 0) {
      console.log('\n⚠️  PAGES WITH THIN CONTENT:');
      this.metrics.thinContentPages.slice(0, 5).forEach(page => {
        console.log(`    - ${page}`);
      });
      if (this.metrics.thinContentPages.length > 5) {
        console.log(`    ... and ${this.metrics.thinContentPages.length - 5} more`);
      }
    }

    console.log('\n💡 RECOMMENDATIONS:');
    console.log('-'.repeat(40));
    
    if (this.metrics.overallHealthScore < 95) {
      if (this.metrics.missingH1Pages.length > 0) {
        console.log('  1. Add H1 tags to all pages for better SEO');
      }
      if (this.metrics.thinContentPages.length > 0) {
        console.log('  2. Expand content on thin pages to 500+ words');
      }
      if (this.metrics.pagesWithSchema < validPages) {
        console.log('  3. Add schema markup to improve rich snippets');
      }
      if (!this.metrics.sitemapHealth) {
        console.log('  4. Clean up sitemap by removing debug/test pages');
      }
    } else {
      console.log('  ✨ Site health is excellent! Continue monitoring.');
    }
  }

  private exportMetrics(): void {
    const reportPath = path.join(this.appDir, 'seo-monitoring-report.json');
    
    const report = {
      timestamp: new Date().toISOString(),
      overallHealthScore: this.metrics.overallHealthScore,
      metrics: this.metrics,
      pageDetails: this.pageMetrics.sort((a, b) => a.wordCount - b.wordCount),
      recommendations: this.getRecommendations(),
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report exported to: ${reportPath}`);
  }

  private getRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this.metrics.missingH1Pages.length > 0) {
      recommendations.push(`Fix ${this.metrics.missingH1Pages.length} pages missing H1 tags`);
    }
    if (this.metrics.thinContentPages.length > 0) {
      recommendations.push(`Expand content on ${this.metrics.thinContentPages.length} thin pages`);
    }
    if (this.metrics.pagesWithSchema < this.pageMetrics.length) {
      recommendations.push('Add schema markup to improve search visibility');
    }
    if (!this.metrics.sitemapHealth) {
      recommendations.push('Clean up sitemap.xml');
    }
    if (!this.metrics.robotsTxtValid) {
      recommendations.push('Update robots.txt with proper directives');
    }
    
    return recommendations;
  }

  private getHealthEmoji(score: number): string {
    if (score >= 95) return '🟢';
    if (score >= 80) return '🟡';
    if (score >= 60) return '🟠';
    return '🔴';
  }

  private getPercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }

  private getUrlFromPath(filePath: string): string {
    const parts = filePath.split(path.sep);
    const pageIndex = parts.indexOf('page.tsx');
    
    if (pageIndex === 0) return '/';
    
    const urlParts = parts.slice(0, pageIndex);
    const url = '/' + urlParts
      .filter(part => !part.startsWith('(') && !part.endsWith(')'))
      .join('/');
    
    return url || '/';
  }
}

// Run monitoring
const monitor = new SEOMonitor(process.cwd());
monitor.runMonitoring().catch(console.error);
