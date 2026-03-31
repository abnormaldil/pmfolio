'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { normalizeCategory } from '@/lib/mediaHelpers';
import CreativeDetail from './CreativeDetail';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

/** Category definitions with SVG icons */
const creativeCategories = [
    {
        key: 'video_editing',
        label: 'VIDEO\nEDITING',
        displayLabel: ['VIDEO', 'EDITING'],
        icon: '/assets/video-icon.png',
        description: 'Professional storytelling through cinematic cutting and color grading.'
    },
    {
        key: 'motion_gfx',
        label: 'MOTION\nGFX',
        displayLabel: ['MOTION', 'GFX'],
        icon: '/assets/mgfx-icon.png',
        description: 'Dynamic animations and visual effects that bring digital designs to life.'
    },
    {
        key: 'graphics',
        label: 'GRAPHIC\nDESIGN',
        displayLabel: ['GRAPHIC', 'DESIGN'],
        icon: '/assets/gfx-icon.png',
        description: 'Modern brand identities and high-impact visual communication systems.'
    },
    {
        key: 'ui_ux',
        label: 'UI/UX',
        displayLabel: ['UI/UX'],
        icon: '/assets/ui-icon.png',
        description: 'Intuitive user interfaces and seamless digital experiences designed to convert.'
    },
];

export default function CreativesGrid({ creativesData }) {
    const [selectedKey, setSelectedKey] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const containerRef = useRef(null);
    const tlRef = useRef(null);

    const selectedCategory = creativeCategories.find(c => c.key === selectedKey);
    const filteredItems = selectedKey ? creativesData.filter(item => normalizeCategory(item.category) === selectedKey) : [];

    // ─── grid pinning and scrolling ─────────────────────────────────────────────

    // useGSAP(() => {
    //     if (!containerRef.current) return;

    //     const ctx = gsap.context(() => {
    //         const scrollContainer = containerRef.current.querySelector('.creatives-scroll-container');
    //         const cardsWrapper = containerRef.current.querySelector('.cards-wrapper');

    //         if (!scrollContainer || !cardsWrapper) return;

    //         // Provide enough scroll space for the cards to move all the way left
    //         const getScrollAmount = () => {
    //             let cardsWidth = cardsWrapper.scrollWidth;
    //             return Math.max(0, cardsWidth - window.innerWidth + 200);
    //         };

    //         const tl = gsap.timeline({
    //             scrollTrigger: {
    //                 id: "creatives-grid",
    //                 trigger: scrollContainer,
    //                 start: "center center",
    //                 end: () => `+=${getScrollAmount()}`,
    //                 pin: true,
    //                 scrub: 1,
    //                 invalidateOnRefresh: true,
    //                 markers: true,
    //             }
    //         });

    //         tlRef.current = tl;

    //         tl.to(cardsWrapper, {
    //             x: () => -getScrollAmount(),
    //             ease: "none",
    //         });

    //     }, containerRef);

    //     return () => {
    //         ctx.revert();
    //         tlRef.current = null;
    //     };
    // }, { scope: containerRef });

    useGSAP(() => {
        if (!containerRef.current) return;

        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            const scrollContainer = containerRef.current.querySelector('.creatives-scroll-container');
            const cardsWrapper = containerRef.current.querySelector('.cards-wrapper');

            if (!scrollContainer || !cardsWrapper) return;

            const getScrollAmount = () => {
                const cardsWidth = cardsWrapper.scrollWidth;
                return Math.max(0, cardsWidth - window.innerWidth + 200);
            };

            const tl = gsap.timeline({
                scrollTrigger: {
                    id: "creatives-grid",
                    trigger: scrollContainer,
                    start: "top top",
                    end: () => `+=${getScrollAmount()}`,
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                }
            });

            tl.to(cardsWrapper, {
                x: () => -getScrollAmount(),
                ease: "none",
            });

            tlRef.current = tl;
        });

        // 👇 wait for layout to stabilize then refresh all triggers
        setTimeout(() => {
            ScrollTrigger.refresh(true);
        }, 200);

        return () => {
            mm.revert();
            tlRef.current = null;
        };
    }, { scope: containerRef });

    // ─── open/close transitions ────────────────────────────────────────────────

    const handleCardClick = useCallback((key) => {
        if (selectedKey || isTransitioning) return;

        setIsTransitioning(true);
        setSelectedKey(key);
        document.body.style.overflow = 'hidden';

        // Wait a small tick so `selectedKey` propagates and `<CreativeDetail />` 
        // renders its content without interrupting the GSAP start.
        setTimeout(() => {
            const detailEl = document.querySelector('.creative-detail-fade-wrapper');
            if (detailEl) {
                // Remove pointer events blockade to allow interacting with detail view
                detailEl.style.pointerEvents = 'auto';
                gsap.fromTo(detailEl,
                    { opacity: 0 },
                    {
                        opacity: 1,
                        duration: 0.5,
                        ease: 'power2.inOut',
                        onComplete: () => setIsTransitioning(false)
                    }
                );
            } else {
                setIsTransitioning(false);
            }
        }, 10);
    }, [selectedKey, isTransitioning]);

    const handleClose = useCallback(() => {
        if (!selectedKey || isTransitioning) return;

        setIsTransitioning(true);

        const detailEl = document.querySelector('.creative-detail-fade-wrapper');
        if (detailEl) {
            // Block clicks immediately upon closing
            detailEl.style.pointerEvents = 'none';
            gsap.to(detailEl, {
                opacity: 0,
                duration: 0.4,
                ease: 'power2.out',
                onComplete: () => {
                    setSelectedKey(null);
                    setIsTransitioning(false);
                    document.body.style.overflow = '';
                    ScrollTrigger.refresh();
                }
            });
        } else {
            setSelectedKey(null);
            setIsTransitioning(false);
            document.body.style.overflow = '';
            ScrollTrigger.refresh();
        }
    }, [selectedKey, isTransitioning]);

    return (
        <div className="w-full overflow-hidden" ref={containerRef}>
            {/* Grid Container */}
            <div
                className="creatives-scroll-container w-full md:h-[80vh] md:min-h-[600px] h-auto flex items-center py-20 md:py-0"
            >
                <div className="cards-wrapper flex flex-col md:flex-row gap-20 md:gap-60 md:px-[10vw] w-full md:w-max items-center">
                    {creativeCategories.map((item, index) => {
                        const count = creativesData.filter(c => normalizeCategory(c.category) === item.key).length;
                        const key = item.key;
                        return (
                            <div
                                key={key}
                                onClick={() => handleCardClick(key)}
                                className={`card-${index} shrink-0 w-[280px] flex flex-col items-center group cursor-pointer creative-card`}
                            >
                                <div
                                    className="relative z-10 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 card-icon"
                                    style={{
                                        width: '280px',
                                        height: '280px',
                                        marginBottom: '-120px',
                                    }}
                                >
                                    <Image 
                                        src={item.icon} 
                                        alt={item.key} 
                                        width={280} 
                                        height={280} 
                                        className="object-contain"
                                        priority
                                    />
                                </div>

                                <div
                                    className="w-full flex items-end pb-9 pl-8 rounded-sm card-red"
                                    style={{ backgroundColor: '#e03047', paddingTop: '80px', minHeight: '280px', height: '320px' }}
                                >
                                    <div>
                                        <p
                                            className="uppercase text-white leading-[0.85] whitespace-pre-line"
                                            style={{
                                                fontFamily: 'Thedus-wl',
                                                fontWeight: 300,
                                                fontSize: 'clamp(32px, 2.8vw, 44px)',
                                                letterSpacing: '0.02em',
                                                paddingLeft: '36px',
                                                paddingRight: '36px',
                                                paddingBottom: '38px'
                                            }}
                                        >
                                            {item.label}
                                        </p>
                                        <p
                                            className="uppercase text-white/70 whitespace-pre-line leading-[1.3] mt-2 mb-4"
                                            style={{
                                                fontFamily: 'Thedus-wl',
                                                fontWeight: 300,
                                                fontSize: 'clamp(15px, 0.9vw, 13px)',
                                                letterSpacing: '0.15em',
                                                paddingLeft: '38px',
                                                paddingRight: '36px',
                                                paddingBottom: '25px'
                                            }}
                                        >
                                            {item.description}
                                        </p>
                                        {/* {count > 0 && (
                                            <p className="text-white/60 mt-4 text-xs uppercase tracking-[0.15em]"
                                                style={{ fontFamily: 'Thedus-l' }}>
                                                {count} {count === 1 ? 'project' : 'projects'}
                                            </p>
                                        )} */}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Detail View Wrapper Always in DOM for fast animation start */}
            <div
                className="creative-detail-fade-wrapper"
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    opacity: 0,
                    pointerEvents: 'none' // Prevent interactions when invisible
                }}
            >
                {selectedKey && selectedCategory && (
                    <CreativeDetail
                        key={selectedKey}
                        categoryItem={selectedCategory}
                        items={filteredItems}
                        onClose={handleClose}
                    />
                )}
            </div>
        </div>
    );
}
