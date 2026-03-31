'use client';
import { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { cleanUrl, isEmbedUrl, getYouTubeThumbnail } from '@/lib/mediaHelpers';
import CreativeProjectModal from './CreativeProjectModal';

export default function CreativeDetail({ categoryItem, items, onClose, detailRedRef, detailIconRef }) {
    const [selectedProject, setSelectedProject] = useState(null);
    const containerRef = useRef(null);

    // useGSAP(() => {
    //     const cards = gsap.utils.toArray('.project-card');
    //     if (cards.length > 0) {
    //         gsap.fromTo(cards,
    //             { y: 80, opacity: 0 },
    //             {
    //                 y: 0,
    //                 opacity: 1,
    //                 duration: 0.8,
    //                 stagger: 0.2,
    //                 ease: 'power3.out',
    //                 delay: 0.2,
    //                 overwrite: 'auto'
    //             }
    //         );
    //     }
    // }, { scope: containerRef, dependencies: [items] });
    useGSAP(() => {

        const q = gsap.utils.selector(containerRef);
        const cards = q('.project-card');

        const tl = gsap.timeline();

        tl.from(cards, {
            y: 80,
            opacity: 0,
            duration: 0.8,
            stagger: 0.18,
            delay: 0.5,
            ease: "power3.out"
        });

    }, { scope: containerRef });

    useEffect(() => {
        // Delay refresh slightly to ensure DOM layout has fully settled (pin spacers removed, etc)
        const timeoutId = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);
        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full creative-detail-wrapper"
            data-lenis-prevent="true"
            style={{
                display: 'flex',
                flexDirection: 'row',
                position: 'fixed',
                inset: 0,
                zIndex: 100,
                backgroundColor: '#ffffff',
                overflowY: 'auto',
                overflowX: 'hidden'
            }}
        >
            <button
                onClick={onClose}
                className="fixed flex items-center justify-center border border-black/20 hover:bg-black/5 transition-colors"
                style={{ top: 0, left: 0, width: '56px', height: '56px', zIndex: 110, background: 'white' }}
                aria-label="Close"
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 4L16 16M16 4L4 16" stroke="black" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>

            <div
                ref={detailIconRef}
                className="flex-shrink-0 flex items-center justify-center relative z-10 creative-detail-icon-wrap"
                style={{
                    width: '320px',
                    zIndex: 5,
                    marginRight: '-80px',
                    padding: '0px',
                    backgroundColor: 'transparent'
                }}
            >
                <div
                    className="flex items-center justify-center creative-detail-icon-circle"
                    style={{
                        width: '600px',
                        height: '600px',
                    }}
                >
                    <Image
                        src={categoryItem.icon}
                        alt={categoryItem.key}
                        width={400}
                        height={400}
                        className="object-contain drop-shadow-2xl"
                        priority
                    />
                </div>
            </div>

            <div
                ref={detailRedRef}
                className="flex-1 flex flex-col justify-start creative-detail-red-wrap"
                style={{
                    backgroundColor: '#e03047',
                    paddingTop: '50px',
                    paddingRight: '60px',
                    paddingBottom: '60px',
                    paddingLeft: '120px',
                    minHeight: '100vh',
                    height: 'max-content'
                }}
            >
                <h3
                    className="uppercase text-white leading-none creative-detail-title"
                    style={{
                        fontFamily: 'Thedus-wl',
                        fontWeight: 300,
                        fontSize: 'clamp(40px, 5vw, 70px)',
                        letterSpacing: '0.05em',
                        marginBottom: '48px',
                        paddingBottom: '25px'
                    }}
                >
                    {categoryItem.displayLabel.map((line, i) => (
                        <span key={i} style={{ display: 'block' }}>{line}</span>
                    ))}
                </h3>

                {items.length > 0 ? (
                    <div
                        className="creative-detail-grid"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                            gap: '32px',
                            paddingRight: '32px'
                        }}
                    >
                        {items.map((item) => {
                            const imageUrl = cleanUrl(item.images);
                            const videoUrl = cleanUrl(item.videos);
                            const thumbUrl = imageUrl
                                || (videoUrl && isEmbedUrl(videoUrl) ? getYouTubeThumbnail(videoUrl) : null);

                            return (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedProject(item)}
                                    className="project-card flex flex-col gap-3 cursor-pointer group"
                                >
                                    <div
                                        className="rounded-xl overflow-hidden relative group-hover:shadow-[0_30px_70px_rgba(0,0,0,0.5)] transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
                                        style={{ aspectRatio: '3/4', backgroundColor: '#111' }}
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
                                    <p className="text-white uppercase tracking-[0.15em] text-xs font-semibold pl-1 transition-colors duration-300 group-hover:text-white/80" style={{ fontFamily: 'Thedus-wl' }}>
                                        {item.Title}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-white/50 uppercase tracking-[0.2em] text-sm" style={{ fontFamily: 'Thedus-wl' }}>
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
