'use client'
import { useRef, useId } from 'react'
import gsap from 'gsap'

export default function LiquidButton({ children, style, className = '' }) {
    const btnRef = useRef(null)
    const filterRef = useRef(null)
    const filterId = useId().replace(/:/g, '')

    const handleEnter = () => {
        gsap.to(filterRef.current, {
            attr: { scale: 40 },
            duration: 0.8,
            ease: 'power2.out'
        })
    }

    const handleLeave = () => {
        gsap.to(filterRef.current, {
            attr: { scale: 0 },
            duration: 0.6,
            ease: 'power3.in'
        })
    }

    return (
        <button
            ref={btnRef}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            className={`relative overflow-hidden ${className}`}
            style={{ ...style, filter: `url(#liquid-${filterId})` }}
        >
            <span className="relative z-10">{children}</span>

            <svg className="absolute w-0 h-0">
                <filter id={`liquid-${filterId}`}>
                    <feTurbulence
                        type="turbulence"
                        baseFrequency="0.02"
                        numOctaves="3"
                        result="warp"
                    />
                    <feDisplacementMap
                        ref={filterRef}
                        in="SourceGraphic"
                        in2="warp"
                        scale="0"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </svg>
        </button>
    )
}
