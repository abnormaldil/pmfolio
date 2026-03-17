'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
    const sectionRef = useRef(null);
    const subheadRef = useRef(null);
    const line1Ref = useRef(null);
    const line2Ref = useRef(null);
    const dividerRef = useRef(null);
    const socialsRef = useRef(null);
    const copyrightRef = useRef(null);
    const glowRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ paused: true });

        /* ── 1. subhead: letter-by-letter slide up ── */
        const subChars = subheadRef.current?.querySelectorAll('.sub-char') || [];
        if (subChars.length) {
            gsap.set(subChars, { y: 30, opacity: 0 });
            tl.to(subChars, {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.03,
                ease: 'power3.out',
            }, 0);
        }

        /* ── 2. headline: smooth letter-by-letter masked reveal ── */
        const line1Chars = line1Ref.current?.querySelectorAll('.h-char') || [];
        if (line1Chars.length) {
            gsap.set(line1Chars, {
                y: '120%',
                rotateX: -45,
                scale: 0.8,
                opacity: 0,
                filter: 'blur(4px)',
            });

            tl.to(line1Chars, {
                y: '0%',
                rotateX: 0,
                scale: 1,
                opacity: 1,
                filter: 'blur(0px)',
                stagger: 0.05,
                duration: 1,
                ease: 'power2.out',
            }, 0.2); // Start slightly after subhead
        }

        /* ── 3. social icons: scale + rotate spin in ── */
        const icons = socialsRef.current?.querySelectorAll('a') || [];
        if (icons.length) {
            gsap.set(icons, { scale: 0, rotation: -180, opacity: 0 });
            tl.to(icons, {
                scale: 1,
                rotation: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: 'back.out(1.7)',
            }, 0.5); // Stagger in after headline
        }

        /* ── 4. copyright: fade up ── */
        if (copyrightRef.current) {
            gsap.set(copyrightRef.current, { y: 15, opacity: 0 });
            tl.to(copyrightRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
            }, 0.7);
        }

        /* ── 5. glow: parallax drift ── */
        if (glowRef.current) {
            gsap.set(glowRef.current, { opacity: 0, scale: 0.6, y: 0 });
            tl.to(glowRef.current, {
                opacity: 0.5,
                scale: 1,
                y: -40,
                duration: 2,
                ease: 'power2.out',
            }, 0);
        }

        /* ── Trigger logic: Fire strictly when the section enters the viewport ── */
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top 80%', // Triggers when the top of the footer hits 80% down the screen
            onEnter: () => tl.play(),
            onLeaveBack: () => tl.reverse(), // Optional: run backwards if they scroll up
        });

        if (typeof document !== 'undefined' && document.fonts) {
            document.fonts.ready.then(() => {
                ScrollTrigger.refresh();
            });
        }
    }, { scope: sectionRef });

    const subText = "LET'S WORK WITH";

    return (
        <section
            ref={sectionRef}
            className="section-container min-h-[85vh] md:min-h-screen relative w-full bg-black flex flex-col justify-center items-center overflow-hidden"
            style={{ paddingTop: 'clamp(100px, 15vh, 200px)', paddingBottom: 'clamp(80px, 12vh, 140px)' }}
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
                    background: 'radial-gradient(ellipse at center, rgba(224,48,71,0.06) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                }}
            />

            {/* Headline block */}
            <div className="w-full relative z-10">
                {/* Subhead — letter split */}
                <p
                    ref={subheadRef}
                    className="uppercase text-white leading-none mb-3 overflow-hidden text-center"
                    style={{
                        fontFamily: 'Thedus-wl',
                        fontWeight: 400,
                        fontSize: 'clamp(28px, 1.5vw, 42px)',
                        letterSpacing: '0.15em',
                    }}
                >
                    {subText.split('').map((ch, i) => (
                        <span key={i} className="inline-block sub-char">
                            {ch === ' ' ? '\u00A0' : ch}
                        </span>
                    ))}
                </p>

                {/* PIXELATED MEDIA */}
                <div className="overflow-hidden flex justify-center w-full" style={{ perspective: '1000px' }}>
                    <h2
                        ref={line1Ref}
                        className="uppercase leading-[0.8] tracking-[0.01em] whitespace-nowrap"
                        style={{
                            fontFamily: 'Humane-rg',
                            fontWeight: 400,
                            fontSize: 'clamp(100px, 24vw, 380px)',
                            lineHeight: 1.2,
                        }}
                    >
                        {'PIXELATED MEDIA'.split('').map((ch, i) => (
                            <span
                                key={i}
                                className="inline-block h-char"
                                style={{
                                    color: '#e03047',
                                    transformOrigin: 'bottom center',
                                    paddingRight: ch === ' ' ? 'clamp(15px, 2vw, 30px)' : '0'
                                }}
                            >
                                {ch === ' ' ? '\u00A0' : ch}
                            </span>
                        ))}
                    </h2>
                </div>

                {/* Divider line
                    <div
                        ref={dividerRef}
                        className="mt-8"
                        style={{
                            height: '1px',
                            background: 'linear-gradient(90deg, rgba(224,48,71,0.6) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                            width: '100%',
                        }}
                    /> */}

                {/* Contact Us Button */}
                <div className="w-full flex justify-center mt-12 md:mt-20 relative z-10">
                    <Link
                        href="/contact"
                        className="group relative inline-flex items-center justify-center border border-white/20 bg-transparent text-white overflow-hidden transition-all duration-300 hover:border-[#e03047] hover:shadow-[0_0_20px_rgba(224,48,71,0.3)]"
                        style={{ padding: '13px 36px' }}
                    >
                        <div className="absolute inset-0 w-full h-full bg-[#e03047] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                        <span
                            className="relative z-10 uppercase tracking-widest whitespace-nowrap transition-colors duration-300 group-hover:text-white"
                            style={{
                                fontFamily: 'Thedus-wl',
                                fontSize: 'clamp(18px, 2vw, 24px)',
                                letterSpacing: '0.15em'
                            }}
                        >
                            Say Hi
                        </span>
                    </Link>
                </div>
            </div>



            {/* Social Icons */}
            <div ref={socialsRef} className="flex items-center gap-5 mt-10 relative z-10" style={{ marginTop: '25px', }}>
                <a
                    href="https://instagram.com/pixelatedmedia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center rounded-full text-white transition-colors duration-300 hover:text-[#e03047]"
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
                    // href="https://linkedin.com/company/pixelatedmedia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center rounded-full text-white transition-colors duration-300 hover:text-[#e03047]"
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
                    // href="https://youtube.com/@pixelatedmedia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center rounded-full text-white transition-colors duration-300 hover:text-[#e03047]"
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
                    fontFamily: 'Thedus-wl',
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
