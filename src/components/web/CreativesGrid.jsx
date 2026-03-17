'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
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
        icon: (
            <svg width="110" height="110" viewBox="0 0 80 80" fill="none">
                <rect x="8" y="22" width="42" height="36" rx="6" fill="white" />
                <path d="M54 32L72 24V56L54 48V32Z" fill="white" />
            </svg>
        ),
    },
    {
        key: 'motion_gfx',
        label: 'MOTION\nGFX',
        displayLabel: ['MOTION', 'GFX'],
        icon: (
            <svg width="110" height="110" viewBox="0 0 80 80" fill="none">
                <circle cx="52" cy="16" r="6" stroke="white" strokeWidth="3" fill="none" />
                <path d="M48 24L36 36L24 32" stroke="white" strokeWidth="3" strokeLinecap="round" />
                <path d="M36 36L32 52L20 60" stroke="white" strokeWidth="3" strokeLinecap="round" />
                <path d="M36 36L48 48L56 60" stroke="white" strokeWidth="3" strokeLinecap="round" />
                <circle cx="14" cy="28" r="3" fill="white" />
                <circle cx="8" cy="44" r="3" fill="white" />
                <circle cx="18" cy="52" r="2" fill="white" />
            </svg>
        ),
    },
    {
        key: 'graphics',
        label: 'GRAPHIC\nDESIGN',
        displayLabel: ['GRAPHIC', 'DESIGN'],
        icon: (
            <svg width="110" height="110" viewBox="0 0 80 80" fill="none">
                <rect x="44" y="10" width="12" height="36" rx="3" transform="rotate(35 44 10)" stroke="white" strokeWidth="3" fill="none" />
                <path d="M32 58L28 70L40 66Z" stroke="white" strokeWidth="2.5" fill="none" />
                <rect x="10" y="44" width="50" height="12" rx="3" stroke="white" strokeWidth="3" fill="none" />
                <path d="M20 44V50M30 44V50M40 44V50M50 44V50" stroke="white" strokeWidth="2" />
                <rect x="8" y="16" width="8" height="8" rx="2" fill="white" />
                <rect x="64" y="16" width="8" height="8" rx="2" fill="white" />
            </svg>
        ),
    },
    {
        key: 'ui_ux',
        label: 'UI/UX',
        displayLabel: ['UI/UX'],
        icon: (
            <svg width="110" height="110" viewBox="0 0 80 80" fill="none">
                <rect x="16" y="20" width="44" height="36" rx="2" stroke="white" strokeWidth="3" fill="none" strokeDasharray="4 2" />
                <rect x="10" y="14" width="10" height="10" rx="2" fill="white" />
                <rect x="60" y="14" width="10" height="10" rx="2" fill="white" />
                <rect x="10" y="56" width="10" height="10" rx="2" fill="white" />
                <rect x="60" y="56" width="10" height="10" rx="2" fill="white" />
                <path d="M50 46L58 70L62 58L74 54L50 46Z" fill="white" />
            </svg>
        ),
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

        const ctx = gsap.context(() => {
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

        }, containerRef);

        // 👇 wait for layout to stabilize then refresh all triggers
        setTimeout(() => {
            ScrollTrigger.refresh(true);
        }, 200);

        return () => {
            ctx.revert();
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
                className="creatives-scroll-container w-full h-[80vh] min-h-[600px] flex items-center "
            >
                <div className="cards-wrapper flex gap-12 md:gap-60 px-[10vw] w-max">
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
                                    className="relative z-10 flex items-center justify-center rounded-full group-hover:scale-105 transition-transform duration-300 card-icon"
                                    style={{
                                        width: '200px',
                                        height: '200px',
                                        background: 'radial-gradient(circle at 35% 35%, #4a4a4a, #1a1a1a)',
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                                        marginBottom: '-60px',
                                    }}
                                >
                                    {item.icon}
                                </div>

                                <div
                                    className="w-full flex items-end pb-9 pl-8 rounded-sm card-red"
                                    style={{ backgroundColor: '#e03047',     paddingTop: '80px', minHeight: '280px', height: '320px' }}
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
                                                paddingBottom: '15px'
                                            }}
                                        >
                                            {item.label}
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
