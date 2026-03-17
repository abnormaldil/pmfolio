'use client';
import { useState, useRef } from 'react';
import { normalizeCategory } from '@/lib/mediaHelpers';
import CreativeDetail from './CreativeDetail';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== "undefined") {
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
        label: 'GRAPHICS',
        displayLabel: ['GRAPHICS'],
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
    const [selected, setSelected] = useState(null);
    const containerRef = useRef(null);
    const tlRef = useRef(null);

    const selectedCategory = creativeCategories.find(c => c.key === selected);
    const filteredItems = selected ? creativesData.filter(item => normalizeCategory(item.category) === selected) : [];



    const handleCardClick = (key) => {
        if (!tlRef.current || !tlRef.current.scrollTrigger) {
            setSelected(key);
            return;
        }

        const st = tlRef.current.scrollTrigger;
        const startPos = st.start;

        // 1. Force ScrollTrigger to move the scrollbar back to the PIN START position.
        // This moves the window BEFORE we destroy the trigger or unmount the DOM.
        st.scroll(startPos);

        // 2. Now that the window is physically at the start, we can safely kill the pin.
        st.kill(true);
        tlRef.current.kill();
        tlRef.current = null;

        // 3. Update React State to unmount the grid and mount the details page.
        setSelected(key);

        // 4. Force a refresh of all other ScrollTriggers on the page so they recalculate
        // their start/end positions without the 200vh pin spacer.
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 50);
    };

    const handleClose = () => {
        let targetScroll = 0;

        // Get the current section top before the layout shifts
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            targetScroll = window.scrollY + rect.top;
        }

        setSelected(null);

        // Prevent scroll jump and re-initialize GSAP correctly when returning to the grid
        setTimeout(() => {
            window.scrollTo({ top: targetScroll, behavior: "instant" });
            ScrollTrigger.refresh();
        }, 50);
    };



    useGSAP(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const scrollContainer =
                containerRef.current?.querySelector('.creatives-scroll-container');

            if (!scrollContainer) return;

            // const tl = gsap.timeline({
            //     scrollTrigger: {
            //         trigger: scrollContainer,
            //         start: "top 10%",
            //         end: "+=200%",
            //         pin: true,
            //         scrub: 1,
            //     }
            // });
            const tl = gsap.timeline({
                scrollTrigger: {
                    id: "creatives-grid",
                    trigger: scrollContainer,
                    start: "top 10%",
                    end: "+=200%",
                    pin: true,
                    scrub: 1,
                }
            });

            tlRef.current = tl;

            gsap.set(".card-0", { left: "25%", top: "50%", yPercent: -50, xPercent: -50 });
            gsap.set(".card-1", { left: "75%", top: "50%", yPercent: -50, xPercent: -50 });
            gsap.set(".card-2", { left: "75%", top: "100%", yPercent: 20, xPercent: -50 });
            gsap.set(".card-3", { left: "75%", top: "100%", yPercent: 120, xPercent: -50 });

            tl.to(".card-0", { opacity: 0, scale: 0.8, xPercent: -150, duration: 1 })
                .to(".card-1", { left: "25%", duration: 1 }, "<")
                .to(".card-2", { top: "50%", yPercent: -50, duration: 1 }, "<")

                .to(".card-1", { opacity: 0, scale: 0.8, xPercent: -150, duration: 1 })
                .to(".card-2", { left: "25%", duration: 1 }, "<")
                .to(".card-3", { top: "50%", yPercent: -50, duration: 1 }, "<");

        }, containerRef);

        return () => {
            ctx.revert();
            tlRef.current = null;
        };

    }, { dependencies: [selected], scope: containerRef });
    return (
        <div className="w-full" ref={containerRef}>
            {selected && selectedCategory && (
                <div className="w-full mb-10">
                    <CreativeDetail
                        categoryItem={selectedCategory}
                        items={filteredItems}
                        onClose={handleClose}
                    />
                </div>
            )}

            {!selected && (
                // <div className="creatives-scroll-container w-full h-[80vh] min-h-[600px] relative overflow-hidden">
                <div className="creatives-scroll-container w-full h-[80vh] min-h-[600px] relative">
                    {creativeCategories.map((item, index) => {
                        const count = creativesData.filter(c => normalizeCategory(c.category) === item.key).length;
                        return (
                            <div
                                key={item.key}
                                onClick={() => handleCardClick(item.key)}
                                className={`card-${index} absolute w-[280px] flex flex-col items-center group cursor-pointer`}
                            >
                                <div
                                    className="relative z-10 flex items-center justify-center rounded-full group-hover:scale-105 transition-transform duration-300"
                                    style={{
                                        width: '200px',
                                        height: '200px',
                                        background: 'radial-gradient(circle at 35% 35%, #4a4a4a, #1a1a1a)',
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                                        marginBottom: '-60px',
                                    }}
                                >
                                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                                        {item.key === 'video_editing' && (
                                            <>
                                                <rect x="8" y="22" width="42" height="36" rx="6" fill="white" />
                                                <path d="M54 32L72 24V56L54 48V32Z" fill="white" />
                                            </>
                                        )}
                                        {item.key === 'motion_gfx' && (
                                            <>
                                                <circle cx="52" cy="16" r="6" stroke="white" strokeWidth="3" fill="none" />
                                                <path d="M48 24L36 36L24 32" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                                <path d="M36 36L32 52L20 60" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                                <path d="M36 36L48 48L56 60" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                                <circle cx="14" cy="28" r="3" fill="white" />
                                                <circle cx="8" cy="44" r="3" fill="white" />
                                            </>
                                        )}
                                        {item.key === 'graphics' && (
                                            <>
                                                <rect x="44" y="10" width="12" height="36" rx="3" transform="rotate(35 44 10)" stroke="white" strokeWidth="3" fill="none" />
                                                <path d="M32 58L28 70L40 66Z" stroke="white" strokeWidth="2.5" fill="none" />
                                                <rect x="10" y="44" width="50" height="12" rx="3" stroke="white" strokeWidth="3" fill="none" />
                                                <path d="M20 44V50M30 44V50M40 44V50M50 44V50" stroke="white" strokeWidth="2" />
                                            </>
                                        )}
                                        {item.key === 'ui_ux' && (
                                            <>
                                                <rect x="16" y="20" width="44" height="36" rx="2" stroke="white" strokeWidth="3" fill="none" strokeDasharray="4 2" />
                                                <rect x="10" y="14" width="10" height="10" rx="2" fill="white" />
                                                <rect x="60" y="14" width="10" height="10" rx="2" fill="white" />
                                                <rect x="10" y="56" width="10" height="10" rx="2" fill="white" />
                                                <rect x="60" y="56" width="10" height="10" rx="2" fill="white" />
                                                <path d="M50 46L58 70L62 58L74 54L50 46Z" fill="white" />
                                            </>
                                        )}
                                    </svg>
                                </div>

                                <div
                                    className="w-full flex items-end pb-7 pl-7 rounded-sm"
                                    style={{ backgroundColor: '#e03047', paddingTop: '80px', minHeight: '280px' }}
                                >
                                    <div>
                                        <p
                                            className="uppercase text-white leading-tight whitespace-pre-line"
                                            style={{
                                                fontFamily: 'Thedus, sans-serif',
                                                fontWeight: 700,
                                                fontSize: 'clamp(18px, 2vw, 26px)',
                                                letterSpacing: '0.05em',
                                            }}
                                        >
                                            {item.label}
                                        </p>
                                        {count > 0 && (
                                            <p className="text-white/60 mt-2 text-xs uppercase tracking-[0.15em]"
                                                style={{ fontFamily: 'Thedus-cl' }}>
                                                {count} {count === 1 ? 'project' : 'projects'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
