"use client"

import Hero from "@/components/hero"
import Brand from "@/components/brand"
import Cta from "@/components/cta"
import EpicContentSection from "@/components/image-slider"
import Cta1 from "@/components/cta1"
import SpotlightedCreators from "@/components/creators"
import Testimonials from "@/components/testimonials"
import Why from "@/components/why"
import FAQs from "@/components/FAQs"
import Footer from "@/components/Footer"
import Newsletter from "@/components/Newsletter"

export default function Home() {
  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <div className="px-3">
        <Hero />


        {/* Stats Section */}
        <Brand />

        {/* Why Epiclinx Section */}
        <Why />

        {/* Testimonials Section */}
        <Testimonials />

        {/* Final CTA Section */}
        <Cta />
      </div>

      <div className="bg-white px-3">
        <EpicContentSection />
      </div>

      <div className="bg-[#edf8f6] px-3">
        <Cta1 />
        <SpotlightedCreators />
      </div>

      <FAQs />
      <Newsletter />
      <Footer />
    </div>
  )
}
