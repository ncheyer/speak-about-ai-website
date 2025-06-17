import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
              <Image
                src="/speak-about-ai-light-logo.png"
                alt="Speak About AI"
                width={200}
                height={60}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-[#EAEAEE] mb-6 max-w-md">
              The world's only AI-exclusive speaker bureau, connecting organizations around the world with the most
              sought-after artificial intelligence experts and thought leaders.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-[#1E68C6]" />
                <span className="text-[#EAEAEE]">(510) 435-3947</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-[#1E68C6]" />
                <span className="text-[#EAEAEE]">human@speakabout.ai</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-3 text-[#1E68C6]" />
                <span className="text-[#EAEAEE]">Palo Alto, CA</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/speakers" className="text-[#EAEAEE] hover:text-white">
                  All Speakers
                </Link>
              </li>
              <li>
                <Link href="/our-services" className="text-[#EAEAEE] hover:text-white">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/our-team" className="text-[#EAEAEE] hover:text-white">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#EAEAEE] hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-[#EAEAEE] hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Industries</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/industries/healthcare-ai-speakers"
                  scroll={false}
                  className="text-[#EAEAEE] hover:text-white"
                >
                  Healthcare AI
                </Link>
              </li>
              <li>
                <Link
                  href="/industries/technology-keynote-speakers"
                  scroll={false}
                  className="text-[#EAEAEE] hover:text-white"
                >
                  Technology & Enterprise
                </Link>
              </li>
              <li>
                <Link href="/industries/finance-ai-speakers" scroll={false} className="text-[#EAEAEE] hover:text-white">
                  Financial Services
                </Link>
              </li>
              <li>
                <Link
                  href="/industries/leadership-business-strategy-ai-speakers"
                  scroll={false}
                  className="text-[#EAEAEE] hover:text-white"
                >
                  Leadership & Business Strategy
                </Link>
              </li>
              <li>
                <Link
                  href="/industries/sales-marketing-ai-speakers"
                  scroll={false}
                  className="text-[#EAEAEE] hover:text-white"
                >
                  Sales & Marketing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-[#EAEAEE] text-sm mb-4 md:mb-0">© 2025 Speak About AI. All rights reserved.</div>
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-[#EAEAEE] hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-[#EAEAEE] hover:text-white text-sm">
                Terms of Service
              </Link>
              <div className="flex space-x-4">
                <a
                  href="https://www.linkedin.com/company/speakabout-ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#EAEAEE] hover:text-white"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
