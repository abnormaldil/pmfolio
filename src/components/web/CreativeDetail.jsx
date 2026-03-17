'use client';
import { useState, useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cleanUrl, isEmbedUrl, getYouTubeThumbnail } from '@/lib/mediaHelpers';
import CreativeProjectModal from './CreativeProjectModal';

export default function CreativeDetail({ categoryItem, items, onClose }) {
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        // Delay refresh slightly to ensure DOM layout has fully settled (pin spacers removed, etc)
        const timeoutId = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);
        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <div className="w-full flex" style={{ minHeight: '80vh', position: 'relative' }}>
            <button
                onClick={onClose}
                className="absolute flex items-center justify-center border border-black/20 hover:bg-black/5 transition-colors"
                style={{ top: 0, left: 0, width: '56px', height: '56px', zIndex: 10, background: 'white' }}
                aria-label="Close"
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 4L16 16M16 4L4 16" stroke="black" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>

            <div
                className="flex-shrink-0 flex items-center justify-center"
                style={{ width: '320px', zIndex: 5, marginRight: '-80px' }}
            >
                <div
                    className="flex items-center justify-center rounded-full"
                    style={{
                        width: '300px',
                        height: '300px',
                        background: 'radial-gradient(circle at 35% 35%, #4a4a4a, #1a1a1a)',
                        boxShadow: '0 30px 80px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.12)',
                    }}
                >
                    {categoryItem.icon}
                </div>
            </div>

            <div
                className="flex-1 flex flex-col justify-start"
                style={{ backgroundColor: '#D00000', padding: '60px 60px 60px 120px' }}
            >
                <h3
                    className="uppercase text-white leading-none mb-12"
                    style={{
                        fontFamily: 'Thedus, sans-serif',
                        fontWeight: 700,
                        fontSize: 'clamp(40px, 5vw, 70px)',
                        letterSpacing: '0.05em',
                    }}
                >
                    {categoryItem.displayLabel.map((line, i) => (
                        <span key={i} style={{ display: 'block' }}>{line}</span>
                    ))}
                </h3>

                {items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pr-8">
                        {items.map((item) => {
                            const imageUrl = cleanUrl(item.images);
                            const videoUrl = cleanUrl(item.videos);
                            const thumbUrl = imageUrl
                                || (videoUrl && isEmbedUrl(videoUrl) ? getYouTubeThumbnail(videoUrl) : null);

                            return (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedProject(item)}
                                    className="flex flex-col gap-3 cursor-pointer group"
                                >
                                    <div
                                        className="rounded-xl overflow-hidden relative transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
                                        style={{ aspectRatio: '16/10', backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)' }}
                                    >
                                        <div className="w-full h-full transform transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105">
                                            {thumbUrl ? (
                                                <img
                                                    src={thumbUrl}
                                                    alt={`Thumbnail for ${item.Title || 'Creative Project'}`}
                                                    loading="lazy"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : videoUrl ? (
                                                <video src={videoUrl} muted preload="metadata" aria-label={`Video for ${item.Title || 'Creative Project'}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : null}
                                        </div>

                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]">
                                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-2xl">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                        <path d="M15 3H21V9M21 3L13 11M10 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21H17C18.1046 21 19 20.1046 19 19V14" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-white uppercase tracking-[0.15em] text-xs font-semibold pl-1 transition-colors duration-300 group-hover:text-white/80" style={{ fontFamily: 'Thedus-cl' }}>
                                        {item.Title}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-white/50 uppercase tracking-[0.2em] text-sm" style={{ fontFamily: 'Thedus-cl' }}>
                        No projects added yet
                    </p>
                )}
            </div>

            {selectedProject && (
                <CreativeProjectModal
                    item={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </div>
    );
}
