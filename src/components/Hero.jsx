'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import PixelCard from './PixelCard';

export default function Hero() {
    const firstText = useRef(null);
    const secondText = useRef(null);
    const slider = useRef(null);
    const xPercent = useRef(0);
    const animationId = useRef(null);

    useEffect(() => {
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

        return () => {
            if (animationId.current) cancelAnimationFrame(animationId.current);
        };
    }, []);

    return (
        <section id="home" className="relative w-full h-screen bg-[#EFEFEF] overflow-hidden flex flex-col">

            {/* ── Background Marquee — large, darker gray, vertically centered ── */}
            <div className="absolute inset-0 pointer-events-none z-0 flex items-center overflow-hidden"
                style={{
                    height: '800px',
                    paddingTop: '100px',
                }}>
                <div ref={slider} className="relative whitespace-nowrap w-full">
                    <p
                        ref={firstText}
                        className="absolute left-0 top-1/2 -translate-y-1/2 will-change-transform select-none leading-[0.85] tracking-[-0.10em]"
                        style={{
                            fontFamily: 'Humane, sans-serif',
                            fontWeight: 700,
                            fontSize: 'clamp(250px, 40vw, 680px)',
                            color: '#D8D8D8',
                            paddingRight: '6vw',
                        }}
                    >
                        DESIGN
                    </p>
                    <p
                        ref={secondText}
                        className="absolute left-0 top-1/2 -translate-y-1/2 will-change-transform select-none leading-[0.85] tracking-[-0.02em]"
                        style={{
                            fontFamily: 'Humane, sans-serif',
                            fontWeight: 700,
                            fontSize: 'clamp(250px, 48vw, 680px)',
                            color: '#D8D8D8',
                            paddingRight: '6vw',
                        }}
                    >
                        DESIGN
                    </p>
                </div>
            </div>

            {/* ── Foreground ── */}
            {/* Added pt-24 to account for the removed header space if needed, or kept centered */}
            <div className="relative z-10 w-full h-full flex flex-col pr-6 md:pr-10 pl-5 md:pl-8 py-4 justify-center"
                style={{
                    paddingLeft: 'clamp(32px, 6vw, 100px)',
                    paddingRight: 'clamp(32px, 6vw, 100px)',
                    paddingTop: '90px',
                    paddingBottom: '60px',
                }}>

                {/* ── Main 3-col layout ── */}
                <div className="flex-1 grid grid-cols-12 gap-0 items-center">

                    {/* ── LEFT: Headline + Buttons — 4 cols, flush left ── */}
                    <div className="col-span-4 flex flex-col justify-center z-20">

                        <div className="flex flex-col leading-none">
                            {/* "TURN VISITORS INTO" */}
                            <h2
                                className="uppercase leading-[0.82] tracking-[0.01em]"
                                style={{
                                    fontFamily: 'Humane-rg',
                                    fontWeight: 100,
                                    fontSize: 'clamp(50px, 6.5vw, 150px)',
                                    color: '#111',
                                }}
                            >
                                TURN VISITORS INTO
                            </h2>

                            {/* "CUSTOMERS" — big bold red */}
                            <h1
                                className="uppercase leading-[0.8] tracking-[0.01em]"
                                style={{
                                    fontFamily: 'Humane-bold',
                                    fontWeight: 300,
                                    fontSize: 'clamp(80px, 12vw, 250px)',
                                    color: '#D00000',
                                }}
                            >
                                CUSTOMERS
                            </h1>

                            {/* "WITH DESIGN THAT ACTUALLY" — humane md */}
                            <p
                                className="uppercase my-[2px] leading-[0.85] tracking-[0.01em]"
                                style={{
                                    fontFamily: 'Humane-md',
                                    fontWeight: 200,
                                    fontSize: 'clamp(40px, 5.2vw, 130px)',
                                    color: '#111',
                                }}
                            >
                                WITH DESIGN THAT ACTUALLY
                            </p>

                            {/* "WORKS" — big bold black */}
                            <h2
                                className="uppercase leading-[0.8] tracking-[0.01em]"
                                style={{
                                    fontFamily: 'Humane-rg',
                                    fontWeight: 100,
                                    fontSize: 'clamp(90px, 13vw, 280px)',
                                    color: '#111',
                                }}
                            >
                                WORKS
                            </h2>
                        </div>

                        {/* CTA Buttons */}
                        <div className="mt-8 flex flex-col" style={{ maxWidth: '500px' }}>
                            <div className="flex items-stretch h-[55px] gap-3">

                                {/* UPGRADE YOUR BRAND */}
                                <button
                                    className="group relative flex items-stretch outline-none"
                                    style={{
                                        fontFamily: 'Thedus-c',
                                        fontWeight: 500,
                                        fontSize: 'clamp(16px, 0.85vw, 15px)',
                                        letterSpacing: '0.2em',
                                        flex: 1,
                                        border: 'none',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        padding: 0,
                                        background: 'none'
                                    }}
                                >
                                    <PixelCard
                                        colors="#e5e5e5,#f5f5f5,#ffffff"
                                        gap="4"
                                        speed="40"
                                        noFocus={true}
                                        className="w-full h-full overflow-hidden flex items-center justify-center bg-[#D00000]"
                                    >
                                        <span className="relative z-10 text-white group-hover:text-black transition-colors duration-500 whitespace-nowrap">UPGRADE YOUR BRAND</span>
                                    </PixelCard>
                                </button>

                                {/* VIEW OUR WORK */}
                                <button
                                    className="group relative flex items-stretch outline-none"
                                    style={{
                                        fontFamily: 'Thedus-c',
                                        fontWeight: 500,
                                        fontSize: 'clamp(18px, 0.85vw, 15px)',
                                        letterSpacing: '0.2em',
                                        flex: 1,
                                        border: '1.5px solid #d4d4d4',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        padding: 0,
                                        background: 'none'
                                    }}
                                >
                                    <PixelCard
                                        colors="#ff0000,#D00000,#990000"
                                        gap="4"
                                        speed="40"
                                        noFocus={true}
                                        className="w-full h-full overflow-hidden flex items-center justify-center bg-white"
                                    >
                                        <span className="relative z-10 text-[#D00000] group-hover:text-black transition-colors duration-500 whitespace-nowrap">VIEW OUR WORK</span>
                                    </PixelCard>
                                </button>

                            </div>

                            {/* Tagline below buttons */}
                            <p
                                className="mt-4 uppercase"
                                style={{
                                    fontFamily: 'Thedus-c',
                                    fontWeight: 500,
                                    fontSize: 'clamp(10px, 0.8vw, 13px)',
                                    letterSpacing: '0.2em',
                                    color: '#555',
                                }}
                            >
                                FREE STRATEGY CALL · NO COMMITMENT
                            </p>
                        </div>
                    </div>

                    {/* ── CENTER: Single Card Image ── */}
                    <div className="col-span-12 md:col-span-5 relative h-full flex items-center justify-center z-10 pointer-events-none translate-x-10">
                        <div className="relative" style={{ width: '820px', height: '420px', marginLeft: '40px' }}>
                            <Image src="/hero/card.png" alt="Card" fill className="object-cover" priority />
                        </div>
                    </div>

                    {/* ── RIGHT: Description top + Powered By bottom ── */}
                    <div className="col-span-3 flex flex-col justify-between h-full py-3 items-end text-right">

                        {/* Top: description */}
                        <div>
                            <p
                                className="uppercase text-right leading-[0.8] tracking-[0.04em] space-y-0"
                                style={{
                                    fontFamily: 'Thedus-cl',
                                    fontWeight: 400,
                                    fontSize: 'clamp(2rem, 1vw, 1.1rem)',
                                    color: '#1a1a1a',
                                    marginRight: '0px',
                                    marginTop: '70px',

                                }}
                            >
                                WEBSITES, MOTION<br />
                                AND VISUALS<br />
                                ENGINEERED TO MAKE<br />
                                YOUR BRAND<br />
                                IMPOSSIBLE TO<br />
                                IGNORE
                            </p>
                        </div>


                        {/* Bottom: Powered By */}
                        <div className="flex flex-col items-end">
                            <p
                                className="uppercase tracking-[0.25em]"
                                style={{
                                    fontFamily: 'Thedus-cl',
                                    fontWeight: 700,
                                    fontSize: 'clamp(20px, 1vw, 25px)',
                                    color: '#444',
                                    marginBottom: '0px',
                                    marginRight: '0px',
                                }}
                            >
                                POWERED BY
                            </p>
                            <h3
                                className="uppercase leading-[0.85] tracking-[-0.01em]"
                                style={{
                                    fontFamily: 'Humane-l',
                                    fontWeight: 300,
                                    /* Humane Light — "FREELANCERS" bleeds to right edge */
                                    fontSize: 'clamp(20px, 45vw, 175px)',
                                    color: '#D00000',
                                    marginRight: '0px',
                                }}
                            >
                                FREELANCERS
                            </h3>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}