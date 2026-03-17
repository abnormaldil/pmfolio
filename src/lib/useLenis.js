import Lenis from 'lenis';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function useLenis() {
    const lenisRef = useRef(null);

    useEffect(() => {
        // Initialize Lenis with optimized settings
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            smoothTouch: false, // Better performance on mobile
        });

        lenisRef.current = lenis;

        // Integrate Lenis with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        // RAF loop with GSAP integration
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Update ScrollTrigger when Lenis scrolls
        ScrollTrigger.addEventListener('refresh', () => {
            lenis.resize();
        });

        ScrollTrigger.refresh();

        return () => {
            lenis.off('scroll', ScrollTrigger.update);
            lenis.destroy();
        };
    }, []);

    return lenisRef.current;
}
