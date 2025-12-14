"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Phone, Users, Mail, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button" // Import the Button component

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-[#1E68C6] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            {/* Full Logo - Mobile and Large Desktop */}
            <Image
              src="/speak-about-ai-logo.png"
              alt="Speak About AI - AI Keynote Speaker Bureau Logo"
              width={200}
              height={60}
              priority
              className="md:hidden xl:block h-10 md:h-12 w-auto flex-shrink-0"
            />
            {/* Circular Logo - Condensed Desktop (tablet/small desktop) */}
            <Image
              src="/new-ai-logo.png"
              alt="Speak About AI"
              width={48}
              height={48}
              priority
              className="hidden md:block xl:hidden h-12 w-12 rounded-full object-cover flex-shrink-0"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
            <Link href="/" className="text-white/90 hover:text-white font-medium transition-colors">
              Home
            </Link>
            <Link href="/speakers" className="text-white/90 hover:text-white font-medium transition-colors">
              Speakers
            </Link>
            <Link href="/our-services" className="text-white/90 hover:text-white font-medium transition-colors">
              Services
            </Link>
            <Link href="/our-team" className="text-white/90 hover:text-white font-medium transition-colors">
              About Us
            </Link>
            <Link href="/blog" className="text-white/90 hover:text-white font-medium transition-colors">
              Resources
            </Link>
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3 xl:space-x-4 flex-shrink-0">
            <Button
              asChild
              variant="gold"
              size="sm"
              className="font-montserrat font-bold text-xs lg:text-sm whitespace-nowrap"
            >
              <Link href="/contact">Book Speaker Today</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-white/90 hover:text-white font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/speakers"
                className="text-white/90 hover:text-white font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Speakers
              </Link>
              <Link
                href="/our-services"
                className="text-white/90 hover:text-white font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/our-team"
                className="text-white/90 hover:text-white font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/blog"
                className="text-white/90 hover:text-white font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </Link>
              <div className="pt-4 border-t border-white/20 space-y-3">
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
