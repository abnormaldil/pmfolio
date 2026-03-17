import Navbar from '@/components/Navbar';
import Contact from '@/components/Contact';
import ErrorBoundary from '@/components/ErrorBoundary';

export const dynamic = "force-dynamic";

export const metadata = {
    title: 'Contact Us | Pixelated',
    description: 'Get in touch with Pixelated.',
};

export default function ContactPage() {
    return (
        <main className="relative bg-[#0A0A0F] h-screen overflow-hidden w-full m-0 p-0">
            <Navbar />

            <ErrorBoundary name="Contact">
                <Contact />
            </ErrorBoundary>
        </main>
    );
}
