'use client';
import ScrollVelocity from './ScrollVelocity';

export default function WhatWeCraft() {
    const categories = ['WEBSITES', 'VIDEOS', 'GRAPHICS', 'UI/UX', 'MOTION GFX'];

    const CategoryItems = () => (
        <div className="flex items-center">
            {categories.map((cat) => (
                <button
                    key={cat}
                    className="group relative border border-white/20 px-8 py-4 md:px-14 md:py-6 text-white transition-all duration-300 hover:border-[#e03047] cursor-pointer overflow-hidden min-w-[180px] md:min-w-[240px] flex items-center justify-center text-center mr-4 md:mr-8"
                    style={{
                        fontFamily: 'Thedus-wl',
                        fontWeight: 400,
                        fontSize: 'clamp(14px, 1.2vw, 20px)',
                        letterSpacing: '0.2em',
                    }}
                >
                    <div className="absolute inset-0 bg-[#e03047] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                    <span className="relative z-10 uppercase transition-colors duration-300">
                        {cat}
                    </span>
                </button>
            ))}
        </div>
    );

    return (
        <section
            id="services"
            className="relative z-10 w-full bg-black flex flex-col items-center justify-center overflow-hidden py-16 md:py-24 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
        >
            <h2
                className="uppercase text-white text-center leading-[0.85] mb-8 md:mb-12 px-6 max-w-6xl"
                style={{
                    fontFamily: 'Humane-rg',
                    fontSize: 'clamp(70px, 12vw, 160px)',
                    letterSpacing: '0.01em'
                }}
            >
                WHAT WE CRAFT FOR BRANDS
            </h2>

            <h2
                className="uppercase text-white text-center leading-[0.85] mb-8 md:mb-12 px-6 max-w-6xl"
                style={{
                    fontFamily: 'Humane-rg',
                    fontSize: 'clamp(70px, 12vw, 160px)',
                    letterSpacing: '0.01em'
                }}
            >
                THAT WANT TO STAND OUT
            </h2>

            <div className="w-full relative z-20 overflow-hidden flex flex-col items-center">
                <ScrollVelocity velocity={30} numCopies={5} className="flex">
                    <CategoryItems />
                </ScrollVelocity>
                <ScrollVelocity velocity={-30} numCopies={5} className="flex" style={{ marginTop: '20px' }}>
                    <CategoryItems />
                </ScrollVelocity>
            </div>
        </section>
    );
}
