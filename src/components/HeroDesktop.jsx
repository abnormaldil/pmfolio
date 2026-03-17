'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import CardDeck from './CardDeck';

export default function HeroDesktop() {
    const firstText = useRef(null);
    const secondText = useRef(null);
    const slider = useRef(null);
    const xPercent = useRef(0);
    const animationId = useRef(null);

    // Refs for entrance orchestration
    const leftColumnRef = useRef(null);
    const rightColumnRef = useRef(null);
    const btnContainerRef = useRef(null);
    const marqueeRef = useRef(null);
    const deckContainerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Initial states: hidden for cinematic entrance
            gsap.set(leftColumnRef.current, { x: -60, opacity: 0 });
            gsap.set(rightColumnRef.current, { x: 60, opacity: 0 });
            gsap.set(btnContainerRef.current, { y: 40, opacity: 0 });
            gsap.set(marqueeRef.current, { opacity: 0 });
            gsap.set(deckContainerRef.current, { opacity: 0, scale: 0.9 });

            const startHeroAnimation = () => {
                const tl = gsap.timeline({ delay: 0.8 }); // Start shortly after preloader & Navbar begins

                tl.to(leftColumnRef.current, {
                    x: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power2.out"
                })
                .to(rightColumnRef.current, {
                    x: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power2.out"
                }, "-=1.0")
                .to(marqueeRef.current, {
                    opacity: 1,
                    duration: 1.5,
                    ease: "power2.inOut"
                }, "-=0.8")
                .to(btnContainerRef.current, {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out"
                }, "-=1.0")
                .to(deckContainerRef.current, {
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: "power2.out"
                }, "-=0.8");

                // Background Marquee Loop
                const animate = () => {
                    if (xPercent.current <= -100) {
                        xPercent.current = 0;
                    }
                    gsap.set(firstText.current, { xPercent: xPercent.current });
                    gsap.set(secondText.current, { xPercent: xPercent.current + 100 });
                    xPercent.current -= 0.05;
                    animationId.current = requestAnimationFrame(animate);
                };
                animationId.current = requestAnimationFrame(animate);
            };

            if (window.preloaderFinished) {
                startHeroAnimation();
            } else {
                window.addEventListener('finishLoading', startHeroAnimation);
            }
        });

        return () => {
            if (animationId.current) cancelAnimationFrame(animationId.current);
            ctx.revert();
            window.removeEventListener('finishLoading', () => {});
        };
    }, []);

    return (
        <section id="home-desktop" className="relative w-full h-screen bg-[#EFEFEF] overflow-hidden flex flex-col">

            {/* ── Background Marquee ── */}
            <div 
                ref={marqueeRef}
                className="absolute inset-0 pointer-events-none z-0 flex items-center overflow-hidden"
                style={{
                    height: '100%',
                    top: '60%',
                    transform: 'translateY(-50%)',
                }}>
                <div ref={slider} className="relative whitespace-nowrap w-full h-full flex items-center">
                    <p
                        ref={firstText}
                        className="absolute left-0 top-1/2 -translate-y-1/2 will-change-transform select-none leading-[0.8] tracking-[-0.02em]"
                        style={{
                            fontFamily: 'Humane-l',
                            fontWeight: 500,
                            letterSpacing: '0.01em',
                            fontSize: 'clamp(400px, 120vh, 1600px)',
                            color: 'rgba(216, 216, 216, 0.27)',
                            paddingRight: '6vw',
                        }}
                    >
                        DESIGN DEVELOP DEPLOY
                    </p>
                    <p
                        ref={secondText}
                        className="absolute left-0 top-1/2 -translate-y-1/2 will-change-transform select-none leading-[0.8] tracking-[-0.02em]"
                        style={{
                            fontFamily: 'Humane-l',
                            fontWeight: 500,
                            letterSpacing: '0.01em',
                            fontSize: 'clamp(400px, 120vh, 1600px)',
                            color: 'rgba(216, 216, 216, 0.27)',
                            paddingRight: '6vw',
                        }}
                    >
                        DESIGN DEVELOP DEPLOY
                    </p>
                </div>
            </div>

            {/* ── Foreground ── */}
            <div className="relative z-10 w-full h-full flex flex-col py-4 justify-center"
                style={{
                    paddingLeft: 'clamp(32px, 6vw, 100px)',
                    paddingRight: 'clamp(32px, 6vw, 100px)',
                    paddingTop: '130px',
                    paddingBottom: '130px',
                }}>

                {/* ── Main 3-col layout ── */}
                <div className="flex-1 grid grid-cols-12 gap-4 items-center h-full">

                    {/* ── LEFT: Headline + Buttons — 4 cols ── */}
                    <div 
                        ref={leftColumnRef}
                        className="col-span-4 min-w-[420px] flex flex-col justify-center z-20 h-full max-w-[600px]">

                        <div className="flex flex-col leading-none">
                            <h2
                                className="uppercase leading-[0.82] tracking-[0.01em]"
                                style={{
                                    fontFamily: 'Humane-l',
                                    fontWeight: 300,
                                    fontSize: 'clamp(50px, 6.5vw, 150px)',
                                    color: '#111',
                                }}
                            >
                                TURN VISITORS INTO
                            </h2>

                            <h1
                                className="uppercase leading-[0.8] tracking-[0.01em]"
                                style={{
                                    fontFamily: 'Humane-L',
                                    fontWeight: 300,
                                    fontSize: 'clamp(90px, 13vw, 280px)',
                                    color: '#e03047',
                                }}
                            >
                                CUSTOMERS
                            </h1>

                            <p
                                className="uppercase my-[2px] leading-[0.85] tracking-[0.01em]"
                                style={{
                                    fontFamily: 'Humane-l',
                                    fontWeight: 300,
                                    fontSize: 'clamp(50px, 6.5vw, 150px)',
                                    color: '#111',
                                }}
                            >
                                WITH WEBSITES THAT
                            </p>

                            <h2
                                className="uppercase leading-[0.8] tracking-[0.01em]"
                                style={{
                                    fontFamily: 'Humane-L',
                                    fontWeight: 300,
                                    fontSize: 'clamp(90px, 13vw, 280px)',
                                    color: '#111',
                                }}
                            >
                                WORKS
                            </h2>
                        </div>

                        {/* CTA Buttons */}
                        <div ref={btnContainerRef} className="mt-10 flex flex-col items-start w-full">
                            <div className="flex items-stretch h-[60px] gap-2 w-full">

                                {/* UPGRADE YOUR BRAND */}
                                <Link
                                    href="/contact"
                                    className="group relative flex items-stretch outline-none cursor-target"
                                    style={{
                                        fontFamily: 'Thedus-wl',
                                        fontWeight: 500,
                                        fontSize: 'clamp(14px, 1.2vw, 26px)',
                                        letterSpacing: '0.05em',
                                        flex: 1.15,
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-[#e03047]">
                                        {/* sliding door (up from bottom) */}
                                        <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] bg-white" />
                                        <span className="relative z-10 text-white group-hover:text-[#e03047] transition-colors duration-500 whitespace-nowrap px-4 lg:px-6">
                                            UPGRADE YOUR BRAND
                                        </span>
                                    </div>
                                </Link>

                                {/* VIEW OUR WORK */}
                                <Link
                                    href="/portfolio"
                                    className="group relative flex items-stretch outline-none cursor-target"
                                    style={{
                                        fontFamily: 'Thedus-wl',
                                        fontWeight: 500,
                                        fontSize: 'clamp(14px, 1.2vw, 26px)',
                                        letterSpacing: '0.05em',
                                        flex: 1,
                                        border: '1px solid #d4d4d4',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-white">
                                        {/* sliding door (down from top) */}
                                        <div className="absolute inset-0 -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] bg-[#e03047]" />
                                        <span className="relative z-10 text-[#e03047] group-hover:text-white transition-colors duration-500 whitespace-nowrap px-4 lg:px-6">
                                            VIEW OUR WORK
                                        </span>
                                    </div>
                                </Link>

                            </div>

                            {/* Tagline below buttons */}
                            <p
                                className="mt-3 uppercase text-left pl-1"
                                style={{

                                    fontFamily: 'Thedus-wl',
                                    fontWeight: 300,
                                    fontSize: 'clamp(14.5px, 0.3vw, 18px)',
                                    letterSpacing: '0.06em',
                                    color: '#111',
                                }}
                            >
                                FREE STRATEGY CALL · NO COMMITMENT
                            </p>
                        </div>
                    </div>

                    {/* ── CENTER: Card Deck ── */}
                    <div ref={deckContainerRef} className="col-span-5 relative h-full flex items-center justify-center z-10">
                        <div className="flex items-center justify-center w-full h-full">
                            <CardDeck isMobile={false} delay={2.5} />
                        </div>
                    </div>

                    {/* ── RIGHT: Description top + Powered By bottom ── */}
                    <div 
                        ref={rightColumnRef}
                        className="col-span-3 min-w-[260px] flex flex-col justify-between h-full py-8 items-end text-right">

                      /

                        {/* Bottom: Powered By */}
                        <div className="flex flex-col items-end mb-10">
                            <p
                                className="uppercase tracking-[0.25em]"
                                style={{
                                    fontFamily: 'Thedus-wl',
                                    fontWeight: 700,
                                    fontSize: 'clamp(16px, 1.2vw, 25px)',
                                    color: '#e03047',
                                    marginBottom: '4px',
                                }}
                            >
                                TRUSTED BY
                            </p>
                            <h3
                                className="uppercase leading-[0.85] tracking-[-0.01em]"
                                style={{
                                    fontFamily: 'Humane-l',
                                    fontWeight: 300,
                                    fontSize: 'clamp(80px, 12vw, 175px)',
                                    color: '#000000ff',
                                }}
                            >
                                BRANDS WORLDWIDE
            
                            </h3>
                        </div>
                        <div className="flex flex-col items-end mb-10">
                            <p
                                className="uppercase tracking-[0.25em]"
                                style={{
                                    fontFamily: 'Thedus-wl',
                                    fontWeight: 700,
                                    fontSize: 'clamp(16px, 1.2vw, 25px)',
                                    color: '#e03047',
                                    marginBottom: '4px',
                                }}
                            >
                                DELIVERED
                            </p>
                            <h3
                                className="uppercase leading-[0.85] tracking-[-0.01em]"
                                style={{
                                    fontFamily: 'Humane-l',
                                    fontWeight: 300,
                                    fontSize: 'clamp(80px, 12vw, 175px)',
                                    color: '#000000ff',
                                }}
                            >
                                100+ PROJECTS
            
                            </h3>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
