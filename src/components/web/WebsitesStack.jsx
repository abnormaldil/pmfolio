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
        <div ref={containerRef} className="w-full flex flex-col">
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
                    <div className="w-full rounded-2xl overflow-hidden" style={{ background: '#1a1a2e', minHeight: '520px' }}>
                        <div className="flex justify-between items-center px-10 py-6">
                            <p className="uppercase tracking-[0.2em] text-white"
                                style={{ fontFamily: 'Thedus-c', fontWeight: 700, fontSize: 'clamp(11px, 1vw, 14px)' }}>
                                TOOLS USED :&nbsp;
                                <span style={{ color: '#aaa', fontWeight: 400, letterSpacing: '0.1em' }}>{site.tools}</span>
                            </p>
                            {site.liveUrl && (
                                <a href={site.liveUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-3 uppercase text-white hover:opacity-80 transition-opacity"
                                    style={{ fontFamily: 'Thedus-c', fontWeight: 700, fontSize: 'clamp(11px, 1vw, 14px)', letterSpacing: '0.2em', textDecoration: 'none' }}>
                                    VISIT LIVE
                                    <span className="flex items-center justify-center w-9 h-9 bg-[#D00000] rounded">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M3 13L13 3M13 3H6M13 3V10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                                    <div className="mx-8 mb-8 rounded-xl flex items-center justify-center"
                                        style={{ minHeight: '400px', background: cardGradients[i % cardGradients.length] }}>
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
