"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Updated with official logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/speak-about-ai-logo.png"
              alt="Speak About AI"
              width={200}
              height={60}
              priority
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-[#1E68C6] font-medium">
              Home
            </Link>
            <Link href="/speakers" className="text-gray-700 hover:text-[#1E68C6] font-medium">
              All Speakers
            </Link>
            <Link href="/our-services" className="text-gray-700 hover:text-[#1E68C6] font-medium">
              Our Services
            </Link>
            <Link href="/our-team" className="text-gray-700 hover:text-[#1E68C6] font-medium">
              Our Team
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-[#1E68C6] font-medium">
              Blog
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="tel:+1-510-435-3947" className="flex items-center text-gray-600 hover:text-[#1E68C6]">
              <Phone className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Call Now</span>
            </a>
            <Button
              asChild
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-[#1E68C6] font-medium">
                Home
              </Link>
              <Link href="/speakers" className="text-gray-700 hover:text-[#1E68C6] font-medium">
                All Speakers
              </Link>
              <Link href="/our-services" className="text-gray-700 hover:text-[#1E68C6] font-medium">
                Our Services
              </Link>
              <Link href="/our-team" className="text-gray-700 hover:text-[#1E68C6] font-medium">
                Our Team
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-[#1E68C6] font-medium">
                Blog
              </Link>
              <div className="pt-4 border-t border-gray-100">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
