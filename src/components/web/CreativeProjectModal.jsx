'use client';
import { useState, useEffect, useCallback } from 'react';
import { cleanUrl, isEmbedUrl, getYouTubeEmbedUrl } from '@/lib/mediaHelpers';

export default function CreativeProjectModal({ item, onClose }) {
    const [current, setCurrent] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    const slides = [];
    if (item.images) {
        const imgs = Array.isArray(item.images) ? item.images : [item.images];
        imgs.forEach((img, idx) => {
            const url = cleanUrl(img);
            if (url) slides.push({ type: 'image', url, key: `img-${idx}` });
        });
    }
    if (item.videos) {
        const vids = Array.isArray(item.videos) ? item.videos : [item.videos];
        vids.forEach((vid, idx) => {
            const url = cleanUrl(vid);
            if (url) slides.push({ type: 'video', url, key: `vid-${idx}` });
        });
    }

    const total = slides.length;
    const goPrev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);
    const goNext = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);

    useEffect(() => {
        // Trigger entrance animation
        requestAnimationFrame(() => setIsVisible(true));

        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'ArrowRight') goNext();
        };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [onClose, goPrev, goNext]);

    const checkYouTube = (url) => isEmbedUrl(url) && (url.includes('youtube') || url.includes('youtu.be'));

    return (
        <>
            {/* Premium CSS Keyframes */}
            <style jsx global>{`
                @keyframes modal-border-glow {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.7; }
                }
                @keyframes modal-gradient-rotate {
                    0% { --angle: 0deg; }
                    100% { --angle: 360deg; }
                }
                @keyframes close-ring-pulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(224,48,71,0.4); }
                    50% { box-shadow: 0 0 0 8px rgba(224,48,71,0); }
                }
                @keyframes dot-glow {
                    0%, 100% { box-shadow: 0 0 4px 1px rgba(224,48,71,0.3); }
                    50% { box-shadow: 0 0 8px 3px rgba(224,48,71,0.6); }
                }
                @keyframes counter-fade-in {
                    from { opacity: 0; transform: translateY(-4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
                style={{
                    backgroundColor: isVisible ? 'rgba(10,10,15,0.85)' : 'rgba(10,10,15,0)',
                    backdropFilter: isVisible ? 'blur(20px)' : 'blur(0px)',
                    transition: 'background-color 0.5s ease, backdrop-filter 0.5s ease',
                }}
                onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            >
                {/* Close Button — with pulse ring on hover */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 lg:top-8 lg:right-8 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white hover:bg-[#e03047] hover:scale-110 transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] backdrop-blur-md shadow-2xl group"
                    aria-label="Close"
                    style={{ animation: 'close-ring-pulse 2s ease-in-out infinite' }}
                >
                    <svg className="transition-transform duration-300 group-hover:rotate-90" width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Modal Container */}
                <div
                    className="w-full max-w-[1200px] max-h-[92vh] mx-auto flex flex-col gap-4 items-center"
                    style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(16px)',
                        transition: 'opacity 0.6s cubic-bezier(0.19,1,0.22,1), transform 0.6s cubic-bezier(0.19,1,0.22,1)',
                    }}
                >
                    {/* Title + Description */}
                    <div className="w-full text-center flex flex-col items-center justify-center shrink-0">
                        {item.Title && (
                            <h3
                                className="uppercase text-white leading-[0.9] mb-2"
                                style={{ fontFamily: 'Humane-rg', fontSize: 'clamp(40px, 6vw, 80px)', letterSpacing: '0.04em' }}
                            >
                                {item.Title}
                            </h3>
                        )}
                        {item.description && (
                            <p className="text-white/70 text-xs md:text-sm leading-relaxed max-w-[700px] mx-auto uppercase tracking-[0.1em]" style={{ fontFamily: 'Thedus-wl' }}>
                                {item.description}
                            </p>
                        )}
                    </div>

                    {/* Media Container — with animated gradient border */}
                    {total > 0 && (
                        <div className="w-full flex justify-center items-center">
                            <div
                                className="relative w-full max-w-[1200px] rounded-2xl overflow-hidden shadow-2xl"
                                style={{
                                    padding: '1px',
                                    background: 'linear-gradient(135deg, rgba(224,48,71,0.3), rgba(255,255,255,0.05) 40%, rgba(224,48,71,0.15) 60%, rgba(255,255,255,0.05))',
                                    
                                }}
                            >
                                <div
                                    className="relative w-full h-[60vh] md:h-[70vh] rounded-2xl overflow-hidden"
                                    style={{ backgroundColor: '#050505' }}
                                >
                                    {/* Slides */}
                                    {slides.map((slide, idx) => (
                                        <div
                                            key={slide.key}
                                            className="absolute inset-0"
                                            style={{
                                                opacity: idx === current ? 1 : 0,
                                                pointerEvents: idx === current ? 'auto' : 'none',
                                                transform: idx === current ? 'scale(1)' : 'scale(1.03)',
                                                transition: 'opacity 0.8s cubic-bezier(0.19,1,0.22,1), transform 0.8s cubic-bezier(0.19,1,0.22,1)',
                                            }}
                                        >
                                            {slide.type === 'image' ? (
                                                <img
                                                    src={slide.url}
                                                    alt={item.Title ? `Slide ${idx + 1} of ${item.Title}` : `Creative Project Slide ${idx + 1}`}
                                                    loading="lazy"
                                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                />
                                            ) : checkYouTube(slide.url) ? (
                                                <iframe
                                                    src={getYouTubeEmbedUrl(slide.url, true)}
                                                    style={{ width: '100%', height: '100%', border: 'none' }}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                                    allowFullScreen
                                                    title={item.Title ? `YouTube Video: ${item.Title}` : "YouTube Video"}
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <video
                                                    src={slide.url}
                                                    controls
                                                    aria-label={item.Title ? `Video: ${item.Title}` : "Video Player"}
                                                    autoPlay={idx === current}
                                                    playsInline
                                                    preload="metadata"
                                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                />
                                            )}
                                        </div>
                                    ))}

                                    {/* Slide Counter Badge — top right */}
                                    {total > 1 && (
                                        <div
                                            key={current}
                                            className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full backdrop-blur-md border border-white/10"
                                            style={{
                                                backgroundColor: 'rgba(0,0,0,0.5)',
                                                fontFamily: 'Thedus-wl',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                letterSpacing: '0.15em',
                                                color: 'rgba(255,255,255,0.7)',
                                                animation: 'counter-fade-in 0.4s ease forwards',
                                            }}
                                        >
                                            {current + 1} / {total}
                                        </div>
                                    )}

                                    {/* Nav Arrows */}
                                    {total > 1 && (
                                        <>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-white hover:text-black flex items-center justify-center text-white transition-all duration-300 hover:scale-110 group"
                                            >
                                                <svg className="transition-transform duration-300 group-hover:-translate-x-0.5" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); goNext(); }}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-white hover:text-black flex items-center justify-center text-white transition-all duration-300 hover:scale-110 group"
                                            >
                                                <svg className="transition-transform duration-300 group-hover:translate-x-0.5" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                    <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pagination Dots — with glow effect on active */}
                    {total > 1 && (
                        <div className="shrink-0 flex items-center gap-3 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                            {slides.map((slide, idx) => (
                                <button
                                    key={slide.key}
                                    onClick={(e) => { e.stopPropagation(); setCurrent(idx); }}
                                    style={{
                                        width: idx === current ? '24px' : '6px',
                                        height: '6px',
                                        borderRadius: '3px',
                                        backgroundColor: idx === current ? '#e03047' : 'rgba(255,255,255,0.4)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.5s cubic-bezier(0.19,1,0.22,1)',
                                        animation: idx === current ? 'dot-glow 2s ease-in-out infinite' : 'none',
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

