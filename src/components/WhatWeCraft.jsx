'use client';
import Image from 'next/image';
import { useState } from 'react';
import clsx from 'clsx';

export default function WhatWeCraft() {
    const [selectedCategory, setSelectedCategory] = useState('WEBSITES');

    const categories = ['WEBSITES', 'VIDEOS', 'GRAPHICS', 'UI/UX', 'MOTION GFX'];

    const categoryMap = {
        'WEBSITES': ['nakul', 'kiran'],
        'VIDEOS': ['kk'],
        'GRAPHICS': ['nakul', 'dilu'],
        'UI/UX': ['dilu'],
        'MOTION GFX': ['kk'],
    };

    return (
        <section id="services" className="relative w-full bg-black flex flex-col items-center overflow-hidden
            pb-12 md:pb-20 lg:pb-24"
            style={{ paddingTop: 'calc(90px + clamp(30px, 5vh, 70px))' }}
        >

            {/* ── HEADLINE ── */}
            <h2
                className="uppercase text-white text-center leading-[0.85] tracking-[-0.02em] mb-12 px-4"
                style={{
                    fontFamily: 'Humane-rg',
                    fontSize: 'clamp(60px, 8vw, 150px)',
                }}
            >
                WHAT WE CRAFT FOR BRANDS THAT WANT TO STAND OUT
            </h2>

            {/* ── CATEGORY BUTTONS — z-index ensures clickable above images ── */}
            <div
                className="flex flex-wrap justify-center gap-3 px-4 w-full max-w-[1440px]"
                style={{ position: 'relative', zIndex: 20, marginBottom: '0' }}
            >
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        onMouseEnter={() => setSelectedCategory(cat)}
                        className={clsx(
                            "border min-w-[245px] py-18 transition-colors cursor-pointer outline-none",
                            selectedCategory === cat
                                ? "bg-white text-black border-white"
                                : "bg-black text-white border-[#333] hover:bg-[#111]"
                        )}
                        style={{
                            fontFamily: 'Thedus-wd',
                            fontSize: 'clamp(14px, 1vw, 18px)',
                            letterSpacing: '0.1em',
                            position: 'relative',
                            zIndex: 20,
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* ── TEAM IMAGES ── */}
            <div className="w-full flex justify-center items-end mt-4 md:mt-12 flex-1">
                <div className="relative w-full max-w-[1440px] h-full flex items-end justify-center px-4 gap-4">
                    {['nakul', 'kiran', 'kk', 'dilu'].map((person) => {
                        const isActive = categoryMap[selectedCategory]?.includes(person);

                        return (
                            <div
                                key={person}
                                className="flex-1 relative h-[60vh] md:h-[70vh] group overflow-hidden flex items-end justify-center"
                                style={{
                                    transform: isActive ? 'scale(1.15) translateY(-12px)' : 'scale(1) translateY(0px)',
                                    transition: 'transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    zIndex: isActive ? 5 : 1,
                                }}
                            //                                 style={{
                            //                                     transform: isActive 
                            //                                         ? 'scale(1.08) translateY(-14px)' 
                            //                                         : 'scale(1) translateY(0px)',
                            //                                     transition: 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
                            //                                     willChange: 'transform',
                            //                                     zIndex: isActive ? 5 : 1,
                            // }}
                            >
                                {/* Normal image — visible when NOT active */}
                                <Image
                                    src={`/hero/${person}.png`}
                                    alt={person}
                                    fill
                                    className="object-contain object-bottom"
                                    sizes="(max-width: 800px) 25vw, 20vw"
                                    priority
                                    style={{
                                        opacity: isActive ? 0 : 1,
                                        transition: 'opacity 0.4s ease',
                                    }}
                                />

                                {/* Color image — visible when active */}
                                <Image
                                    src={`/hero/${person}color.png`}
                                    alt={`${person} color`}
                                    fill
                                    className="object-contain object-bottom"
                                    sizes="(max-width: 768px) 25vw, 20vw"
                                    priority
                                    style={{
                                        opacity: isActive ? 1 : 0,
                                        transition: 'opacity 0.4s ease',
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

        </section>
    );
}