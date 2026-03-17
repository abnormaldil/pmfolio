'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WebsitesStack from './web/WebsitesStack';
import CreativesGrid from './web/CreativesGrid';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Portfolio({ websitesData = [], creativesData = [] }) {
    const [activeTab, setActiveTab] = useState('WEBSITES');
    const sectionRef = useRef(null);

    const handleTabChange = (tab) => {
        if (activeTab === tab) return;
        setActiveTab(tab);
        if (sectionRef.current) {
            const yOffset = -100;
            const y = sectionRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <section
            ref={sectionRef}
            id="portfolio"
            className="section-container relative w-full bg-white flex flex-col items-center min-h-screen"
            style={{ paddingTop: 'calc(90px + clamp(30px, 5vh, 60px))' }}
        >

            {/* Headline */}
            <h2
                className="text-center leading-none tracking-[-0.02em] mb-16 uppercase w-full py-4 relative"
                style={{
                    fontFamily: 'Humane-rg',
                    fontWeight: 400,
                    letterSpacing: '0.015em',
                    fontSize: 'clamp(50px, 7vw, 100px)',
                }}
            >
                <span style={{ color: '#e03047' }}>
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            style={{ display: 'inline-block' }}
                        >
                            {activeTab === 'WEBSITES' ? 'WEBSITES' : 'CREATIVES'}
                        </motion.span>
                    </AnimatePresence>
                </span>
                <span style={{ color: '#111' }}> WE'VE ENGINEERED</span>
            </h2>

            {/* Content */}
            <div className={`w-full min-h-[600px] relative transition-all duration-500 ease-in-out ${activeTab === 'WEBSITES' ? 'max-w-[1200px] px-8' : ''}`}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="w-full"
                        onAnimationComplete={() => {
                            ScrollTrigger.refresh();
                        }}
                    >
                        {activeTab === 'WEBSITES' ? (
                            <WebsitesStack websites={websitesData} />
                        ) : (
                            <CreativesGrid creativesData={creativesData} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Tab Switcher */}
            <div
                className="flex sticky bottom-8 mt-16 shadow-2xl"
                style={{ border: '1.5px solid #d4d4d4', zIndex: 10, marginTop: '26px' }}
            >

                {/* WEBSITES */}
                <button
                    onClick={() => handleTabChange('WEBSITES')}
                    className="group relative overflow-hidden px-12 py-4 lg:px-28 lg:py-7 uppercase border-r border-neutral-300"
                    style={{
                        fontFamily: 'Thedus-wl',
                        fontWeight: 500,
                        fontSize: 'clamp(20px, 2.5vw, 32px)',
                        letterSpacing: '0.05em',

                        padding: '10 30px'
                    }}
                >

                    {/* base layer */}
                    <div
                        className={`absolute inset-0 transition-colors duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${activeTab === 'WEBSITES' ? 'bg-[#e03047]' : 'bg-white'
                            }`}
                    />

                    {/* sliding door (slides up from bottom) */}
                    <div
                        className={`absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${activeTab === 'WEBSITES' ? 'bg-white' : 'bg-[#e03047]'
                            }`}
                    />

                    <span
                        className={`relative z-10 transition-colors duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${activeTab === 'WEBSITES'
                            ? 'text-white group-hover:text-[#e03047]'
                            : 'text-[#e03047] group-hover:text-white'
                            }`}
                    >
                        WEBSITES
                    </span>

                </button>

                {/* CREATIVES */}
                <button
                    onClick={() => handleTabChange('CREATIVES')}
                    className="group relative overflow-hidden px-12 py-4 lg:px-28 lg:py-7 uppercase"
                    style={{
                        fontFamily: 'Thedus-wl',
                        fontWeight: 500,
                        fontSize: 'clamp(20px, 2.5vw, 32px)',
                        letterSpacing: '0.05em',
                         padding: '10 30px'
                    }}
                >

                    {/* base layer */}
                    <div
                        className={`absolute inset-0 transition-colors duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${activeTab === 'CREATIVES' ? 'bg-[#e03047]' : 'bg-white'
                            }`}
                    />

                    {/* sliding door (slides down from top) */}
                    <div
                        className={`absolute inset-0 -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${activeTab === 'CREATIVES' ? 'bg-white' : 'bg-[#e03047]'
                            }`}
                    />

                    <span
                        className={`relative z-10 transition-colors duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${activeTab === 'CREATIVES'
                            ? 'text-white group-hover:text-[#e03047]'
                            : 'text-[#e03047] group-hover:text-white'
                            }`}
                    >
                        CREATIVES
                    </span>

                </button>

            </div>

        </section>
    );
}