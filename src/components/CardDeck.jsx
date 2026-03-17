'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

export default function CardDeck({ isMobile = false, delay = 0 }) {
    const containerRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        let ctx;

        const startAnimation = () => {
            ctx = gsap.context(() => {

                const tl = gsap.timeline({ delay });

                // Initial fan animation
                tl.fromTo(cardsRef.current,
                    { opacity: 0, scale: 0.8, y: 50, rotation: 0 },
                    {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        duration: 1.2,
                        stagger: 0.1,
                        ease: "back.out(1.2)",
                    }
                ).to(cardsRef.current, {
                    rotation: (i) => (isMobile ? -i * 5 : -i * 8) + 8,
                    x: (i) => -i * 10,
                    y: (i) => i * 4,
                    duration: 1,
                    ease: "power2.out"
                }, "-=0.8");


                // Desktop cursor interaction
                if (!isMobile) {

                    const handleMouseMove = (e) => {
                        const { innerWidth, innerHeight } = window;
                        const x = (e.clientX / innerWidth - 0.5) * 2;
                        const y = (e.clientY / innerHeight - 0.5) * 2;

                        cardsRef.current.forEach((card, i) => {
                            const originalX = -i * 10;
                            const originalY = i * 4;
                            const intensity = 12 + (3 - i) * 2;

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
                        cardsRef.current.forEach((card, i) => {
                            gsap.to(card, {
                                x: -i * 10,
                                y: i * 4,
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

    }, [isMobile]);



    // Card data
    const cards = [
        { src: '/assets/cards/card1.png', alt: 'Card 1', zIndex: 40 },
        { src: '/assets/cards/card2.png', alt: 'Card 2', zIndex: 30 },
        { src: '/assets/cards/card3.png', alt: 'Card 3', zIndex: 20 },
        { src: '/assets/cards/card4.png', alt: 'Card 4', zIndex: 10 },
    ];


    // Deck dimensions
    const deckWidth = isMobile ? '165px' : '364px';
    const deckHeight = isMobile ? '240px' : '511px';


    // 3D depth values (creates stacked thickness)
    const depth = [0, -20, -40, -60];
    const offsetY = [0, 4, 8, 12];


    return (
        <div
            ref={containerRef}
            className="relative flex items-center justify-center pointer-events-none"
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
                    className="absolute bg-white border-5 border-white overflow-hidden"
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: isMobile ? '20px' : '28px',
                        zIndex: card.zIndex,
                        transformOrigin: 'bottom',
                        transform: `translateZ(${depth[index]}px) translateY(${offsetY[index]}px)`,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
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
                        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-800 to-zinc-900 -z-10 mix-blend-overlay opacity-50"></div>

                        <span className="text-zinc-500 font-mono text-[10px] absolute bottom-3 right-3 z-0">
                            {card.alt.toUpperCase()}
                        </span>

                    </div>

                </div>
            ))}
        </div>
    );
}