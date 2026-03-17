'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import CardDeck from './CardDeck';

export default function HeroMobile() {
    const headlineRef = useRef(null);
    const deckRef = useRef(null);
    const buttonsRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Initial states: hidden
            gsap.set(headlineRef.current, { y: -30, opacity: 0 });
            gsap.set(deckRef.current, { opacity: 0, scale: 0.8 });
            gsap.set(buttonsRef.current, { y: 40, opacity: 0 });

            const startHeroAnimation = () => {
                const tl = gsap.timeline({ delay: 0.6 });

tl.to(headlineRef.current, {
    y: 0,
    opacity: 1,
    duration: 1.2,
    ease: "power2.out"
})
.to(deckRef.current, {
    opacity: 1,
    scale: 1,
    duration: 1,
    ease: "power2.out"
}, "-=0.8")
.to(deckRef.current, {
    y: -8,
    rotation: 1.5,
    duration: 2.5,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
}, "+=0.2")
.to(buttonsRef.current, {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power2.out"
}, "-=2");
            };

            if (window.preloaderFinished) {
                startHeroAnimation();
            } else {
                window.addEventListener('finishLoading', startHeroAnimation);
            }
        });

        return () => {
            ctx.revert();
            window.removeEventListener('finishLoading', () => { });
        };
    }, []);

    return (
<section
  id="home-mobile"
  className="relative w-full min-h-screen bg-[#EFEFEF] overflow-hidden flex flex-col pb-[40px] px-[24px]"
  style={{ paddingTop: "clamp(40px, 14vh, 80px)" }}
>            {/* ── Content Container ── */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center flex-1 gap-[28px]">

                {/* ── Headline text stacked ── */}
                <div ref={headlineRef} className="flex flex-col text-center w-full mt-4">
                    <h2
                        className="uppercase leading-[0.9] tracking-[0.01em] text-[64px]"
                        style={{
                            fontFamily: 'Humane-rg',
                            fontWeight: 300,
                            color: '#111',
                        }}
                    >
                        TURN VISITORS INTO
                    </h2>

                    <h1
                        className="uppercase leading-[0.8] tracking-[0.01em] text-[88px]"
                        style={{
                            fontFamily: 'Humane-rg',
                            fontWeight: 300,
                            color: '#e03047',
                        }}
                    >
                        CUSTOMERS
                    </h1>

                    <p
                        className="uppercase my-1 leading-[0.9] tracking-[0.01em] text-[64px]"
                        style={{
                            fontFamily: 'Humane-rg',
                            fontWeight: 300,
                            color: '#111',
                        }}
                    >
                        WITH DESIGN THAT
                    </p>

                    <h2
                        className="uppercase leading-[0.8] tracking-[0.01em] text-[82px]"
                        style={{
                            fontFamily: 'Humane-rg',
                            fontWeight: 300,
                            color: '#111',
                        }}
                    >
                        ACTUALLY WORKS
                    </h2>
                </div>

                {/* ── Card Deck Centered ── */}
                <div ref={deckRef} className="flex justify-center items-center w-full max-w-[260px] mx-auto">                    <CardDeck isMobile={true} delay={1.2} />
                </div>

                {/* ── Buttons Full Width Stacked ── */}
                <div ref={buttonsRef} className="flex flex-col gap-[12px] w-full max-w-[380px]">                    <Link
                    href="/contact"
                    className="group relative flex items-stretch outline-none w-full h-[60px] cursor-target"
                    style={{
                        fontFamily: 'Thedus-wl',
                        fontWeight: 500,
                        fontSize: '20px',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                    }}
                >
                    <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-[#e03047]">
                        {/* sliding door (up from bottom) */}
                        <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] bg-white" />
                        <span className="relative z-10 text-white group-hover:text-[#e03047] transition-colors duration-500 whitespace-nowrap px-4 text-center">
                            UPGRADE YOUR BRAND
                        </span>
                    </div>
                </Link>

                    <Link
                        href="/portfolio"
                        className="group relative flex items-stretch outline-none w-full h-[60px] cursor-target"
                        style={{
                            fontFamily: 'Thedus-wl',
                            fontWeight: 500,
                            fontSize: '20px',
                            letterSpacing: '0.05em',
                            border: '1px solid #d4d4d4',
                            textTransform: 'uppercase',
                        }}
                    >
                        <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-white">
                            {/* sliding door (down from top) */}
                            <div className="absolute inset-0 -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] bg-[#e03047]" />
                            <span className="relative z-10 text-[#e03047] group-hover:text-white transition-colors duration-500 whitespace-nowrap px-4 text-center">
                                VIEW OUR WORK
                            </span>
                        </div>
                    </Link>

                    {/* Tagline below buttons */}
                    <p
                        className="mt-3 uppercase text-center w-full"
                        style={{
                            fontFamily: 'Thedus-wl',
                            fontWeight: 100,
                            fontSize: '14px',
                            letterSpacing: '0.06em',
                            color: '#111',
                        }}
                    >
                        FREE STRATEGY CALL · NO COMMITMENT
                    </p>
                </div>
            </div>
        </section>
    );
}
