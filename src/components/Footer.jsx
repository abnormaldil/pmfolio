'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
    const sectionRef = useRef(null);
    const subheadRef = useRef(null);
    const line1Ref = useRef(null);
    const line2Ref = useRef(null);
    const dividerRef = useRef(null);
    const btnsRef = useRef(null);
    const socialsRef = useRef(null);
    const copyrightRef = useRef(null);
    const glowRef = useRef(null);

    useEffect(() => {
        const init = () => {
            const ctx = gsap.context(() => {

                /* ── 1. subhead: letter-by-letter slide up ── */
                const subChars = subheadRef.current?.querySelectorAll('.sub-char') || [];
                if (subChars.length) {
                    gsap.set(subChars, { y: 30, opacity: 0 });
                    gsap.to(subChars, {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        stagger: 0.03,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top 70%',
                            toggleActions: 'play none none reverse',
                        },
                    });
                }

                /* ── 2. headline: smooth letter-by-letter masked reveal ── */
                const line1Chars = line1Ref.current?.querySelectorAll('.h-char') || [];
                const line2Chars = line2Ref.current?.querySelectorAll('.h-char') || [];

                // Line 1: PIXELATED — smooth scrub reveal
                if (line1Chars.length) {
                    gsap.set(line1Chars, {
                        y: '120%',
                        rotateX: -45,
                        scale: 0.8,
                        opacity: 0,
                        filter: 'blur(4px)',
                    });

                    gsap.to(line1Chars, {
                        y: '0%',
                        rotateX: 0,
                        scale: 1,
                        opacity: 1,
                        filter: 'blur(0px)',
                        stagger: 0.06,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top 85%',
                            end: 'top 35%',
                            scrub: 1.5,
                        },
                    });
                }

                // Line 2: MEDIA — smooth scrub reveal (later range)
                if (line2Chars.length) {
                    gsap.set(line2Chars, {
                        y: '120%',
                        rotateX: -45,
                        scale: 0.8,
                        opacity: 0,
                        filter: 'blur(4px)',
                    });

                    gsap.to(line2Chars, {
                        y: '0%',
                        rotateX: 0,
                        scale: 1,
                        opacity: 1,
                        filter: 'blur(0px)',
                        stagger: 0.08,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top 65%',
                            end: 'top 20%',
                            scrub: 1.5,
                        },
                    });
                }

                /* ── 3. divider line wipe ── */
                if (dividerRef.current) {
                    gsap.set(dividerRef.current, { scaleX: 0, transformOrigin: 'left center' });
                    gsap.to(dividerRef.current, {
                        scaleX: 1,
                        duration: 1,
                        ease: 'power3.inOut',
                        scrollTrigger: {
                            trigger: dividerRef.current,
                            start: 'top 85%',
                            toggleActions: 'play none none reverse',
                        },
                    });
                }

                /* ── 4. buttons: clipPath wipe reveal ── */
                if (btnsRef.current) {
                    gsap.set(btnsRef.current, {
                        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
                        opacity: 0,
                    });
                    gsap.to(btnsRef.current, {
                        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                        opacity: 1,
                        duration: 1,
                        ease: 'power3.inOut',
                        scrollTrigger: {
                            trigger: btnsRef.current,
                            start: 'top 90%',
                            toggleActions: 'play none none reverse',
                        },
                    });
                }

                /* ── 5. social icons: scale + rotate spin in ── */
                const icons = socialsRef.current?.querySelectorAll('a') || [];
                if (icons.length) {
                    gsap.set(icons, { scale: 0, rotation: -180, opacity: 0 });
                    gsap.to(icons, {
                        scale: 1,
                        rotation: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: 'back.out(1.7)',
                        scrollTrigger: {
                            trigger: socialsRef.current,
                            start: 'top 92%',
                            toggleActions: 'play none none reverse',
                        },
                    });
                }

                /* ── 6. copyright: fade up ── */
                if (copyrightRef.current) {
                    gsap.set(copyrightRef.current, { y: 15, opacity: 0 });
                    gsap.to(copyrightRef.current, {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: copyrightRef.current,
                            start: 'top 95%',
                            toggleActions: 'play none none reverse',
                        },
                    });
                }

                /* ── 7. glow: parallax drift ── */
                if (glowRef.current) {
                    gsap.set(glowRef.current, { opacity: 0, scale: 0.6 });
                    gsap.to(glowRef.current, {
                        opacity: 0.5,
                        scale: 1,
                        duration: 2,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top 60%',
                            toggleActions: 'play none none reverse',
                        },
                    });

                    gsap.to(glowRef.current, {
                        y: -40,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true,
                        },
                    });
                }

            }, sectionRef);

            return () => ctx.revert();
        };

        let cleanup;
        if (typeof document !== 'undefined' && document.fonts) {
            document.fonts.ready.then(() => { cleanup = init(); });
        } else {
            cleanup = init();
        }
        return () => { if (cleanup) cleanup(); };
    }, []);

    const subText = "LET'S WORK WITH";

    return (
        <section
            ref={sectionRef}
            className="section-container relative w-full bg-black flex flex-col justify-center items-center overflow-hidden"
            style={{ paddingTop: 'clamp(80px, 12vh, 160px)', paddingBottom: 'clamp(60px, 8vh, 100px)' }}
        >
            {/* Background glow */}
            <div
                ref={glowRef}
                className="pointer-events-none absolute"
                style={{
                    left: '50%',
                    top: '30%',
                    transform: 'translateX(-50%)',
                    width: '70%',
                    height: '60%',
                    background: 'radial-gradient(ellipse at center, rgba(208,0,0,0.06) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                }}
            />

            {/* Headline block */}
            <div className="w-full relative z-10">
                {/* Subhead — letter split */}
                <p
                    ref={subheadRef}
                    className="uppercase text-white leading-none mb-3 overflow-hidden"
                    style={{
                        fontFamily: 'Humane-',
                        fontWeight: 700,
                        fontSize: 'clamp(18px, 2.2vw, 32px)',
                        letterSpacing: '0.08em',
                    }}
                >
                    {subText.split('').map((ch, i) => (
                        <span key={i} className="inline-block sub-char">
                            {ch === ' ' ? '\u00A0' : ch}
                        </span>
                    ))}
                </p>

                {/* PIXELATED */}
                <div className="overflow-hidden" style={{ perspective: '1000px' }}>
                    <h2
                        ref={line1Ref}
                        className="uppercase leading-[0.85] tracking-[-0.02em]"
                        style={{
                            fontFamily: 'Humane',
                            fontWeight: 700,
                            fontSize: 'clamp(100px, 16vw, 240px)',
                            lineHeight: 0.85,
                        }}
                    >
                        {'PIXELATED'.split('').map((ch, i) => (
                            <span
                                key={i}
                                className="inline-block h-char"
                                style={{ color: '#D00000', transformOrigin: 'bottom center' }}
                            >
                                {ch}
                            </span>
                        ))}
                    </h2>
                </div>

                {/* MEDIA */}
                <div className="overflow-hidden" style={{ perspective: '1000px' }}>
                    <h2
                        ref={line2Ref}
                        className="uppercase leading-[0.85] tracking-[-0.02em]"
                        style={{
                            fontFamily: 'Humane',
                            fontWeight: 700,
                            fontSize: 'clamp(100px, 16vw, 240px)',
                            lineHeight: 0.85,
                        }}
                    >
                        {'MEDIA'.split('').map((ch, i) => (
                            <span
                                key={i}
                                className="inline-block h-char"
                                style={{ color: '#D00000', transformOrigin: 'bottom center' }}
                            >
                                {ch}
                            </span>
                        ))}
                    </h2>
                </div>

                {/* Divider line */}
                <div
                    ref={dividerRef}
                    className="mt-8"
                    style={{
                        height: '1px',
                        background: 'linear-gradient(90deg, rgba(208,0,0,0.6) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                        width: '100%',
                    }}
                />
            </div>

            {/* Buttons */}
            <div ref={btnsRef} className="flex items-center gap-4 mt-16 relative z-10" style={{ marginTop: '25px', }}>
                <a
                    href="mailto:hello@pixelatedmedia.com"
                    className="group relative flex items-center gap-3 uppercase overflow-hidden"
                    style={{
                        fontFamily: 'Thedus',
                        fontWeight: 700,
                        fontSize: 'clamp(12px, 1.1vw, 16px)',
                        letterSpacing: '0.2em',
                        color: 'white',
                        padding: '16px 36px',
                        textDecoration: 'none',
                        backgroundColor: '#D00000',
                    }}
                >
                    <div className="absolute inset-0 w-full h-full bg-[#111] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                    <span className="relative z-10">SAY HI</span>
                    <span className="relative z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" style={{ fontSize: '18px' }}>🤚</span>
                </a>

                <a
                    href="mailto:hello@pixelatedmedia.com?subject=Schedule%20a%20Call"
                    className="group relative flex items-center gap-3 uppercase overflow-hidden"
                    style={{
                        fontFamily: 'Thedus',
                        fontWeight: 700,
                        fontSize: 'clamp(12px, 1.1vw, 16px)',
                        letterSpacing: '0.2em',
                        color: 'white',
                        border: '1.5px solid rgba(255,255,255,0.25)',
                        padding: '16px 36px',
                        textDecoration: 'none',
                    }}
                >
                    <div className="absolute inset-0 w-full h-full bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                    <span className="relative z-10 group-hover:text-black transition-colors duration-500">SCHEDULE A CALL</span>
                </a>
            </div>

            {/* Social Icons */}
            <div ref={socialsRef} className="flex items-center gap-5 mt-10 relative z-10" style={{ marginTop: '25px', }}>
                <a
                    href="https://instagram.com/pixelatedmedia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center rounded-full text-white transition-colors duration-300 hover:text-[#D00000]"
                    style={{
                        width: '52px', height: '52px',

                    }}
                    aria-label="Instagram"

                >
                    <div className="absolute inset-0 rounded-full border border-white/20 transition-colors duration-300 group-hover:border-transparent" />
                    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 52 52">
                        <circle cx="26" cy="26" r="25" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="158" className="transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] [stroke-dashoffset:158] group-hover:[stroke-dashoffset:0]" />
                    </svg>
                    <svg className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                </a>

                <a
                    href="https://linkedin.com/company/pixelatedmedia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center rounded-full text-white transition-colors duration-300 hover:text-[#D00000]"
                    style={{ width: '52px', height: '52px' }}
                    aria-label="LinkedIn"
                >
                    <div className="absolute inset-0 rounded-full border border-white/20 transition-colors duration-300 group-hover:border-transparent" />
                    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 52 52">
                        <circle cx="26" cy="26" r="25" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="158" className="transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] [stroke-dashoffset:158] group-hover:[stroke-dashoffset:0]" />
                    </svg>
                    <svg className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="3" />
                        <path d="M7 10v7M7 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
                    </svg>
                </a>

                <a
                    href="https://youtube.com/@pixelatedmedia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center rounded-full text-white transition-colors duration-300 hover:text-[#D00000]"
                    style={{ width: '52px', height: '52px' }}
                    aria-label="YouTube"
                >
                    <div className="absolute inset-0 rounded-full border border-white/20 transition-colors duration-300 group-hover:border-transparent" />
                    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 52 52">
                        <circle cx="26" cy="26" r="25" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="158" className="transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] [stroke-dashoffset:158] group-hover:[stroke-dashoffset:0]" />
                    </svg>
                    <svg className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="5" width="20" height="14" rx="4" />
                        <polygon points="10,9 16,12 10,15" fill="currentColor" stroke="none" />
                    </svg>
                </a>
            </div>

            {/* Copyright */}
            <p
                ref={copyrightRef}
                className="uppercase mt-14 tracking-[0.25em] relative z-10"
                style={{
                    fontFamily: 'Thedus-cl',
                    fontWeight: 400,
                    fontSize: 'clamp(18px, 1.2vw, 16px)',
                    color: 'rgba(255,255,255,0.8)',
                    opacity: 0,
                    marginTop: '25px',
                }}
            >
                COPYRIGHT {new Date().getFullYear()} · ALL RIGHTS RESERVED
            </p>
        </section>
    );
}