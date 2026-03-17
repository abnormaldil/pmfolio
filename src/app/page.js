import Hero from '../components/Hero';
import WhyUs from '../components/WhyUs';
import Navbar from '../components/Navbar';
import WhatWeCraft from '@/components/WhatWeCraft';
import Web from '@/components/Web';
import Footer from '@/components/Footer';
import Contact from '@/components/Contact';
import ErrorBoundary from '@/components/ErrorBoundary';
import { fetchPortfolioData } from '@/lib/fetchPortfolioData';
import PortfolioChatbot from '@/components/PortfolioChatbot';


export const metadata = {
  title: 'Pixelated | Digital Design Agency',
  description:
    'We build digital assets that turn visitors into customers with design that actually works.',
};

export const revalidate = 3600; // Cache the page for 1 hour (3600 seconds) for quick reloads

export default async function HomePage() {
  const { websites, creatives } = await fetchPortfolioData();

  return (
    <main className="relative bg-black">
      <Navbar />

      <ErrorBoundary name="Hero">
        <Hero />
      </ErrorBoundary>

      <ErrorBoundary name="WhyUs">
        <WhyUs />
      </ErrorBoundary>

      <ErrorBoundary name="WhatWeCraft">
        <WhatWeCraft />
      </ErrorBoundary>

      <ErrorBoundary name="Portfolio">
        <Web websitesData={websites} creativesData={creatives} />
      </ErrorBoundary>

      <ErrorBoundary name="Contact">
        <Contact />
      </ErrorBoundary>

      <Footer />
    </main>
  );
}
