'use client';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle');

    /* ── refs ── */
    const sectionRef = useRef(null);
    const line1Ref = useRef(null);
    const line2Ref = useRef(null);
    const line3Ref = useRef(null);
    const formBoxRef = useRef(null);
    const formInnerRef = useRef(null);

    /* ── GSAP scroll animations ── */
    useEffect(() => {
        const init = () => {
            const ctx = gsap.context(() => {

                /* ── headline: scroll-scrub word color fill ── */
                const allWords = sectionRef.current?.querySelectorAll('.word-fill') || [];
                // Start dim, fill to white on scroll
                if (allWords.length) {
                    gsap.to(allWords, {
                        color: '#ffffff',
                        ease: 'power1.in',
                        stagger: 1,
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top 70%',
                            end: 'center center',
                            scrub: true,
                        },
                    });
                }

                /* ── each headline line slides up with 3D rotation ── */
                const lines = [line1Ref.current, line2Ref.current, line3Ref.current].filter(Boolean);
                gsap.set(lines, {
                    y: 100,
                    opacity: 0,
                    rotateX: -20,
                    transformPerspective: 1000,
                    transformOrigin: 'bottom center',
                });

                gsap.to(lines, {
                    y: 0,
                    opacity: 1,
                    rotateX: 0,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse',
                    },
                });

                /* ── form box: slow clipPath reveal from bottom ── */
                if (formBoxRef.current) {
                    gsap.set(formBoxRef.current, {
                        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
                        opacity: 0,
                    });

                    gsap.to(formBoxRef.current, {
                        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                        opacity: 1,
                        duration: 1.2,
                        ease: 'circ.inOut',
                        scrollTrigger: {
                            trigger: formBoxRef.current,
                            start: 'top 80%',
                            toggleActions: 'play none none reverse',
                        },
                    });
                }

                /* ── form fields stagger in after box reveals ── */
                const fields = formInnerRef.current?.querySelectorAll('.form-field') || [];
                const btns = formInnerRef.current?.querySelectorAll('.form-btn') || [];

                if (fields.length) {
                    gsap.set(fields, { y: 50, opacity: 0 });
                    gsap.to(fields, {
                        y: 0,
                        opacity: 1,
                        duration: 0.7,
                        stagger: 0.12,
                        ease: 'power3.out',
                        delay: 0.5,
                        scrollTrigger: {
                            trigger: formBoxRef.current,
                            start: 'top 75%',
                            toggleActions: 'play none none reverse',
                        },
                    });
                }

                if (btns.length) {
                    gsap.set(btns, { y: 30, opacity: 0, scale: 0.92 });
                    gsap.to(btns, {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.6,
                        stagger: 0.08,
                        ease: 'back.out(1.4)',
                        delay: 1,
                        scrollTrigger: {
                            trigger: formBoxRef.current,
                            start: 'top 75%',
                            toggleActions: 'play none none reverse',
                        },
                    });
                }

            }, sectionRef);

            return () => ctx.revert();
        };

        let cleanup;
        if (typeof document !== 'undefined' && document.fonts) {
            document.fonts.ready.then(() => { cleanup = init(); });
        } else {
            cleanup = init();
        }
        return () => { if (cleanup) cleanup(); };
    }, []);

    /* ── form logic ── */
    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Name is required';
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!EMAIL_REGEX.test(form.email)) errs.email = 'Enter a valid email';
        if (!form.message.trim()) errs.message = 'Message is required';
        return errs;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setErrors({});
        setStatus('sending');
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000);
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
                signal: controller.signal,
            });
            clearTimeout(timeout);
            let data;
            try { data = await res.json(); } catch { throw new Error('Server returned an unexpected response.'); }
            if (!res.ok) throw new Error(data.error || 'Failed to send message');
            setStatus('sent');
            setForm({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('[Contact Form]', error.message);
            setStatus('error');
            setErrors({
                submit: error.name === 'AbortError'
                    ? 'Request timed out. Please check your connection and try again.'
                    : error.message || 'Something went wrong. Please try again.',
            });
        }
    };

    /* ── styles ── */
    const labelStyle = {
        fontFamily: 'Thedus-wd',
        fontWeight: 400,
        fontSize: 'clamp(12px, 1vw, 14px)',
        letterSpacing: '0.15em',
        color: 'white',
        display: 'block',
        marginBottom: '12px',
        textTransform: 'uppercase',
    };

    const inputStyle = {
        width: '100%',
        backgroundColor: '#111111',
        border: '1px solid #333333',
        borderRadius: '0px',
        padding: '16px 20px',
        color: 'white',
        outline: 'none',
        fontFamily: 'Geist, sans-serif',
        fontSize: '14px',
        transition: 'border-color 0.3s ease',
    };

    const errorInputStyle = { ...inputStyle, borderColor: '#D00000' };

    const btnBase = {
        fontFamily: 'Thedus-wd',
        fontWeight: 400,
        fontSize: 'clamp(12px, 1vw, 14px)',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        padding: '16px 32px',
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
        transition: 'all 0.3s ease',
        borderRadius: '0px',
    };

    /* dim starting color for the scroll-fill effect */
    const dimColor = 'rgba(255,255,255,0.15)';

    const headlineStyle = {
        fontFamily: 'Humane-rg',
        fontSize: 'clamp(100px, 16vw, 220px)',
    };

    return (
        <section
            id="contact-us"
            ref={sectionRef}
            className="section-container relative w-full min-h-screen bg-[#0A0A0F] flex items-center justify-center overflow-hidden"
            style={{ paddingTop: '90px' }}
        >
            <div className="w-full max-w-[1300px] grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">

                {/* ── Left: Headline ── */}
                <div className="flex flex-col leading-[0.8] tracking-[-0.02em]" style={{ overflow: 'hidden' }}>
                    <span
                        ref={line1Ref}
                        className="uppercase block"
                        style={{ ...headlineStyle, color: dimColor }}
                    >
                        {'LEAVE'.split('').map((ch, i) => (
                            <span key={i} className="inline-block word-fill" style={{ color: dimColor }}>{ch}</span>
                        ))}
                    </span>
                    <span
                        ref={line2Ref}
                        className="uppercase block"
                        style={{ ...headlineStyle, color: dimColor }}
                    >
                        {'YOUR'.split('').map((ch, i) => (
                            <span key={i} className="inline-block word-fill" style={{ color: dimColor }}>{ch}</span>
                        ))}
                    </span>
                    <span
                        ref={line3Ref}
                        className="uppercase block"
                        style={{ ...headlineStyle, color: dimColor }}
                    >
                        {'DETAILS'.split('').map((ch, i) => (
                            <span key={i} className="inline-block word-fill" style={{ color: dimColor }}>{ch}</span>
                        ))}
                    </span>
                </div>

                {/* ── Right: Form ── */}
                <div ref={formBoxRef} className="w-full max-w-[600px] justify-self-center md:justify-self-end">
                    <form ref={formInnerRef} onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>

                        {/* NAME */}
                        <div className="form-field">
                            <label htmlFor="contact-name" style={labelStyle}>NAME</label>
                            <input
                                id="contact-name"
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                style={errors.name ? errorInputStyle : inputStyle}
                                onFocus={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)'}
                                onBlur={e => e.target.style.borderColor = errors.name ? '#D00000' : '#333333'}
                                disabled={status === 'sending'}
                                autoComplete="name"
                            />
                            {errors.name && (
                                <p style={{ color: '#D00000', fontSize: '12px', marginTop: '6px', fontFamily: 'Geist, sans-serif' }}>
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* EMAIL */}
                        <div className="form-field">
                            <label htmlFor="contact-email" style={labelStyle}>EMAIL</label>
                            <input
                                id="contact-email"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                style={errors.email ? errorInputStyle : inputStyle}
                                onFocus={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)'}
                                onBlur={e => e.target.style.borderColor = errors.email ? '#D00000' : '#333333'}
                                disabled={status === 'sending'}
                                autoComplete="email"
                            />
                            {errors.email && (
                                <p style={{ color: '#D00000', fontSize: '12px', marginTop: '6px', fontFamily: 'Geist, sans-serif' }}>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* MESSAGE */}
                        <div className="form-field">
                            <label htmlFor="contact-message" style={labelStyle}>MESSAGE</label>
                            <textarea
                                id="contact-message"
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                rows={6}
                                style={errors.message ? { ...errorInputStyle, resize: 'none' } : { ...inputStyle, resize: 'none' }}
                                onFocus={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)'}
                                onBlur={e => e.target.style.borderColor = errors.message ? '#D00000' : '#333333'}
                                disabled={status === 'sending'}
                            />
                            {errors.message && (
                                <p style={{ color: '#D00000', fontSize: '12px', marginTop: '6px', fontFamily: 'Geist, sans-serif' }}>
                                    {errors.message}
                                </p>
                            )}
                        </div>

                        {/* Status feedback */}
                        {status === 'sent' && (
                            <p style={{ color: '#4ade80', fontSize: '13px', fontFamily: 'Thedus-cl', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                Message sent successfully!
                            </p>
                        )}
                        {status === 'error' && (
                            <p style={{ color: '#D00000', fontSize: '13px', fontFamily: 'Thedus-cl', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                {errors.submit || 'Failed to send. Please try again.'}
                            </p>
                        )}

                        {/* BUTTONS */}
                        <div className="flex flex-wrap items-center gap-4 mt-4">
                            <button
                                type="submit"
                                className="form-btn group relative flex items-center gap-2 overflow-hidden"
                                style={{ ...btnBase, backgroundColor: '#D00000', color: 'white', opacity: status === 'sending' ? 0.6 : 1 }}
                                disabled={status === 'sending'}
                            >
                                <div className="absolute inset-0 w-full h-full bg-[#111] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                                <span className="relative z-10 font-bold">{status === 'sending' ? 'SENDING...' : 'SEND'}</span>
                                <svg className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                            <button
                                type="button"
                                onClick={() => { setForm({ name: '', email: '', message: '' }); setErrors({}); setStatus('idle'); }}
                                className="form-btn group relative flex items-center overflow-hidden"
                                style={{ ...btnBase, backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                                disabled={status === 'sending'}
                            >
                                <div className="absolute inset-0 w-full h-full bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                                <span className="relative z-10 group-hover:text-black transition-colors duration-500">CLOSE</span>
                            </button>

                            <button
                                type="button"
                                className="form-btn group relative flex items-center overflow-hidden"
                                style={{ ...btnBase, backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                            >
                                <div className="absolute inset-0 w-full h-full bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                                <span className="relative z-10 group-hover:text-black transition-colors duration-500">SCHEDULE A CALL</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}