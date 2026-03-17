'use client';
import { useState, useEffect } from 'react';
import HeroDesktop from './HeroDesktop';
import HeroMobile from './HeroMobile';

export default function Hero() {
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        // Initial check
        checkMobile();

        // Listen for window resize
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Prevent hydration mismatch by only rendering after mount
    if (!mounted) {
        return <section id="home" className="w-full h-screen bg-[#EFEFEF]" />;
    }

    return isMobile ? <HeroMobile /> : <HeroDesktop />;
}
