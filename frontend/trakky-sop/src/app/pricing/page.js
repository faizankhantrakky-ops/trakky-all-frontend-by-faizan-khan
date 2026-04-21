import { PricingComponent } from '@/components'
import React from 'react'
import Head from 'next/head'

// --------------------------------------

export const metadata = {
  title: "Trakky POS | Salon Software Plans India",
  description:
    "Choose Trakky POS plans for salons in India. From Starter to Enterprise, manage sales, appointments, staff & inventory efficiently.",
  alternates: {
    canonical: "https://salonmanagementsoftware.trakky.in/pricing/",
  },
  robots: {
    index: true,
    follow: true,
  },
}

const PricingPage = () => {
  return (
    <>
      <Head>
        {/* ✅ Core Meta */}
        <title>Trakky POS | Salon Software Plans & Pricing </title>
        <meta
          name="description"
          content="Compare Trakky POS salon software pricing plans in India. Manage bookings, billing, staff, and inventory with ease. Find the perfect plan for your salon business today!"
        />
        <link
          rel="canonical"
          href="https://salonmanagementsoftware.trakky.in/pricing/"
        />

        {/* ✅ SEO Enhancements */}
        <meta
          name="keywords"
          content="salon software pricing India, salon software plans, salon management software, booking software, billing software"
        />
        <meta name="publisher" content="Trakky" />
        <meta httpEquiv="X-Robots-Tag" content="index, follow" />
        <meta name="language" content="en" />
      </Head>

      {/* ✅ Page Content */}
      <PricingComponent />
    </>
  )
}

export default PricingPage
