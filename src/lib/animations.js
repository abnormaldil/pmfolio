/**
 * GSAP Animation Utilities
 * Centralized animation configurations for consistent motion design
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Fade in animation with optional stagger
 */
export const fadeIn = (elements, options = {}) => {
  const {
    duration = 0.8,
    delay = 0,
    stagger = 0,
    y = 50,
    ease = 'power3.out',
  } = options;

  return gsap.from(elements, {
    opacity: 0,
    y,
    duration,
    delay,
    stagger,
    ease,
  });
};

/**
 * Scale in animation
 */
export const scaleIn = (elements, options = {}) => {
  const {
    duration = 0.8,
    delay = 0,
    stagger = 0,
    scale = 0.8,
    ease = 'back.out(1.7)',
  } = options;

  return gsap.from(elements, {
    opacity: 0,
    scale,
    duration,
    delay,
    stagger,
    ease,
  });
};

/**
 * Scroll-triggered reveal animation
 */
export const scrollReveal = (elements, options = {}) => {
  const {
    duration = 0.8,
    y = 60,
    stagger = 0.1,
    start = 'top 80%',
    toggleActions = 'play none none none',
    ease = 'power3.out',
  } = options;

  return gsap.from(elements, {
    opacity: 0,
    y,
    duration,
    stagger,
    ease,
    scrollTrigger: {
      trigger: elements[0]?.parentElement || elements,
      start,
      toggleActions,
    },
  });
};

/**
 * Stagger text lines animation
 */
export const staggerTextLines = (container, options = {}) => {
  const {
    duration = 1,
    stagger = 0.15,
    y = 80,
    ease = 'power3.out',
  } = options;

  const lines = container.querySelectorAll('.title-line, .text-line');
  
  gsap.set(lines, { opacity: 0, y });
  
  return gsap.to(lines, {
    opacity: 1,
    y: 0,
    duration,
    stagger,
    ease,
  });
};

/**
 * Floating animation for cards/elements
 */
export const floatingAnimation = (elements, options = {}) => {
  const {
    y = 20,
    rotation = 2,
    duration = 3,
    stagger = 0.2,
  } = options;

  const elementArray = Array.isArray(elements) ? elements : [elements];
  
  elementArray.forEach((element, index) => {
    gsap.to(element, {
      y: `+=${y + index * 5}`,
      rotation: `+=${rotation + index}`,
      duration: duration + index * 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: index * stagger,
    });
  });
};

/**
 * Hover scale animation
 */
export const hoverScale = (element, scale = 1.05) => {
  const handleMouseEnter = () => {
    gsap.to(element, {
      scale,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};
