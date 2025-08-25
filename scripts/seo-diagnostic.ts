import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import * as cheerio from 'cheerio';

interface SEOIssue {
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  url: string;
  details: string;
}

interface PageAnalysis {
  url: string;
  h1Count: number;
  h1Text: string[];
  wordCount: number;
  metaTitle: string;
  metaDescription: string;
  hasSchema: boolean;
  images: { src: string; hasAlt: boolean }[];
  internalLinks: string[];
  issues: SEOIssue[];
}

class SEODiagnostic {
  private issues: SEOIssue[] = [];
  private pageAnalyses: Map<string, PageAnalysis> = new Map();
  private appDir: string;

  constructor(appDir: string) {
    this.appDir = appDir;
  }

  async runFullDiagnostic(): Promise<void> {
    console.log('🔍 Starting comprehensive SEO diagnostic...\n');
    
    // 1. Analyze sitemap
    await this.analyzeSitemap();
    
    // 2. Scan all pages
    await this.scanAllPages();
    
    // 3. Check for broken pages
    await this.checkBrokenPages();
    
    // 4. Generate report
    this.generateReport();
  }

  private async analyzeSitemap(): Promise<void> {
    console.log('📋 Analyzing sitemap.ts...');
    
    const sitemapPath = path.join(this.appDir, 'app', 'sitemap.ts');
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
    
    // Check for debug/test pages that shouldn't be in sitemap
    const debugPages = [
      'debug', 'test', 'check-sheet', 'image-test', 'landing-page'
    ];
    
    debugPages.forEach(page => {
      if (sitemapContent.includes(page)) {
        this.issues.push({
          type: 'sitemap',
          severity: 'critical',
          url: `/${page}`,
          details: `Debug/test page found in sitemap: ${page}`
        });
      }
    });

    // Check for missing important pages
    const importantPages = [
      '/about', '/services', '/testimonials', '/faq'
    ];
    
    importantPages.forEach(page => {
      if (!sitemapContent.includes(page)) {
        this.issues.push({
          type: 'sitemap',
          severity: 'high',
          url: page,
          details: `Important page missing from sitemap: ${page}`
        });
      }
    });
  }

  private async scanAllPages(): Promise<void> {
    console.log('📄 Scanning all pages...');
    
    // Find all page.tsx files
    const pageFiles = await glob('**/page.tsx', {
      cwd: path.join(this.appDir, 'app'),
      ignore: ['**/node_modules/**', '**/.next/**']
    });

    for (const file of pageFiles) {
      const filePath = path.join(this.appDir, 'app', file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const url = this.getUrlFromPath(file);
      
      const analysis = this.analyzePage(content, url, filePath);
      this.pageAnalyses.set(url, analysis);
      
      // Check for critical issues
      if (analysis.h1Count === 0) {
        this.issues.push({
          type: 'h1',
          severity: 'critical',
          url,
          details: 'Missing H1 tag'
        });
      } else if (analysis.h1Count > 1) {
        this.issues.push({
          type: 'h1',
          severity: 'high',
          url,
          details: `Multiple H1 tags found (${analysis.h1Count})`
        });
      }
      
      if (analysis.wordCount < 300) {
        this.issues.push({
          type: 'content',
          severity: 'critical',
          url,
          details: `Thin content: only ${analysis.wordCount} words`
        });
      }
      
      if (!analysis.metaTitle) {
        this.issues.push({
          type: 'meta',
          severity: 'high',
          url,
          details: 'Missing meta title'
        });
      }
      
      if (!analysis.metaDescription) {
        this.issues.push({
          type: 'meta',
          severity: 'high',
          url,
          details: 'Missing meta description'
        });
      }
    }
  }

  private analyzePage(content: string, url: string, filePath: string): PageAnalysis {
    // Extract H1 tags
    const h1Matches = content.match(/<h1[^>]*>([^<]+)<\/h1>/gi) || [];
    const h1Texts = h1Matches.map(match => {
      const text = match.replace(/<[^>]+>/g, '');
      return text;
    });
    
    // Count words (rough estimate from JSX)
    const textContent = content.replace(/<[^>]+>/g, ' ')
      .replace(/\{[^}]+\}/g, ' ')
      .replace(/import.*from.*;/g, '')
      .replace(/export.*{.*}/g, '');
    const words = textContent.split(/\s+/).filter(word => word.length > 2);
    
    // Check for metadata export
    const hasMetadata = content.includes('export const metadata') || 
                       content.includes('export async function generateMetadata');
    
    // Extract meta title and description if present
    let metaTitle = '';
    let metaDescription = '';
    
    if (hasMetadata) {
      const titleMatch = content.match(/title:\s*["'`]([^"'`]+)["'`]/);
      const descMatch = content.match(/description:\s*["'`]([^"'`]+)["'`]/);
      metaTitle = titleMatch ? titleMatch[1] : '';
      metaDescription = descMatch ? descMatch[1] : '';
    }
    
    // Check for schema markup
    const hasSchema = content.includes('application/ld+json') || 
                     content.includes('schema.org');
    
    // Find images
    const imageMatches = content.match(/<Image[^>]*\/?>|<img[^>]*\/?>/gi) || [];
    const images = imageMatches.map(img => ({
      src: '',
      hasAlt: img.includes('alt=')
    }));
    
    // Find internal links
    const linkMatches = content.match(/<Link[^>]*href=["']([^"']+)["'][^>]*>/gi) || [];
    const internalLinks = linkMatches.map(link => {
      const hrefMatch = link.match(/href=["']([^"']+)["']/);
      return hrefMatch ? hrefMatch[1] : '';
    }).filter(Boolean);
    
    return {
      url,
      h1Count: h1Matches.length,
      h1Text: h1Texts,
      wordCount: words.length,
      metaTitle,
      metaDescription,
      hasSchema,
      images,
      internalLinks,
      issues: []
    };
  }

  private async checkBrokenPages(): Promise<void> {
    console.log('🔗 Checking for broken pages...');
    
    // Check for pages that might return errors
    const possiblyBrokenPages = [
      '/form-submission',
      '/debug-env',
      '/debug-sheet-data'
    ];
    
    possiblyBrokenPages.forEach(page => {
      const pagePath = path.join(this.appDir, 'app', page.slice(1), 'page.tsx');
      if (!fs.existsSync(pagePath)) {
        this.issues.push({
          type: 'broken',
          severity: 'critical',
          url: page,
          details: 'Page file not found'
        });
      }
    });
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

  private generateReport(): void {
    console.log('\n' + '='.repeat(80));
    console.log('📊 SEO DIAGNOSTIC REPORT');
    console.log('='.repeat(80) + '\n');
    
    // Group issues by type
    const issuesByType = new Map<string, SEOIssue[]>();
    this.issues.forEach(issue => {
      if (!issuesByType.has(issue.type)) {
        issuesByType.set(issue.type, []);
      }
      issuesByType.get(issue.type)!.push(issue);
    });
    
    // Critical issues
    console.log('🚨 CRITICAL ISSUES (Fix Immediately):');
    console.log('-'.repeat(40));
    this.issues
      .filter(i => i.severity === 'critical')
      .forEach(issue => {
        console.log(`  ❌ [${issue.type.toUpperCase()}] ${issue.url}: ${issue.details}`);
      });
    
    console.log('\n⚠️  HIGH PRIORITY ISSUES:');
    console.log('-'.repeat(40));
    this.issues
      .filter(i => i.severity === 'high')
      .forEach(issue => {
        console.log(`  ⚠️  [${issue.type.toUpperCase()}] ${issue.url}: ${issue.details}`);
      });
    
    // Summary
    console.log('\n📈 SUMMARY:');
    console.log('-'.repeat(40));
    console.log(`  Total issues found: ${this.issues.length}`);
    console.log(`  Critical issues: ${this.issues.filter(i => i.severity === 'critical').length}`);
    console.log(`  High priority issues: ${this.issues.filter(i => i.severity === 'high').length}`);
    console.log(`  Pages analyzed: ${this.pageAnalyses.size}`);
    
    // Pages with thin content
    const thinContentPages = Array.from(this.pageAnalyses.entries())
      .filter(([_, analysis]) => analysis.wordCount < 300);
    console.log(`  Pages with thin content (<300 words): ${thinContentPages.length}`);
    
    // Pages without H1
    const noH1Pages = Array.from(this.pageAnalyses.entries())
      .filter(([_, analysis]) => analysis.h1Count === 0);
    console.log(`  Pages without H1 tags: ${noH1Pages.length}`);
    
    // Export detailed report
    const reportPath = path.join(this.appDir, 'seo-diagnostic-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      issues: this.issues,
      pageAnalyses: Array.from(this.pageAnalyses.entries()).map(([url, analysis]) => ({
        ...analysis,
        url
      }))
    }, null, 2));
    
    console.log(`\n✅ Detailed report saved to: ${reportPath}`);
  }
}

// Run diagnostic
const diagnostic = new SEODiagnostic(process.cwd());
diagnostic.runFullDiagnostic().catch(console.error);
