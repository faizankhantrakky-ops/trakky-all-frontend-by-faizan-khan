// app/layout.tsx
import { Poppins } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar';
import { Footer } from '@/components';
import { Metadata } from 'next';

// Font: Poppins
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

// Global Metadata (SEO + Open Graph)
export const metadata = {
  metadataBase: new URL('https://salonmanagementsoftware.trakky.in'),
  title: {
    default: 'Trakky – Best Salon Management Software in India',
    template: '%s | Trakky Salon Software',
  },
  description:
    'Best salon management software in India. Manage appointments, billing, staff, inventory & clients. Trusted by top salons in Ahmedabad, Mumbai, Delhi.',
  keywords: [
    'Best Salon Management Software',
    'Salon Software India',
    'Salon Booking Software',
    'Salon Billing Software'
  ].join(', '),
  authors: [{ name: 'Trakky Team' }],
  creator: 'Trakky',
  publisher: 'Trakky',

  // Open Graph
  openGraph: {
    title: 'Trakky – #1 Salon Management Software in India',
    description: 'Run your salon smarter. Book appointments, manage staff & billing in one app.',
    url: 'https://salonmanagementsoftware.trakky.in',
    siteName: 'Trakky',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Trakky – Best Salon Software in India',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Trakky – Best Salon Management Software',
    description: 'India’s #1 salon software for bookings, billing & growth.',
    images: ['/og-image.jpg'],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Favicon & Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  // Canonical URL
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <head>
        {/* Optional: Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${poppins.className} antialiased`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}