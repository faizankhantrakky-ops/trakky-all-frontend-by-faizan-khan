import { ScheduleDemoComponent } from '@/components'
import React from 'react'
import Head from 'next/head' // 👈 Import Head

// ---------------------------------------------

export const metadata = {
    title: "Schedule a Free Demo Trakky Salon Management Software",
    description: "Book your free demo of Trakky, India’s top salon software. Manage bookings, billing, staff & clients effortlessly. Try it today!",
    alternates: {
        canonical: "https://salonmanagementsoftware.trakky.in/schedule-demo/",
    },
    robots: {
        index: true,
        follow: true,
    },
}

const ScheduleDemoPage = () => {
    return (
        <>
            <Head>
                <meta name="keywords" content="salon software demo, free salon software demo, salon management software, salon booking software, salon billing software" />
            </Head>
            <ScheduleDemoComponent />
        </>
    )
}

export default ScheduleDemoPage
