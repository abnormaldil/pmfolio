'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

export default function CardDeck({ isMobile = false, delay = 0 }) {
    const containerRef = useRef(null);
    const cardsRef = useRef([]);

    // Virtual positions of cards (index is physical card id, value is virtual depth 0..3)
    const positions = useRef([0, 1, 2, 3]);
    const isScrolledRef = useRef(false); // Blocks interactions when scattered in WhyUs section

    // Card data
    const cards = [
        { src: '/assets/cards/card1.png', alt: 'Card 1' },
        { src: '/assets/cards/card2.png', alt: 'Card 2' },
        { src: '/assets/cards/card3.png', alt: 'Card 3' },
        { src: '/assets/cards/card4.png', alt: 'Card 4' },
    ];

    // Deck dimensions
    const deckWidth = isMobile ? '165px' : '330px';
    const deckHeight = isMobile ? '240px' : '460px';

    // 3D depth values (creates stacked thickness)
    const depth = [0, -20, -40, -60];
    const offsetY = [0, 4, 8, 12];
    const zIndexes = [40, 30, 20, 10];

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        let ctx;

        const startAnimation = () => {
            ctx = gsap.context(() => {

                const tl = gsap.timeline({ delay });

                // Initial fan animation
                tl.fromTo(cardsRef.current,
                    {
                        opacity: 0,
                        scale: 0.8,
                        y: 50,
                        rotation: 0,
                        z: (i) => depth[positions.current[i]]
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        duration: 1.2,
                        stagger: 0.1,
                        ease: "back.out(1.2)",
                    }
                ).to(cardsRef.current, {
                    rotation: (i) => {
                        const pos = positions.current[i];
                        return (isMobile ? -pos * 5 : -pos * 8) + 8;
                    },
                    x: (i) => {
                        const pos = positions.current[i];
                        return -pos * 10;
                    },
                    y: (i) => {
                        const pos = positions.current[i];
                        return pos * 4 + offsetY[pos];
                    },
                    z: (i) => depth[positions.current[i]],
                    duration: 1,
                    ease: "power2.out"
                }, "-=0.8");

                // --- CROSS-SECTION SCATTER SCROLLTRIGGER ---
                const scatterTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: isMobile ? "#home-mobile" : "#home-desktop",
                        start: "top top", // Starts pinning/scrubbing when Hero hits top
                        end: "+=110%", // Scrolls for 110% of viewport height
                        scrub: 1.2,
                        onEnter: () => { isScrolledRef.current = true; },
                        onLeaveBack: () => { isScrolledRef.current = false; },
                    }
                });

                // Drop the entire card container 100vh down to float perfectly center of WhyUs
                scatterTl.to(containerRef.current, {
                    y: isMobile ? "90vh" : "100vh",
                    ease: "none"
                }, 0);

                // Scatter the 4 individual cards directly to the target points
                cardsRef.current.forEach((card, i) => {
                    const scatterProps = [
                        // All 4 cards horizontal row below text
                        { x: isMobile ? "-25vw" : "-12vw", y: isMobile ? "20vh" : "-10vh", rotation: 0, scale: isMobile ? 0.40 : 0.37 },
                        { x: isMobile ? "-5vw" : "10vw", y: isMobile ? "30vh" : "-35vh", rotation: 0, scale: isMobile ? 0.40 : 0.37 },
                        { x: isMobile ? "15vw" : "-25vw", y: isMobile ? "20vh" : "20vh", rotation: 0, scale: isMobile ? 0.40 : 0.37 },
                        { x: isMobile ? "35vw" : "2vw", y: isMobile ? "30vh" : "12vh", rotation: 0, scale: isMobile ? 0.40 : 0.37 }
                    ];

                    const pos = positions.current[i];

                    scatterTl.fromTo(card, {
                        x: -pos * 10,
                        y: pos * 4 + offsetY[pos],
                        rotation: (isMobile ? -pos * 5 : -pos * 8) + 8,
                        scale: 1
                    }, scatterProps[i], 0);
                });


                // Desktop cursor interaction
                if (!isMobile) {

                    const handleMouseMove = (e) => {
                        if (isScrolledRef.current) return; // Block interaction tracking in WhyUs

                        const { innerWidth, innerHeight } = window;
                        const x = (e.clientX / innerWidth - 0.5) * 2;
                        const y = (e.clientY / innerHeight - 0.5) * 2;

                        cardsRef.current.forEach((card, i) => {
                            const pos = positions.current[i];
                            const originalX = -pos * 10;
                            const originalY = pos * 4 + offsetY[pos];
                            const intensity = 12 + (3 - pos) * 2;

                            gsap.to(card, {
                                x: originalX - x * intensity,
                                y: originalY - y * intensity,
                                duration: 0.6,
                                ease: "power2.out",
                                overwrite: "auto"
                            });
                        });
                    };

                    const handleMouseLeave = () => {
                        if (isScrolledRef.current) return;
                        cardsRef.current.forEach((card, i) => {
                            const pos = positions.current[i];
                            gsap.to(card, {
                                x: -pos * 10,
                                y: pos * 4 + offsetY[pos],
                                duration: 0.8,
                                ease: "power2.out",
                                overwrite: "auto"
                            });
                        });
                    };

                    window.addEventListener('mousemove', handleMouseMove);
                    window.addEventListener('mouseleave', handleMouseLeave);

                    return () => {
                        window.removeEventListener('mousemove', handleMouseMove);
                        window.removeEventListener('mouseleave', handleMouseLeave);
                    };
                }

            }, containerRef);
        };

        if (window.preloaderFinished) {
            startAnimation();
        } else {
            window.addEventListener('finishLoading', startAnimation);
        }

        return () => {
            if (ctx) ctx.revert();
            window.removeEventListener('finishLoading', startAnimation);
        };

    }, [isMobile, delay]);

    // Handle Deck Click cycle
    const handleDeckClick = () => {
        if (isScrolledRef.current) return; // Disables clicking when scattered

        const numCards = positions.current.length;

        // compute new positions: front goes to back, others move forward
        let newPositions = [...positions.current];
        for (let i = 0; i < numCards; i++) {
            newPositions[i] = (positions.current[i] - 1 + numCards) % numCards;
        }
        positions.current = newPositions;

        // Animate cards to new layer depths
        cardsRef.current.forEach((card, i) => {
            if (!card) return;
            const pos = positions.current[i];

            gsap.to(card, {
                rotation: (isMobile ? -pos * 5 : -pos * 8) + 8,
                x: -pos * 10,
                y: pos * 4 + offsetY[pos],
                z: depth[pos],
                zIndex: zIndexes[pos],
                duration: 0.8,
                ease: "power3.out",
                overwrite: "auto",
            });
        });
    };

    return (
        <div
            ref={containerRef}
            className="relative flex items-center justify-center" // removed pointer-events-none so we can click
            style={{
                width: deckWidth,
                height: deckHeight,
                perspective: "1200px",
                transformStyle: "preserve-3d",
                transform: "rotateX(6deg)" // slight camera tilt
            }}
        >
            {cards.map((card, index) => (
                <div
                    key={index}
                    ref={(el) => (cardsRef.current[index] = el)}
                    onClick={handleDeckClick}
                    className="absolute bg-white border-5 border-white overflow-hidden cursor-pointer"
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: isMobile ? '20px' : '28px',
                        zIndex: zIndexes[index], // Initial z-index before any swaps
                        transformOrigin: 'bottom',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
                        // transform is now completely handled by GSAP (x,y,z,rotation)
                    }}
                >

                    {/* Image wrapper */}
                    <div
                        className="relative w-full h-full flex items-center justify-center bg-zinc-900 border border-white/10 overflow-hidden"
                        style={{ borderRadius: isMobile ? '18px' : '26px' }}
                    >

                        <Image
                            src={card.src}
                            alt={card.alt}
                            fill
                            className="object-cover pointer-events-none"
                            sizes={isMobile ? "220px" : "364px"}
                        />

                        {/* fallback gradient */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-800 to-zinc-900 -z-10 mix-blend-overlay opacity-50 pointer-events-none"></div>

                        <span className="text-zinc-500 font-mono text-[10px] absolute bottom-3 right-3 z-0 pointer-events-none">
                            {card.alt.toUpperCase()}
                        </span>

                    </div>

                </div>
            ))}
        </div>
    );
}