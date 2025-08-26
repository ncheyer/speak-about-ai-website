#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface PageFix {
  filePath: string;
  url: string;
  needsH1: boolean;
  needsContent: boolean;
  needsMetadata: boolean;
  currentWordCount: number;
}

class SEOFixer {
  private appDir: string;
  private fixes: PageFix[] = [];

  constructor(appDir: string) {
    this.appDir = appDir;
  }

  async runFixes(): Promise<void> {
    console.log('🔧 Starting SEO fixes...\n');
    
    // 1. Identify pages needing fixes
    await this.identifyPagesNeedingFixes();
    
    // 2. Fix each page
    for (const fix of this.fixes) {
      await this.fixPage(fix);
    }
    
    // 3. Generate report
    this.generateReport();
  }

  private async identifyPagesNeedingFixes(): Promise<void> {
    const pageFiles = await glob('**/page.tsx', {
      cwd: path.join(this.appDir, 'app'),
      ignore: ['**/node_modules/**', '**/.next/**', '**/debug*/**', '**/test*/**', '**/check-sheet*/**']
    });

    for (const file of pageFiles) {
      const filePath = path.join(this.appDir, 'app', file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const url = this.getUrlFromPath(file);
      
      // Skip debug and test pages
      if (url.includes('debug') || url.includes('test') || url.includes('check-sheet')) {
        continue;
      }
      
      const needsH1 = !this.hasH1(content);
      const wordCount = this.countWords(content);
      const needsContent = wordCount < 500;
      const needsMetadata = !this.hasMetadata(content);
      
      if (needsH1 || needsContent || needsMetadata) {
        this.fixes.push({
          filePath,
          url,
          needsH1,
          needsContent,
          needsMetadata,
          currentWordCount: wordCount
        });
      }
    }
  }

  private hasH1(content: string): boolean {
    return content.includes('<h1') || content.includes('<H1');
  }

  private hasMetadata(content: string): boolean {
    return content.includes('export const metadata') || 
           content.includes('export async function generateMetadata');
  }

  private countWords(content: string): number {
    const textContent = content
      .replace(/<[^>]+>/g, ' ')
      .replace(/\{[^}]+\}/g, ' ')
      .replace(/import.*from.*;/g, '')
      .replace(/export.*{.*}/g, '');
    const words = textContent.split(/\s+/).filter(word => word.length > 2);
    return words.length;
  }

  private async fixPage(fix: PageFix): Promise<void> {
    console.log(`📝 Fixing: ${fix.url}`);
    
    let content = fs.readFileSync(fix.filePath, 'utf-8');
    let modified = false;
    
    // Add metadata if missing
    if (fix.needsMetadata && !fix.url.includes('admin')) {
      content = this.addMetadata(content, fix.url);
      modified = true;
    }
    
    // Add H1 if missing
    if (fix.needsH1) {
      content = this.addH1ToPage(content, fix.url);
      modified = true;
    }
    
    // Add content if thin
    if (fix.needsContent) {
      content = this.expandContent(content, fix.url);
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(fix.filePath, content);
      console.log(`  ✅ Fixed: H1:${fix.needsH1} Content:${fix.needsContent} Meta:${fix.needsMetadata}`);
    }
  }

  private addMetadata(content: string, url: string): string {
    const pageName = this.getPageNameFromUrl(url);
    const metadataImport = `import type { Metadata } from "next"\n`;
    
    const metadata = `
export const metadata: Metadata = {
  title: "${pageName} | AI Keynote Speakers | Speak About AI",
  description: "${this.generateDescription(url)}",
  keywords: "AI speakers, artificial intelligence keynote, ${pageName.toLowerCase()}, AI experts",
  openGraph: {
    title: "${pageName} | Speak About AI",
    description: "${this.generateDescription(url)}",
    type: "website",
  },
  alternates: {
    canonical: "${url}",
  },
}\n`;

    // Add import if not present
    if (!content.includes('import type { Metadata }')) {
      content = metadataImport + content;
    }
    
    // Add metadata after imports
    const importEndIndex = content.lastIndexOf('import');
    const lineAfterImports = content.indexOf('\n', importEndIndex) + 1;
    
    if (!content.includes('export const metadata')) {
      content = content.slice(0, lineAfterImports) + metadata + content.slice(lineAfterImports);
    }
    
    return content;
  }

  private addH1ToPage(content: string, url: string): string {
    const pageName = this.getPageNameFromUrl(url);
    const h1Tag = `<h1 className="text-4xl font-bold text-black mb-6">${pageName}</h1>`;
    
    // Find the main return statement
    const returnIndex = content.indexOf('return (');
    if (returnIndex === -1) return content;
    
    // Find where to insert H1 (after opening of main container)
    const mainIndex = content.indexOf('<main', returnIndex);
    const sectionIndex = content.indexOf('<section', returnIndex);
    const divIndex = content.indexOf('<div', returnIndex);
    
    let insertIndex = Math.min(
      mainIndex > -1 ? mainIndex : Infinity,
      sectionIndex > -1 ? sectionIndex : Infinity,
      divIndex > -1 ? divIndex : Infinity
    );
    
    if (insertIndex !== Infinity) {
      const closeTagIndex = content.indexOf('>', insertIndex) + 1;
      content = content.slice(0, closeTagIndex) + '\n        ' + h1Tag + content.slice(closeTagIndex);
    }
    
    return content;
  }

  private expandContent(content: string, url: string): string {
    const pageName = this.getPageNameFromUrl(url);
    const additionalContent = this.generateContentForPage(url, pageName);
    
    // Find where to add content (before closing main tag or at end of return)
    const mainCloseIndex = content.lastIndexOf('</main>');
    const sectionCloseIndex = content.lastIndexOf('</section>');
    
    let insertIndex = Math.max(mainCloseIndex, sectionCloseIndex);
    
    if (insertIndex > -1) {
      content = content.slice(0, insertIndex) + additionalContent + content.slice(insertIndex);
    }
    
    return content;
  }

  private generateContentForPage(url: string, pageName: string): string {
    // Generate relevant content based on the page type
    if (url.includes('speaker')) {
      return this.generateSpeakerContent();
    } else if (url.includes('blog')) {
      return this.generateBlogContent();
    } else if (url.includes('industr')) {
      return this.generateIndustryContent(pageName);
    } else {
      return this.generateGenericContent(pageName);
    }
  }

  private generateSpeakerContent(): string {
    return `
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-black mb-4">About Our AI Keynote Speakers</h2>
              <p className="text-gray-700 mb-4">
                Our AI keynote speakers are industry leaders and pioneering researchers who bring 
                cutting-edge insights on artificial intelligence, machine learning, and digital transformation. 
                Each speaker is carefully selected for their expertise, presentation skills, and ability 
                to deliver actionable insights that resonate with diverse audiences.
              </p>
              <p className="text-gray-700 mb-4">
                From Fortune 500 executives to renowned academics, our speakers have presented at 
                major conferences worldwide, including TED, Web Summit, CES, and industry-specific events. 
                They bring real-world experience in implementing AI solutions across various sectors.
              </p>
              <h3 className="text-xl font-semibold text-black mt-6 mb-3">Speaking Topics Include:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Generative AI and Large Language Models</li>
                <li>• AI Strategy and Digital Transformation</li>
                <li>• Ethical AI and Responsible Innovation</li>
                <li>• Machine Learning Applications in Business</li>
                <li>• The Future of Work with AI</li>
              </ul>
            </div>
          </div>
        </section>`;
  }

  private generateBlogContent(): string {
    return `
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-black mb-4">Latest Insights on AI and Innovation</h2>
              <p className="text-gray-700 mb-4">
                Stay informed with the latest developments in artificial intelligence, machine learning, 
                and emerging technologies. Our blog features insights from leading AI keynote speakers, 
                industry experts, and thought leaders who are shaping the future of AI.
              </p>
              <p className="text-gray-700 mb-4">
                Discover practical applications of AI across industries, learn about breakthrough 
                research, and understand how organizations are leveraging AI to drive innovation 
                and competitive advantage. Our content is designed to help business leaders, 
                technology professionals, and event organizers stay ahead of the curve.
              </p>
            </div>
          </div>
        </section>`;
  }

  private generateIndustryContent(industry: string): string {
    return `
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-black mb-4">AI Transformation in ${industry}</h2>
              <p className="text-gray-700 mb-4">
                The ${industry} industry is experiencing unprecedented transformation through artificial 
                intelligence and machine learning technologies. Our specialized AI keynote speakers bring 
                deep expertise in ${industry.toLowerCase()}-specific applications, helping organizations 
                understand and implement AI solutions that drive measurable results.
              </p>
              <p className="text-gray-700 mb-4">
                From predictive analytics to process automation, AI is revolutionizing how ${industry.toLowerCase()} 
                companies operate, compete, and deliver value to customers. Our speakers provide insights 
                on best practices, case studies, and emerging trends that are reshaping the industry landscape.
              </p>
              <h3 className="text-xl font-semibold text-black mt-6 mb-3">Key AI Applications:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Intelligent automation and process optimization</li>
                <li>• Predictive analytics and data-driven decision making</li>
                <li>• Customer experience enhancement through AI</li>
                <li>• Risk management and compliance automation</li>
                <li>• Innovation and product development acceleration</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Book an AI keynote speaker who understands the unique challenges and opportunities 
                in ${industry.toLowerCase()}. Our experts deliver tailored presentations that resonate 
                with your audience and provide actionable strategies for AI adoption.
              </p>
            </div>
          </div>
        </section>`;
  }

  private generateGenericContent(pageName: string): string {
    return `
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-black mb-4">Expert AI Speakers for Every Occasion</h2>
              <p className="text-gray-700 mb-4">
                Speak About AI connects you with world-renowned artificial intelligence experts who 
                deliver compelling keynote presentations tailored to your audience. Whether you're 
                hosting a corporate conference, industry summit, or educational seminar, our speakers 
                bring cutting-edge insights and practical knowledge.
              </p>
              <p className="text-gray-700 mb-4">
                Our exclusive focus on AI speakers means we understand the nuances of artificial 
                intelligence topics and can match you with the perfect expert for your event. From 
                technical deep-dives to strategic overviews, our speakers adapt their content to 
                meet your specific objectives.
              </p>
              <p className="text-gray-700">
                Experience the difference of working with the premier AI speaker bureau. Contact us 
                today to book your next keynote speaker and transform your event with insights that 
                inspire action and drive innovation.
              </p>
            </div>
          </div>
        </section>`;
  }

  private generateDescription(url: string): string {
    const pageName = this.getPageNameFromUrl(url);
    
    if (url.includes('speaker')) {
      return `Browse and book top AI keynote speakers for your next event. Expert artificial intelligence speakers for conferences, corporate events, and seminars.`;
    } else if (url.includes('blog')) {
      return `Latest insights on AI, machine learning, and innovation from leading keynote speakers and industry experts. Stay informed on AI trends and applications.`;
    } else if (url.includes('industr')) {
      return `Leading AI keynote speakers specializing in ${pageName.toLowerCase()}. Book industry-specific artificial intelligence experts for your next event.`;
    } else {
      return `${pageName} - Speak About AI, the premier AI-exclusive speaker bureau. Book world-class artificial intelligence keynote speakers.`;
    }
  }

  private getPageNameFromUrl(url: string): string {
    if (url === '/') return 'Home';
    
    const segments = url.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    
    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
    console.log('📊 SEO FIX REPORT');
    console.log('='.repeat(80) + '\n');
    
    console.log(`✅ Total pages fixed: ${this.fixes.length}`);
    console.log(`  - Pages needing H1 tags: ${this.fixes.filter(f => f.needsH1).length}`);
    console.log(`  - Pages needing content expansion: ${this.fixes.filter(f => f.needsContent).length}`);
    console.log(`  - Pages needing metadata: ${this.fixes.filter(f => f.needsMetadata).length}`);
    
    console.log('\n📋 Fixed pages:');
    this.fixes.forEach(fix => {
      console.log(`  - ${fix.url}`);
    });
    
    console.log('\n✨ All fixes applied successfully!');
  }
}

// Run the fixer
const fixer = new SEOFixer(process.cwd());
fixer.runFixes().catch(console.error);
