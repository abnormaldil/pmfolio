'use client';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function WhyUs() {
    const sectionRef = useRef(null);
    const headline1Ref = useRef(null);
    const headline2Ref = useRef(null);
    const descriptionRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {

            /* ── Headline 1: smooth scrub reveal ── */
            const line1Chars = headline1Ref.current?.querySelectorAll('.h-char') || [];
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
                    stagger: 0.04,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                        end: 'top 35%',
                        scrub: 1.5,
                    },
                });
            }

            /* ── Headline 2: smooth scrub reveal ── */
            const line2Chars = headline2Ref.current?.querySelectorAll('.h-char') || [];
            if (line2Chars.length) {
                gsap.set(line2Chars, {
                    y: '120%',
                    rotateX: -45,
                    scale: 0.9,
                    opacity: 0,
                    filter: 'blur(4px)',
                });

                gsap.to(line2Chars, {
                    y: '0%',
                    rotateX: 0,
                    scale: 1,
                    opacity: 1,
                    filter: 'blur(0px)',
                    stagger: 0.1,
                    ease: 'power2.out',

                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 65%',
                        end: 'top 20%',
                        scrub: 1.5,

                    },
                });
            }

            /* ── Description: clipPath wipe reveal ── */
            if (descriptionRef.current) {
                gsap.set(descriptionRef.current, {
                    clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
                    opacity: 0,
                });
                gsap.to(descriptionRef.current, {
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.inOut',
                    scrollTrigger: {
                        trigger: descriptionRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                        markers: false,
                    },
                });
            }

            /* ── Bottom Section fade up ── */
            if (bottomRef.current) {
                gsap.set(bottomRef.current, { y: 30, opacity: 0 });
                gsap.to(bottomRef.current, {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',

                    scrollTrigger: {
                        trigger: bottomRef.current,
                        start: 'top 50%',

                        toggleActions: 'play none none reverse',
                        markers: false,
                    },
                });
            }

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="about"
            ref={sectionRef}
            className="snap-y snap-mandatory overflow-y-scroll h-screen relative w-full min-h-screen bg-black overflow-hidden flex flex-col"
            style={{
                paddingLeft: 'clamp(24px, 3vw, 48px)',
                paddingRight: 'clamp(24px, 3vw, 48px)',
                paddingTop: 'calc(90px + clamp(30px, 8vh, 80px))',
                paddingBottom: 'clamp(36px, 5vh, 60px)',
            }}
        >
            {/* ── MASSIVE HEADLINE ── */}
            <div className="flex flex-col leading-[0.82] select-none w-full flex-1">

                {/* Line 1: WHY BRANDS CHOOSE */}
                <div className="overflow-hidden" style={{ perspective: '1000px' }}>
                    <h2
                        ref={headline1Ref}
                        className="uppercase text-white tracking-[-0.01em] whitespace-nowrap"
                        style={{
                            fontFamily: 'Humane-l',
                            fontSize: 'clamp(70px, 18.2vw, 340px)',
                            transformOrigin: 'bottom center',
                            lineHeight: 0.82,
                        }}
                    >
                        {'WHY BRANDS CHOOSE'.split('').map((ch, i) => (
                            <span
                                key={i}
                                className="inline-block h-char"
                                style={{ transformOrigin: 'bottom center' }}
                            >
                                {ch === ' ' ? '\u00A0' : ch}
                            </span>
                        ))}
                    </h2>
                </div>

                {/* Line 2: PIXELATED ? — with description inlined at bottom-right */}
                <div className="flex items-end justify-between w-full mt-[-0.5vw]">
                    <div className="overflow-hidden" style={{ perspective: '1000px' }}>
                        <h2
                            ref={headline2Ref}
                            className="uppercase text-white tracking-[-0.01em] whitespace-nowrap"
                            style={{
                                fontFamily: 'Humane-l',
                                fontSize: 'clamp(70px, 18.2vw, 340px)',
                                transformOrigin: 'bottom center',
                                lineHeight: 0.82,
                            }}
                        >
                            {'PIXELATED ?'.split('').map((ch, i) => (
                                <span
                                    key={i}
                                    className="inline-block h-char"
                                    style={{ transformOrigin: 'bottom center' }}
                                >
                                    {ch === ' ' ? '\u00A0' : ch}
                                </span>
                            ))}
                        </h2>
                    </div>

                    {/* Description — bottom-right, base-aligned with bottom of PIXELATED */}
                    <p
                        ref={descriptionRef}
                        className="uppercase text-white text-right leading-[1.55] tracking-[0.06em] self-end"
                        style={{
                            fontFamily: 'Thedus-wl',
                            fontWeight: 300,
                            fontSize: 'clamp(20px, 1.2vw, 18px)',
                            maxWidth: 'clamp(280px, 32vw, 440px)',
                            paddingBottom: '6px',
                        }}
                    >
                        WE DON&apos;T JUST DELIVER FILES.<br />
                        WE BUILD DIGITAL ASSETS THAT<br />
                        DRIVE ATTENTION, ENGAGEMENT, AND<br />
                        CONVERSIONS.<br />
                        EVERY PIXEL HAS A PURPOSE<br />
                        STRATEGY, DESIGN, AND<br />
                        PERFORMANCE WORKING TOGETHER.
                    </p>
                </div>
            </div>

            {/* ── BOTTOM: Avatars + Trust ── */}
            <div
                ref={bottomRef}
                className="flex items-center gap-5 mt-6"
            >
                {/* Avatar Stack */}
                <div className="flex -space-x-3">
                    {['dilu', 'nakul', 'kiran', 'kk'].map((person, i) => (
                        <div
                            key={person}
                            className="w-11 h-11 md:w-14 md:h-14 rounded-full border-[2.5px] border-white overflow-hidden relative bg-zinc-800"
                            style={{ zIndex: 10 - i }}
                        >
                            <Image
                                src={`/hero/${person}.png`}
                                alt={person}
                                fill
                                className="object-cover object-top"
                            />
                        </div>
                    ))}
                </div>

                {/* Trust Text + Stars */}
                <div className="flex flex-col justify-center">
                    <p
                        className="uppercase text-white/70 tracking-[0.2em]"
                        style={{
                            fontFamily: 'Thedus-cl',
                            fontWeight: 700,
                            fontSize: 'clamp(9px, 0.8vw, 13px)',
                        }}
                    >
                        TRUSTED BY 100+ USERS
                    </p>
                    <div className="flex gap-[3px] mt-1">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-[#EACE69] text-sm md:text-base">★</span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
