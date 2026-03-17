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
            }
        });

        // Init — everything hidden
        gsap.set('.preloader-logo', { opacity: 0, scale: 0.85 });
        gsap.set('.preloader-name-char', { opacity: 0, y: 20 });
        gsap.set('.preloader-tagline', { opacity: 0, y: 10 });
        gsap.set('.loading-bar-inner', { scaleX: 0, transformOrigin: 'left' });
        gsap.set('.loading-container', { opacity: 0 });

        // ── Phase 1: Logo breathes in ──
        tl.to('.preloader-logo', {
            opacity: 1,
            scale: 1.04,
            duration: 0.8,
            ease: 'power2.out',
        })
            .to('.preloader-logo', {
                scale: 1,
                duration: 0.5,
                ease: 'power2.inOut',
            })

            // ── Phase 2: Agency name letters stagger in ──
            .to('.preloader-name-char', {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.04,
                ease: 'power3.out',
            }, '-=0.3')

            // ── Phase 3: Tagline fades up ──
            .to('.preloader-tagline', {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power2.out',
            }, '-=0.15')

            // ── Phase 4: Loading bar appears + fills ──
            .to('.loading-container', {
                opacity: 1,
                duration: 0.3,
            }, '-=0.2')
            .to('.loading-bar-inner', {
                scaleX: 1,
                duration: 1.2,
                ease: 'power1.inOut',
            })

            // ── Phase 5: Everything fades out ──
            .to(['.preloader-logo', '.preloader-name-char', '.preloader-tagline', '.loading-container'], {
                opacity: 0,
                y: -15,
                duration: 0.5,
                ease: 'power2.in',
            })

            // ── Phase 6: Dramatic blind-split reveal ──
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

    const agencyName = 'PIXELATED';

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden pointer-events-none">
            {/* Blinds Background — Split Center */}
            <div className="absolute inset-0 flex w-full h-full pointer-events-auto">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="relative h-full flex-1">
                        <div className="blind-top absolute top-0 left-0 w-full h-1/2 bg-[var(--red-accent)] border-r border-black/5 last:border-0 origin-top"></div>
                        <div className="blind-bottom absolute bottom-0 left-0 w-full h-1/2 bg-[var(--red-accent)] border-r border-black/5 last:border-0 origin-bottom"></div>
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                {/* Logo */}
                <div className="preloader-logo relative w-20 h-20 mb-6 opacity-0">
                    <Image
                        src="/hero/logo white.svg"
                        alt="Pixelated Logo"
                        fill
                        sizes="80px"
                        className="object-contain"
                        priority
                    />
                </div>

                {/* Agency Name — staggered letter reveal */}
                <div className="flex items-center gap-[2px] mb-2">
                    {agencyName.split('').map((char, i) => (
                        <span
                            key={i}
                            className="preloader-name-char inline-block uppercase text-white opacity-0"
                            style={{
                                fontFamily: 'Humane-rg',
                                fontSize: 'clamp(36px, 5vw, 60px)',
                                letterSpacing: '0.08em',
                                lineHeight: 1,
                            }}
                        >
                            {char}
                        </span>
                    ))}
                </div>

                {/* Tagline */}
                <p
                    className="preloader-tagline uppercase text-white/50 mb-8 opacity-0"
                    style={{
                        fontFamily: 'Thedus-cl',
                        fontSize: 'clamp(10px, 0.9vw, 13px)',
                        letterSpacing: '0.3em',
                    }}
                >
                    FREELANCE AGENCY
                </p>

                {/* Loading Bar */}
                <div className="loading-container w-48 h-[2px] bg-white/15 rounded-full overflow-hidden opacity-0">
                    <div
                        className="loading-bar-inner w-full h-full rounded-full"
                        style={{
                            background: 'linear-gradient(90deg, rgba(255,255,255,0.6), white)',
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

