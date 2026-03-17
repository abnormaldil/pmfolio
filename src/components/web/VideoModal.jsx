'use client';
import { useState, useEffect, useRef } from 'react';
import { isEmbedUrl, getYouTubeEmbedUrl } from '@/lib/mediaHelpers';

export default function VideoModal({ url, onClose }) {
    const modalRef = useRef(null);
    const videoRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    useEffect(() => {
        const handleFSChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFSChange);
        return () => document.removeEventListener('fullscreenchange', handleFSChange);
    }, []);

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await modalRef.current?.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch { /* fullscreen may not be supported */ }
    };

    const isYouTube = isEmbedUrl(url) && (url.includes('youtube') || url.includes('youtu.be'));

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="absolute top-5 right-5 flex items-center gap-3 z-10">
                <button
                    onClick={toggleFullscreen}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                    style={{ fontFamily: 'Thedus-c', fontWeight: 700, fontSize: '12px', letterSpacing: '0.15em', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                    {isFullscreen ? (
                        <>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M5 1V4H1M11 1V4H15M5 15V12H1M11 15V12H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            EXIT FULLSCREEN
                        </>
                    ) : (
                        <>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M1 5V1H5M15 5V1H11M1 11V15H5M15 11V15H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            FULLSCREEN
                        </>
                    )}
                </button>
                <button
                    onClick={onClose}
                    className="flex items-center justify-center w-10 h-10 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                    style={{ border: '1px solid rgba(255,255,255,0.2)' }}
                    aria-label="Close"
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            <div className="w-full max-w-[90vw] max-h-[85vh] aspect-video rounded-xl overflow-hidden shadow-2xl">
                {isYouTube ? (
                    <iframe
                        src={getYouTubeEmbedUrl(url, true)}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                        allowFullScreen
                        title="Video"
                    />
                ) : (
                    <video
                        ref={videoRef}
                        src={url}
                        controls
                        autoPlay
                        playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
                    />
                )}
            </div>
        </div>
    );
}
