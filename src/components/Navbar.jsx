'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import gsap from 'gsap'
import PortfolioChatbot from '@/components/PortfolioChatbot';

export default function Navbar() {
    const [darkBg, setDarkBg] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [notifOpen, setNotifOpen] = useState(false)
    const [hasNotifications, setHasNotifications] = useState(false)
    const [notifSeen, setNotifSeen] = useState(false)

    const [chatOpen, setChatOpen] = useState(false)
    const handleChatClose = useCallback(() => setChatOpen(false), [])
    const leftNavRef = useRef(null)
    const centerNavRef = useRef(null)
    const rightNavRef = useRef(null)
    const navLinksRefs = useRef([])

    const navLinks = [
        { label: 'HOME', href: '/' },
        { label: 'ABOUT', href: '/#about' },
        { label: 'SERVICES', href: '/#services' },
        { label: 'PORTFOLIO', href: '/portfolio' },
        { label: 'CONTACT US', href: '/contact' },
    ]

    useEffect(() => {
        // Initial state: hidden above
        gsap.set([leftNavRef.current, centerNavRef.current, rightNavRef.current], {
            y: -100,
            opacity: 0
        });

        const startNavAnimation = () => {
            const tl = gsap.timeline();
            tl.to(
                [leftNavRef.current, centerNavRef.current, rightNavRef.current],
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: "power2.out",
                    delay: 0.3 // Slight delay after preloader split
                }
            );
        };

        if (window.preloaderFinished) {
            startNavAnimation();
        } else {
            window.addEventListener('finishLoading', startNavAnimation);
        }

        const handleScroll = () => {
            const navHeight = 90
            const sections = document.querySelectorAll('section')
            let overDark = false

            sections.forEach((section) => {
                const rect = section.getBoundingClientRect()
                if (rect.top < navHeight && rect.bottom > 0) {
                    const bg = window.getComputedStyle(section).backgroundColor
                    const match = bg.match(/\d+/g)
                    if (match) {
                        const [r, g, b] = match.map(Number)
                        const brightness = (r * 299 + g * 587 + b * 114) / 1000
                        if (brightness < 128) overDark = true
                    }
                }
            })

            setDarkBg(overDark)
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Lock body scroll when menu open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [menuOpen])

    // Drawer menu open animation with GSAP stagger
    useEffect(() => {
        if (menuOpen) {
            gsap.to(navLinksRefs.current, {
                x: 0,
                opacity: 1,
                duration: 0.4,
                stagger: 0.2,
                ease: "power3.in ",
                overwrite: "auto"
            })
        } else {
            gsap.to(navLinksRefs.current, {
                x: -30,
                opacity: 0,
                duration: 0.9,
                stagger: 0.1,
                ease: "power3.out",
                overwrite: "auto"
            })
        }
    }, [menuOpen])

    const navColor = darkBg ? 'white' : 'black'
    const dotBorder = darkBg ? '#0A0A0F' : '#EFEFEF'

    return (
        <>
            {/* ── Backdrop blur overlay — shown when menu open ── */}
            <div
                onClick={() => setMenuOpen(false)}
                className={clsx(
                    'fixed inset-0 z-40 transition-all duration-500',
                    menuOpen
                        ? 'opacity-100 pointer-events-auto backdrop-blur-md bg-black/30'
                        : 'opacity-0 pointer-events-none'
                )}
            />

            {/* ── Side Menu Drawer ── */}
            <div
                className={clsx(
                    'fixed top-0 left-0 h-full z-50 flex flex-col justify-center transition-transform duration-500 ease-in-out',
                    menuOpen ? 'translate-x-0' : '-translate-x-full'
                )}
                style={{
                    width: '430px',
                    paddingLeft: '25px',
                    paddingTop: '20px',
                    paddingBottom: '100px',
                }}
            >
                {/* Red nav items — each on its own red bar */}
                <nav className="flex flex-col gap-[6px] pl-6 w-full pr-12">
                    {navLinks.map((link, i) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            ref={(el) => (navLinksRefs.current[i] = el)}
                            className={clsx(
                                'group relative flex items-center justify-end pr-8 pl-4 py-3 bg-[#e03047] text-white uppercase overflow-hidden'
                            )}
                            style={{
                                width: `${50 + (i * 12.5)}%`,
                                minWidth: '180px',
                                fontFamily: 'Thedus-wl',
                                fontWeight: 700,
                                fontSize: 'clamp(22px, 3vw, 28px)',
                                letterSpacing: '0.18em',
                                transform: 'translateX(-30px)',
                                opacity: 0,
                            }}
                        >
                            {/* Curtain Top Half */}
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-white origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                            {/* Curtain Bottom Half */}
                            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />

                            {/* Text */}
                            <span className="relative z-10 group-hover:text-black transition-colors duration-400 delay-100">
                                {link.label}
                            </span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* ── Navbar ── */}
            <header
                data-theme={darkBg ? 'dark' : 'light'}
                className="fixed top-0 left-0 w-full z-50 bg-transparent"
            >
                <div className="max-w-[2200px] w-full mx-auto px-8 lg:px-16 h-[90px] flex items-center justify-between"
                    style={{
                        paddingLeft: 'var(--section-px)',
                        paddingRight: 'var(--section-px)',
                    }}>

                    {/* LEFT: Hamburger + Bell */}
                    <div ref={leftNavRef} className="flex-1 flex items-center gap-8">

                        {/* Hamburger — animates to X when open */}
                        <button
                            onClick={() => setMenuOpen(prev => !prev)}
                            className="group flex flex-col gap-[6px] relative z-[60]"
                            aria-label="Toggle menu"
                        >
                            <span
                                className="block h-[2px] transition-all duration-300 origin-center"
                                style={{
                                    backgroundColor: menuOpen ? 'white' : navColor,
                                    width: '28px',
                                    transform: menuOpen ? 'translateY(8px) rotate(45deg)' : 'none',
                                }}
                            />
                            <span
                                className="block h-[2px] transition-all duration-300"
                                style={{
                                    backgroundColor: menuOpen ? 'white' : navColor,
                                    width: '28px',
                                    opacity: menuOpen ? 0 : 1,
                                }}
                            />
                            <span
                                className="block h-[2px] transition-all duration-300 origin-center"
                                style={{
                                    backgroundColor: menuOpen ? 'white' : navColor,
                                    width: menuOpen ? '28px' : '18px',
                                    transform: menuOpen ? 'translateY(-8px) rotate(-45deg)' : 'none',
                                }}
                            />
                        </button>

                        {/* Bell with red dot + notification popover */}
                        <div className="relative">
                            <button
                                className="relative group"
                                onClick={() => {
                                    setNotifOpen(prev => !prev)
                                    setNotifSeen(true)
                                }}
                            >
                                <svg width="22" height="24" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M18 8C18 5.79 16.21 4 14 4H10C7.79 4 6 5.79 6 8V16L4 18V19H20V18L18 16V8Z"
                                        stroke={navColor}
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M10 19C10 20.1 10.9 21 12 21C13.1 21 14 20.1 14 19"
                                        stroke={navColor}
                                        strokeWidth="1.6"
                                    />
                                </svg>
                                {/* {!notifSeen && ( */}
                                {hasNotifications && !notifSeen && (
                                    <span
                                        className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#e03047] rounded-full border-2 transition-colors duration-300"
                                        style={{ borderColor: dotBorder }}
                                    />
                                )}
                            </button>

                            {/* Notification Popover */}
                            {notifOpen && (
                                <>
                                    {/* Invisible overlay to close on outside click */}
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setNotifOpen(false)}
                                    />
                                    <div
                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50"
                                        style={{
                                            minWidth: '240px',
                                            background: darkBg ? 'rgba(20,20,30,0.95)' : 'rgba(255,255,255,0.97)',
                                            backdropFilter: 'blur(12px)',
                                            border: `1px solid ${darkBg ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                                            borderRadius: '10px',
                                            boxShadow: darkBg
                                                ? '0 8px 32px rgba(0,0,0,0.5)'
                                                : '0 8px 32px rgba(0,0,0,0.12)',
                                            padding: '20px 18px',
                                            animation: 'notif-pop 0.25s ease forwards',
                                        }}
                                    >
                                        {/* Arrow */}
                                        <div
                                            className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
                                            style={{
                                                background: darkBg ? 'rgba(20,20,30,0.95)' : 'rgba(255,255,255,0.97)',
                                                borderLeft: `1px solid ${darkBg ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                                                borderTop: `1px solid ${darkBg ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                                            }}
                                        />
                                        <div className="flex flex-col items-center gap-2 text-center">
                                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3 }}>
                                                <path
                                                    d="M18 8C18 5.79 16.21 4 14 4H10C7.79 4 6 5.79 6 8V16L4 18V19H20V18L18 16V8Z"
                                                    stroke={navColor}
                                                    strokeWidth="1.4"
                                                />
                                            </svg>
                                            <p
                                                style={{
                                                    fontFamily: 'Thedus-wl',
                                                    fontWeight: 700,
                                                    fontSize: '11px',
                                                    letterSpacing: '0.15em',
                                                    textTransform: 'uppercase',
                                                    color: darkBg ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
                                                    margin: 0,
                                                }}
                                            >
                                                No new notifications
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* CENTER LOGO */}
                    <div ref={centerNavRef} className="absolute left-1/2 -translate-x-1/2">
                        <Link href="/" className="relative block w-14 h-14 hover:scale-105 transition-transform duration-300">
                            <Image
                                src="/hero/logo red.svg"
                                alt="Company Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    {/* RIGHT: Contact Us */}
                    <nav ref={rightNavRef} className="flex-1 flex justify-end">
                        <Link
                            href="/contact"
                            className="group flex items-center gap-1 sm:gap-2"
                            style={{
                                fontFamily: 'Thedus, sans-serif',
                                fontWeight: 700,
                                letterSpacing: '0.2em',
                                color: navColor,
                                textDecoration: 'none',
                                fontSize: 'clamp(11px, 1.05vw, 15px)',
                            }}
                        >
                            <span className="uppercase transition-colors duration-300"
                                style={{
                                    fontFamily: 'Thedus-wl',
                                    fontWeight: 300,
                                    fontSize: 'clamp(19px, 1.2vw, 24px)',
                                }}>
                                CONTACT</span>

                            <span className="relative inline-flex items-center justify-center">
                                {/* Solid red square background on hover */}
                                <span className="absolute inset-x-[-3px] inset-y-[2px] bg-[#e03047] scale-0 group-hover:scale-100 transition-transform duration-300 ease-in-out"
                                />
                                {/* Text */}
                                <span className="relative uppercase px-[0.38em] py-[0.1em] group-hover:text-white transition-colors duration-300 z-10"
                                    style={{
                                        fontFamily: 'Thedus-wl',
                                        fontWeight: 300,
                                        fontSize: 'clamp(19px, 1.2vw, 24px)',
                                    }}>
                                    US
                                </span>
                            </span>
                        </Link>
                    </nav>

                </div>

                {/* </div> */}
            </header>

            {/* Floating Chatbot Button (Bottom Left) */}
            <button
                onClick={() => setChatOpen(true)}
                className="fixed bottom-6 right-6 md:bottom-5 md:right-6 z-[60] group flex items-center justify-center w-14 h-14 bg-[#e03047] rounded-full shadow-[0_4px_20px_rgba(224,48,71,0.4)] transition-transform duration-300 hover:scale-110 cursor-pointer"
                aria-label="Open chatbot"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="chatbot" className="w-8 h-8">
                    <path fill="#ffffff" d="M5 9.25h-.253c-1.377 0-2.497 1.121-2.497 2.498v2.505c0 1.377 1.12 2.497 2.497 2.497h.253c.965 0 1.75-.785 1.75-1.75v-4c0-.965-.785-1.75-1.75-1.75zM19.253 9.25h-.253c-.965 0-1.75.785-1.75 1.75v4c0 .965.785 1.75 1.75 1.75h.253c1.377 0 2.497-1.12 2.497-2.497v-2.505c0-1.377-1.12-2.498-2.497-2.498z"></path>
                    <rect width="13.5" height="12.5" x="5.25" y="6.25" fill="#ffffff" rx="2.75" ry="2.75"></rect>
                    <path fill="#e03047" d="m10,12.75c-.414,0-.75-.336-.75-.75v-1c0-.414.336-.75.75-.75s.75.336.75.75v1c0,.414-.336.75-.75.75Zm11.75-1.002v2.505c0,1.377-1.12,2.497-2.497,2.497h-.253c-.026,0-.05-.007-.076-.008-.366,2.821-2.778,5.008-5.697,5.008h-1.228c-.414,0-.75-.336-.75-.75s.336-.75.75-.75h1.228c1.31,0,2.468-.608,3.249-1.542-.155.027-.313.042-.476.042h-8c-1.268,0-2.328-.867-2.644-2.037-.115.024-.234.037-.356.037h-.253c-1.377,0-2.497-1.12-2.497-2.497v-2.505c0-1.219.879-2.233,2.036-2.451.357-3.945,3.678-7.047,7.714-7.047s7.357,3.102,7.714,7.047c1.157.218,2.036,1.232,2.036,2.451Zm-16.5-.748c0-.138-.112-.25-.25-.25h-.253c-.55,0-.997.447-.997.998v2.505c0,.55.447.997.997.997h.253c.138,0,.25-.112.25-.25v-4Zm1.552-4.464c.364-.178.767-.286,1.198-.286h8c.432,0,.835.109,1.198.286-1.122-1.678-3.033-2.786-5.198-2.786s-4.077,1.108-5.198,2.786Zm9.198,10.714c.689,0,1.25-.561,1.25-1.25v-7c0-.689-.561-1.25-1.25-1.25h-8c-.689,0-1.25.561-1.25,1.25v7c0,.689.561,1.25,1.25,1.25h8Zm4.25-5.502c0-.55-.447-.998-.997-.998h-.253c-.138,0-.25.112-.25.25v4c0,.138.112.25.25.25h.253c.55,0,.997-.447.997-.997v-2.505Zm-6.25-1.498c-.414,0-.75.336-.75.75v1c0,.414.336.75.75.75s.75-.336.75-.75v-1c0-.414-.336-.75-.75-.75Zm-1,4h-2c-.414,0-.75.336-.75.75s.336.75.75.75h2c.414,0,.75-.336.75-.75s-.336-.75-.75-.75Z"></path>
                </svg>
            </button>

            {/* Chatbot Modal */}
            <PortfolioChatbot isOpen={chatOpen} onClose={handleChatClose} />
        </>
    )
}
