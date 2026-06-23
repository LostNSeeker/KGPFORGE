import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '../components/ui/button'
import { StarsAnimation } from '../components/ui/stars-animation'

import { ProfileModal } from '../components/ProfileModal';
import {
  ArrowRight,
} from 'lucide-react'
import { ClientFeedback } from '../components/landing/ClientFeedback'
import { HowItWorksSection } from '../components/landing/HowItWorksSection'
import { PlatformFeaturesSection } from '../components/landing/PlatformFeaturesSection'
import { SponsorsCarousel } from '../components/landing/SponsorsCarousel'
import { SuccessStoriesSection } from '../components/landing/SuccessStoriesSection'

import backgroundHero from '../images/EcellSponsors/backgroundHero.webp'

export const LandingPage: React.FC = () => {

    const [viewingAlumniId, setViewingAlumniId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section — responsive height and padding */}
      <section className="relative flex items-center justify-center overflow-hidden min-h-[70vh] lg:min-h-[85vh] pt-24 pb-8 lg:pt-12 lg:pb-5">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 scale-[1.02] blur-[1.5px]"
          style={{ backgroundImage: `url(${backgroundHero})` }}
          aria-hidden
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-white/12 via-white/8 to-white/15" aria-hidden />
        {/* Stars Animation */}
        <div className="absolute inset-0 z-10">
          <StarsAnimation
            className="opacity-40"
            starCount={120}
            speed={1.5}
          />
        </div>

        {/* Floating Elements */}
        <div className="hidden md:block absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="hidden md:block absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="hidden md:block absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full opacity-25 animate-pulse"></div>
        <div className="hidden md:block absolute top-60 right-1/3 w-8 h-8 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full opacity-40 animate-bounce"></div>

        <div className="container mx-auto px-4 w-full z-20 flex justify-center mt-12 lg:mt-20">
          <div className="max-w-5xl mx-auto text-center px-0">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent animate-pulse">
                KGP forge
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-gray-600 mb-8 max-w-[90vw] md:max-w-2xl mx-auto leading-relaxed break-words">
              For Kgpians By Kgpians &rarr; One in all platform for investor, student, mentor and Founder
            </p>
            <div className="flex justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg shadow-blue-200/30 border-0" asChild>
                <Link to="/about">
                  About Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Sponsors strip inside hero */}
            <div className="mt-16 w-full max-w-5xl mx-auto">
              <SponsorsCarousel />
            </div>
          </div>
        </div>

        {/* Scroll indicator on the image (bottom of hero) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <a href="#how-it-works" className="w-6 h-10 border-2 border-blue-400 rounded-full flex justify-center pt-2 shadow-md bg-white/20 backdrop-blur-sm">
            <span className="w-1 h-3 bg-blue-500 rounded-full animate-pulse" />
          </a>
        </div>
      </section>

      <div id="how-it-works" className="scroll-mt-4" />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Platform Features Section */}
      <PlatformFeaturesSection />

      {/* Success Stories Section */}
      <SuccessStoriesSection />

      {/* Client Feedback Section */}
      <ClientFeedback />

      {/* Adding this Profile Modal at the end */}
      {viewingAlumniId && (
        <ProfileModal
          userId={viewingAlumniId}
          isOpen={!!viewingAlumniId}
          onClose={() => setViewingAlumniId(null)}
        />
      )}
    </div>
  )
}
