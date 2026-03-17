import Navbar from '@/components/Navbar';
import Web from '@/components/Web';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import { fetchPortfolioData } from '@/lib/fetchPortfolioData';

export const dynamic = "force-dynamic";

export const metadata = {
    title: 'Portfolio | Pixelated Media',
    description:
        'Explore the full portfolio of websites and creative work built by Pixelated — digital design that turns visitors into customers.',
};

export const revalidate = 3600;

export default async function PortfolioPage() {
    const { websites, creatives } = await fetchPortfolioData();

    return (
        <main className="relative bg-white">
            <Navbar />
            
            <ErrorBoundary name="Portfolio">
                <Web websitesData={websites} creativesData={creatives} />
            </ErrorBoundary>

            <Footer />
            <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>
            </div>
        </main>
    );
}
