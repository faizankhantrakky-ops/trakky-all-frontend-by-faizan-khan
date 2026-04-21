import { SalonPageComponent } from '@/components'
import React from 'react'
import Head from 'next/head'

// ------------------------------------------

export const metadata = {
  title: "Trakky – India’s All-in-One Salon Software",
  description:
    "Effortlessly manage bookings, billing, staff, inventory & loyalty programs with Trakky, India’s top salon software. Grow your salon business faster!",
  alternates: {
    canonical: "https://salonmanagementsoftware.trakky.in/salon/",
  },
  robots: {
    index: true,
    follow: true,
  },
}

const SalonPage = () => {
  return (
    <>
      <Head>
        {/* ✅ Core Meta */}
        <title>Trakky | Best Salon Management Software in India for Smart Salons</title>
        <meta
          name="description"
          content="Trakky is India’s #1 salon management software trusted by 200+ salons. Manage appointments, staff, billing, inventory & loyalty programs with ease. Book your free demo today!"
        />
        <link
          rel="canonical"
          href="https://salonmanagementsoftware.trakky.in/salon/"
        />

        {/* ✅ SEO Enhancements */}
        <meta
          name="keywords"
          content="best salon software India, all-in-one salon management, salon booking software, salon billing software"
        />
        <meta name="publisher" content="Trakky" />
        <meta httpEquiv="X-Robots-Tag" content="index, follow" />
        <meta name="language" content="en" />
      </Head>

      {/* ✅ Page Content */}
      <SalonPageComponent />
    </>
  )
}

export default SalonPage
