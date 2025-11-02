"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Phone, Users, Mail, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button" // Import the Button component

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/speak-about-ai-logo.png"
              alt="Speak About AI - AI Keynote Speaker Bureau Logo"
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
              Speakers
            </Link>
            <Link href="/ai-workshops" className="text-gray-700 hover:text-[#1E68C6] font-medium">
              Workshops
            </Link>
            <Link href="/our-services" className="text-gray-700 hover:text-[#1E68C6] font-medium">
              Services
            </Link>
            <Link href="/our-team" className="text-gray-700 hover:text-[#1E68C6] font-medium">
              About Us
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-[#1E68C6] font-medium">
              Resources
            </Link>
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/portal"
              className="flex items-center text-gray-600 hover:text-[#1E68C6] transition-colors"
            >
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Portal</span>
            </Link>
            <a
              href="tel:+1-510-435-3947"
              className="flex items-center text-gray-600 hover:text-[#1E68C6] transition-colors"
              style={{ textDecoration: "none" }}
            >
              <Phone className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Call Now</span>
            </a>
            <Button
              asChild
              variant="gold"
              size="sm"
              className="font-montserrat font-bold"
            >
              <Link href="/contact">Book Speaker Today</Link>
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
              <Link
                href="/"
                className="text-gray-700 hover:text-[#1E68C6] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/speakers"
                className="text-gray-700 hover:text-[#1E68C6] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Speakers
              </Link>
              <Link
                href="/ai-workshops"
                className="text-gray-700 hover:text-[#1E68C6] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Workshops
              </Link>
              <Link
                href="/our-services"
                className="text-gray-700 hover:text-[#1E68C6] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/our-team"
                className="text-gray-700 hover:text-[#1E68C6] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/blog"
                className="text-gray-700 hover:text-[#1E68C6] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </Link>
              <Link
                href="/portal"
                className="text-gray-700 hover:text-[#1E68C6] font-medium flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="w-4 h-4 mr-2" />
                Portal
              </Link>
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <Button
                  asChild
                  variant="gold"
                  size="default" // Using 'default' size for mobile, as it's w-full
                  className="font-montserrat font-bold w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link href="/contact">Book Speaker Today</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
