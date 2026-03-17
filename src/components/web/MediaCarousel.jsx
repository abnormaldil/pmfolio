'use client';
import { useState, useEffect, useRef } from 'react';
import VideoPlayer from './VideoPlayer';

export default function MediaCarousel({ slides }) {
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef(null);

    const total = slides.length;
    const isVideo = slides[current]?.type === 'video';

    useEffect(() => {
        if (total <= 1 || isPaused || isVideo) return;
        timerRef.current = setInterval(() => {
            setCurrent(prev => (prev + 1) % total);
        }, 4000);
        return () => clearInterval(timerRef.current);
    }, [current, total, isPaused, isVideo]);

    const goTo = (idx) => setCurrent(idx);
    const goPrev = () => setCurrent((current - 1 + total) % total);
    const goNext = () => setCurrent((current + 1) % total);

    return (
        <div
            className="w-full overflow-hidden relative flex-1"
            style={{ background: '#000', borderRadius: '24px' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="relative w-full h-full" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                {slides.map((slide, idx) => (
                    <div
                        key={slide.key}
                        className="absolute inset-0 transition-opacity duration-500"
                        style={{ opacity: idx === current ? 1 : 0, pointerEvents: idx === current ? 'auto' : 'none' }}
                    >
                        {slide.type === 'image' ? (
                            <div className="relative w-full h-full" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                <img
                                    src={slide.url}
                                    alt={`Slide ${idx + 1}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                                />
                            </div>
                        ) : (
                            <VideoPlayer url={slide.url} />
                        )}
                    </div>
                ))}
            </div>

            {total > 1 && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); goPrev(); }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
                        aria-label="Previous"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); goNext(); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
                        aria-label="Next"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M9 6L15 12L9 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </>
            )}

            {total > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
                    {slides.map((slide, idx) => (
                        <button
                            key={slide.key}
                            onClick={(e) => { e.stopPropagation(); goTo(idx); }}
                            className="transition-all duration-300"
                            style={{
                                width: idx === current ? '24px' : '8px',
                                height: '8px',
                                borderRadius: '4px',
                                backgroundColor: idx === current ? '#e03047' : 'rgba(255,255,255,0.5)',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
