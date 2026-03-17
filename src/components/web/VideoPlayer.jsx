'use client';
import { useState, useRef, useCallback } from 'react';
import { cleanUrl, isEmbedUrl, getYouTubeThumbnail, getYouTubeEmbedUrl } from '@/lib/mediaHelpers';
import VideoModal from './VideoModal';

export default function VideoPlayer({ url: rawUrl, className = '' }) {
    const [showModal, setShowModal] = useState(false);
    const videoRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);

    const handleClose = useCallback(() => setShowModal(false), []);

    const url = cleanUrl(rawUrl);
    if (!url) return null;

    const isYouTube = isEmbedUrl(url) && (url.includes('youtube') || url.includes('youtu.be'));
    const thumbnail = isYouTube ? getYouTubeThumbnail(url) : null;

    return (
        <>
            <div
                className={`relative w-full h-full cursor-pointer group ${className}`}
                onMouseEnter={() => {
                    setIsHovered(true);
                    if (!isYouTube && videoRef.current) videoRef.current.play().catch(() => { });
                }}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setIframeLoaded(false);
                    if (!isYouTube && videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
                }}
                onClick={() => setShowModal(true)}
                style={{ minHeight: '100%' }}
            >
                {isYouTube ? (
                    <div className="absolute inset-0">
                        {isHovered && (
                            <iframe
                                src={getYouTubeEmbedUrl(url, true)}
                                className="absolute inset-0 w-full h-full z-20"
                                style={{ border: 'none', pointerEvents: 'none' }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                title="Video preview"
                                onLoad={() => setIframeLoaded(true)}
                            />
                        )}
                        {(!isHovered || !iframeLoaded) && (
                            <div className="absolute inset-0 z-10">
                                {thumbnail && (
                                    <img
                                        src={thumbnail}
                                        alt="Video thumbnail"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                )}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors duration-300">
                                    <div
                                        className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#e03047] flex items-center justify-center transition-transform duration-300"
                                        style={{ transform: isHovered ? 'scale(1.15)' : 'scale(1)' }}
                                    >
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <video
                            ref={videoRef}
                            src={url}
                            muted
                            playsInline
                            preload="metadata"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div
                            className="absolute inset-0 flex items-center justify-center z-10 transition-all duration-300"
                            style={{ backgroundColor: isHovered ? 'transparent' : 'rgba(0,0,0,0.25)', opacity: isHovered ? 0 : 1 }}
                        >
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#e03047] flex items-center justify-center">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                    </>
                )}
            </div>
            {showModal && <VideoModal url={url} onClose={handleClose} />}
        </>
    );
}
