'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WebsitesStack from './web/WebsitesStack';
import CreativesGrid from './web/CreativesGrid';

/**
 * Portfolio section — tab switcher between WEBSITES and CREATIVES.
 * All heavy logic lives in child components.
 */
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
                className="text-center leading-none tracking-[-0.02em] mb-16 uppercase sticky top-[90px] z-[40] bg-white w-full py-4"
                style={{
                    fontFamily: 'Thedus-cl',
                    fontWeight: 700,
                    fontSize: 'clamp(48px, 7vw, 100px)',
                }}
            >
                <span style={{ color: '#D00000' }}>
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
            <div className="w-full max-w-[1200px] px-8 min-h-[600px] relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="w-full"
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
                style={{ border: '1.5px solid #d4d4d4', zIndex: 50, marginTop: '26px' }}
            >
                <button
                    onClick={() => handleTabChange('WEBSITES')}
                    className="px-16 py-4 uppercase transition-all duration-300 relative overflow-hidden"
                    style={{
                        fontFamily: 'Thedus-c',
                        fontWeight: 700,
                        fontSize: 'clamp(18px, 2vw, 26px)',
                        letterSpacing: '0.2em',
                        backgroundColor: activeTab === 'WEBSITES' ? '#D00000' : 'white',
                        color: activeTab === 'WEBSITES' ? 'white' : '#D00000',
                        borderRight: '1.5px solid #d4d4d4',
                    }}
                >
                    WEBSITES
                </button>
                <button
                    onClick={() => handleTabChange('CREATIVES')}
                    className="px-16 py-4 uppercase transition-all duration-300 relative overflow-hidden"
                    style={{
                        fontFamily: 'Thedus-c',
                        fontWeight: 700,
                        fontSize: 'clamp(18px, 2vw, 26px)',
                        letterSpacing: '0.2em',
                        backgroundColor: activeTab === 'CREATIVES' ? '#D00000' : 'white',
                        color: activeTab === 'CREATIVES' ? 'white' : '#D00000',
                    }}
                >
                    CREATIVES
                </button>
            </div>
        </section>
    );
}