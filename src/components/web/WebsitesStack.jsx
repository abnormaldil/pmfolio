'use client';
import { useState, useEffect, useRef } from 'react';
import { cleanUrl, cardGradients } from '@/lib/mediaHelpers';
import MediaCarousel from './MediaCarousel';

export default function WebsitesStack({ websites }) {
    const containerRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const cards = containerRef.current.querySelectorAll('.stack-card');
            cards.forEach((card, i) => {
                const rect = card.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
                    setActiveIndex(i);
                }
            });
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div ref={containerRef} className="w-full flex flex-col ">
            {websites.map((site, i) => (
                <div
                    key={site.id}
                    className="stack-card w-full"
                    style={{
                        position: 'sticky',
                        top: `${80 + i * 24}px`,
                        zIndex: i + 1,
                        transform: activeIndex > i ? `scale(${1 - (activeIndex - i) * 0.03})` : 'scale(1)',
                        transition: 'transform 0.4s ease',
                        transformOrigin: 'top center',
                    }}
                >
                    <div className="webstack-card-container w-full flex flex-col" style={{ background: '#0a0a0a', borderRadius: '32px', aspectRatio: '16/9', padding: '56px' }}>
                        <div className="webstack-header flex justify-between items-center w-full shrink-0" style={{ paddingBottom: '40px' }}>
                            <p className="uppercase tracking-[0.2em] text-white"
                                style={{ fontFamily: 'Thedus-wl', fontWeight: 500, fontSize: 'clamp(10px, 1.5vw, 20px)' }}>
                                TOOLS USED :&nbsp;
                                <span style={{ color: '#aaa', fontWeight: 400, letterSpacing: '0.1em' }}>{site.tools}</span>
                            </p>
                            {site.link && (
                                <a href={site.link} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-4 uppercase text-white hover:opacity-80 transition-opacity"
                                    style={{ fontFamily: 'Thedus-wl', fontWeight: 500, fontSize: 'clamp(10px, 1.5vw, 20px)', letterSpacing: '0.2em', textDecoration: 'none' }}>
                                    VISIT LIVE
                                    <span className="flex items-center justify-center bg-[#e03047] rounded hover:scale-105 transition-transform shrink-0" style={{ width: '40px', height: '40px' }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </a>
                            )}
                        </div>
                        {(() => {
                            const slides = [];
                            const images = Array.isArray(site.image) ? site.image : (site.image ? [site.image] : []);
                            const video = cleanUrl(site.video);
                            images.forEach((img, idx) => {
                                const imgUrl = cleanUrl(img);
                                if (imgUrl) slides.push({ type: 'image', url: imgUrl, key: `img-${idx}` });
                            });
                            if (video) slides.push({ type: 'video', url: video, key: 'video' });

                            if (slides.length === 0) {
                                return (
                                    <div className="w-full overflow-hidden flex items-center justify-center flex-1"
                                        style={{ background: cardGradients[i % cardGradients.length], borderRadius: '24px' }}>
                                        <p className="text-white/30 uppercase tracking-[0.3em]"
                                            style={{ fontFamily: 'Thedus, sans-serif', fontWeight: 700, fontSize: '13px' }}>
                                            {site.Title}
                                        </p>
                                    </div>
                                );
                            }
                            return <MediaCarousel slides={slides} />;
                        })()}
                    </div>
                </div>
            ))}
        </div>
    );
}
