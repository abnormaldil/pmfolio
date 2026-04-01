'use client';
import { useEffect, useState } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

export default function Preloader() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.body.style.cursor = 'wait';

        const tl = gsap.timeline({
            onComplete: () => {
                setLoading(false);
                document.body.style.overflow = '';
                document.body.style.cursor = 'default';
                // Notify other components that loading is done
                window.dispatchEvent(new Event('finishLoading'));
                window.preloaderFinished = true; // Fallback check
            }
        });

        // Init — everything hidden
        gsap.set('.preloader-logo', { opacity: 0, y: 30 });
        gsap.set('.loading-bar-inner', { scaleX: 0, transformOrigin: 'left' });
        gsap.set('.loading-container', { opacity: 0, y: 8 });

        // ── Phase 1: Logo fades in + slides up ──
        tl.to('.preloader-logo', {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
        })

        // ── Phase 2: Loading bar appears subtly ──
        .to('.loading-container', {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
        }, '+=0.15')
        .to('.loading-bar-inner', {
            scaleX: 1,
            duration: 1.2,
            ease: 'power1.inOut',
        })

        // ── Phase 3: Everything fades out ──
        .to(['.preloader-logo', '.loading-container'], {
            opacity: 0,
            y: -20,
            duration: 0.5,
            ease: 'power2.in',
        })

        // ── Phase 4: Dramatic blind-split reveal ──
        .to('.blind-top', {
            yPercent: -100,
            duration: 0.7,
            stagger: 0.05,
            ease: 'power4.inOut',
        }, 'split')
        .to('.blind-bottom', {
            yPercent: 100,
            duration: 0.7,
            stagger: 0.05,
            ease: 'power4.inOut',
        }, '<');

        return () => {
            document.body.style.overflow = '';
            document.body.style.cursor = 'default';
            tl.kill();
        };
    }, []);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden pointer-events-none">
            {/* Blinds Background — Split Center */}
            <div className="absolute inset-0 flex w-full h-full pointer-events-auto" style={{ transform: 'translateZ(0)' }}>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="relative h-full flex-1" style={{ marginRight: '-1px', transform: 'translateZ(0)' }}>
                        <div className="blind-top absolute top-0 left-0 h-1/2 bg-[var(--red-accent)] origin-top" style={{ width: 'calc(100% + 1px)', backfaceVisibility: 'hidden' }}></div>
                        <div className="blind-bottom absolute bottom-0 left-0 h-1/2 bg-[var(--red-accent)] origin-bottom" style={{ width: 'calc(100% + 1px)', backfaceVisibility: 'hidden' }}></div>
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                {/* Logo Icon Only — slightly below center via padding-top offset */}
                <div
                    className="preloader-logo opacity-0"
                    style={{
                        width: 'clamp(64px, 12vw, 100px)',
                        height: 'clamp(64px, 12vw, 100px)',
                        position: 'relative',
                        marginTop: '5vh',
                        marginBottom: 'clamp(32px, 5vh, 56px)',
                    }}
                >
                    <Image
                        src="/hero/logo white.svg"
                        alt="Pixelated Logo"
                        fill
                        sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 100px"
                        className="object-contain"
                        priority
                    />
                </div>

                {/* Loading Bar */}
                <div
                    className="loading-container overflow-hidden rounded-full opacity-0"
                    style={{
                        width: 'clamp(120px, 20vw, 200px)',
                        height: '2px',
                        backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    }}
                >
                    <div
                        className="loading-bar-inner w-full h-full rounded-full"
                        style={{
                            background: 'linear-gradient(90deg, rgba(255,255,255,0.5), white)',
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
