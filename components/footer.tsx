import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, Linkedin, MessageCircle } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
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
                <a href="tel:+1-510-435-3947" className="text-[#EAEAEE] hover:text-white">
                  (510) 435-3947
                </a>
                <span className="ml-2 text-xs text-gray-400">(9am-6pm PT)</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-3 text-[#1E68C6]" />
                <a
                  href="https://wa.me/15104353947"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#EAEAEE] hover:text-white"
                >
                  WhatsApp (24/7 Global)
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-[#1E68C6]" />
                <a href="mailto:human@speakabout.ai" className="text-[#EAEAEE] hover:text-white">
                  human@speakabout.ai
                </a>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                <Link href="/contact" className="text-[#1E68C6] hover:text-blue-400">
                  Request a callback
                </Link>{" "}
                for international inquiries
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
              <li>
                <Link href="/sitemap.xml" className="text-[#EAEAEE] hover:text-white">
                  Sitemap
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
                  href="/industries/healthcare-keynote-speakers"
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
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/vendor-directory" className="text-[#EAEAEE] hover:text-white">
                  Vendor Directory
                </Link>
              </li>
              <li>
                <Link href="/conference-directory" className="text-[#EAEAEE] hover:text-white">
                  Conference Directory
                </Link>
              </li>
              <li>
                <Link href="/event-professionals-whatsapp" className="text-[#EAEAEE] hover:text-white">
                  Event Professionals Group
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Portals</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/portal/client" className="text-[#EAEAEE] hover:text-white">
                  Client Portal
                </Link>
              </li>
              <li>
                <Link href="/portal/speaker" className="text-[#EAEAEE] hover:text-white">
                  Speaker Portal
                </Link>
              </li>
              <li>
                <Link href="/apply" className="text-[#EAEAEE] hover:text-white">
                  Apply to Be a Speaker
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
