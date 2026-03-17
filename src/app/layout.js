import { Geist, Geist_Mono, Anton } from "next/font/google";
import "./globals.css";
import SmoothScroll from "../components/SmoothScroll";

export const dynamic = "force-dynamic";
import Preloader from "../components/Preloader";
import TargetCursor from "../components/TargetCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pixelatedmedia.in";
const siteName = "Pixelated Media";
const siteDescription =
  "We don't just deliver files. We build digital assets that turn visitors into customers with design that actually works. Trusted by 100+ brands.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - Digital Design Agency`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "digital design",
    "web design",
    "motion graphics",
    "UI/UX design",
    "brand design",
    "creative agency",
    "freelance designers",
    "freelance designer",
    "digital design agency",
    "digital design agency in India",
    "best digital design agency in India",
    "best Freelnce designer"
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} - Digital Design Agency`,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} - Digital Design Agency`,
    description: siteDescription,
    images: [`${siteUrl}/og-image.jpg`],
    creator: "@pixelated",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteName,
  description: siteDescription,
  url: siteUrl,
  logo: `${siteUrl}/logo-white.png`,
  sameAs: [
    
    "https://instagram.com/pixelatedmedia",
    // "https://linkedin.com/company/pixelated",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    email: "hello@pixelated.agency",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "100",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} antialiased`}
      >
        <svg className="absolute w-0 h-0">
          <filter id="liquid">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.02"
              numOctaves="3"
              result="warp"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="warp"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
        <Preloader />
        <SmoothScroll />
        <TargetCursor
          spinDuration={2}
          hideDefaultCursor
          parallaxOn
          hoverDuration={0.2}
          targetSelector="button, a, [role='button'], [data-cursor]"
        />
        {children}
      </body>
    </html>
  );
}
