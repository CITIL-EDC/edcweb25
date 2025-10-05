'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface CascadingTextProps {
  text: string;                    // "ABOUT ME" or "What We Do" etc.
  className?: string;              // Additional styling
  animationDuration?: number;      // Total animation time (default: 1200ms)
  staggerDelay?: number;          // Delay between characters (default: 50ms)
  fontSize?: 'responsive' | 'fixed'; // Auto-size based on text length
  font?: 'inter' | 'jetbrains-mono' | 'geist-sans' | 'general-sans' | 'epoch' | 'spline-sans-mono'; // Font family
}

/**
 * CascadingText - A reusable text animation component for section headings
 * Creates a dramatic "falling letters" effect when scrolling into view.
 * 
 * Animation Logic:
 * - When component enters viewport: Characters drop from center outward
 * - When component is in upper half of screen (negative position): Characters stay dropped
 * - When component moves to lower half of screen (positive position): Characters rise back up
 * 
 * Position System:
 * - Positive viewportPosition = component is below viewport center
 * - Negative viewportPosition = component is above viewport center
 */
export default function CascadingText({
  text,
  className = '',
  animationDuration = 1200,
  staggerDelay = 50,
  fontSize = 'responsive',
  font = 'inter'
}: CascadingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animationState, setAnimationState] = useState<'idle' | 'entering' | 'visible' | 'exiting'>('idle');
  const [scrollProgress, setScrollProgress] = useState(0); // 0 = at bottom, 1 = at 60% threshold

  // Handle scroll-based animation progress
  const handleScroll = useCallback(() => {
    const element = containerRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Calculate 60% threshold from top of viewport
    const dropThreshold = viewportHeight * 0.6;
    const isInViewport = rect.top < viewportHeight && rect.bottom > 0;
    
    // Calculate scroll progress from viewport bottom (0) to 60% threshold (1)
    let progress = 0;
    if (rect.top < viewportHeight && rect.top > dropThreshold) {
      // Component is between viewport bottom and 60% threshold
      progress = 1 - ((rect.top - dropThreshold) / (viewportHeight - dropThreshold));
      progress = Math.max(0, Math.min(1, progress)); // Clamp between 0 and 1
    } else if (rect.top <= dropThreshold) {
      // Component has reached or passed 60% threshold
      progress = 1;
    }
    
    // Update scroll progress
    setScrollProgress(prevProgress => {
      if (Math.abs(prevProgress - progress) < 0.01) return prevProgress;
      return progress;
    });
    
    // Handle visibility and animation states
    if (isInViewport) {
      setIsVisible(prevVisible => {
        if (!prevVisible && rect.bottom >= 0) {
          // Component enters viewport from bottom
          setAnimationState('entering');
          return true;
        } else if (prevVisible && rect.top > viewportHeight * 0.8) {
          // Component moves too far down - trigger rise animation
          setAnimationState('exiting');
          return false;
        }
        return prevVisible;
      });
      
      // Update animation state based on progress
      if (progress >= 1 && animationState !== 'visible') {
        setAnimationState('visible');
      } else if (progress > 0 && progress < 1 && animationState !== 'entering') {
        setAnimationState('entering');
      }
    } else if (rect.top > viewportHeight) {
      // Component completely out of view at bottom - reset
      setIsVisible(prevVisible => {
        if (prevVisible) {
          setAnimationState('idle');
          return false;
        }
        return prevVisible;
      });
    }
  }, []); // Remove dependencies that cause circular updates

  // Handle intersection observer and scroll events
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // Add scroll listener with throttling for performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial position calculation
    handleScroll();

    window.addEventListener('scroll', throttledScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []); // Empty dependency array to prevent re-creation

  // No time-based state management needed - using scroll-based animation



  // Get responsive font size based on text length
  const getResponsiveFontSize = (textLength: number) => {
    if (fontSize === 'fixed') return 'text-6xl';
    
    if (textLength <= 8) {
      return 'text-6xl md:text-7xl lg:text-8xl xl:text-9xl';
    } else if (textLength <= 15) {
      return 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl';
    } else {
      return 'text-2xl md:text-3xl lg:text-4xl xl:text-5xl';
    }
  };

  // Get font family class
  const getFontClass = (fontFamily: string) => {
    switch (fontFamily) {
      case 'inter':
        return 'font-inter';
      case 'jetbrains-mono':
        return 'font-mono';
      case 'geist-sans':
        return 'font-sans';
      case 'general-sans':
        return 'font-general-sans';
      case 'epoch':
        return 'font-epoch';
      case 'spline-sans-mono':
        return 'font-spline-sans-mono';
      default:
        return 'font-inter';
    }
  };

  // Split text into characters while preserving spaces
  const characters = text.split('').map((char, index) => ({
    char: char === ' ' ? '\u00A0' : char, // Non-breaking space
    index
  }));

  // Calculate available time from viewport bottom to 60% threshold
  const getAvailableAnimationTime = () => {
    const element = containerRef.current;
    if (!element) return animationDuration;
    
    const viewportHeight = window.innerHeight;
    const dropThreshold = viewportHeight * 0.6;
    const availableDistance = viewportHeight - dropThreshold; // 40% of viewport height
    
    // Much longer timing for granular, slow animation
    // Assume slower scroll speed and give more time for each letter to be visible dropping
    return Math.max(2000, availableDistance * 8); // Min 2 seconds, much slower scaling
  };

  // Calculate when each character should START dropping based on scroll progress
  const getCharacterDropThreshold = (index: number) => {
    const center = Math.floor((characters.length - 1) / 2);
    const distanceFromCenter = Math.abs(index - center);
    const maxDistance = Math.max(center, characters.length - 1 - center);
    
    if (maxDistance === 0) return 0; // Single character
    
    // Group characters in pairs from center outward
    // Characters equidistant from center drop together (as pairs)
    const pairIndex = Math.floor(distanceFromCenter);
    const maxPairs = Math.ceil(maxDistance);
    
    if (maxPairs === 0) return 0;
    
    // Much slower progression - spread pairs across 90% of scroll progress
    // Each pair gets a significant delay from the previous pair
    const pairDropStart = (pairIndex / maxPairs) * 0.9;
    
    // Add tiny stagger within the pair (left vs right character)
    const isLeftOfCenter = index < center;
    const isRightOfCenter = index > center;
    const withinPairDelay = (isRightOfCenter ? 0.02 : (isLeftOfCenter ? 0.01 : 0)); // Right drops slightly after left
    
    return Math.min(0.92, pairDropStart + withinPairDelay); // Cap at 92% to ensure completion time
  };

  // Get character animation styles based on scroll progress
  const getCharacterStyle = (index: number) => {
    const isReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Create variations for each character
    const center = Math.floor((characters.length - 1) / 2);
    const distanceFromCenter = Math.abs(index - center);
    const isEvenChar = index % 2 === 0;
    
    // Vary drop heights more dramatically for better visibility
    const dropHeight = -220 - (distanceFromCenter * 15) - ((index * 17) % 40); // More varied heights
    const horizontalOffset = ((index * 11) % 9) - 4; // Horizontal variation
    
    // Get when this character should start dropping
    const characterDropThreshold = getCharacterDropThreshold(index);
    
    // Calculate how far this character has progressed in its drop
    let characterProgress = 0;
    if (scrollProgress > characterDropThreshold) {
      const availableTime = 1 - characterDropThreshold; // Time available for this character to complete drop
      if (availableTime > 0) {
        characterProgress = (scrollProgress - characterDropThreshold) / availableTime;
        characterProgress = Math.max(0, Math.min(1, characterProgress));
      } else {
        characterProgress = 1; // Instant drop if no time available
      }
    }

    if (isReducedMotion) {
      return {
        opacity: isVisible ? 1 : 0,
        transform: 'translateY(0px)',
        transition: 'opacity 0.3s ease'
      };
    }

    // Calculate current position based on scroll progress
    let currentY = dropHeight; // Start position (high above)
    let currentX = horizontalOffset; // Start with horizontal offset
    
    if (characterProgress > 0) {
      // Character is dropping - interpolate position
      const bounceIntensity = 1.4 + (distanceFromCenter * 0.15);
      
      // Apply easing for very slow, smooth drop animation
      let easedProgress = characterProgress;
      if (characterProgress < 1) {
        // Very gradual easing for slow, deliberate drops
        easedProgress = 1 - Math.pow(1 - characterProgress, 1.5); // Even gentler easing
        if (characterProgress > 0.85) {
          // Very subtle bounce at the very end
          const bouncePhase = (characterProgress - 0.85) / 0.15;
          easedProgress += Math.sin(bouncePhase * Math.PI) * 0.02 * (1 - bouncePhase); // Minimal bounce
        }
      }
      
      currentY = dropHeight + (easedProgress * -dropHeight); // Interpolate from dropHeight to 0
      currentX = horizontalOffset + (easedProgress * -horizontalOffset); // Converge to center
    }

    // Handle different animation states
    if (animationState === 'idle' && scrollProgress === 0) {
      return {
        opacity: 1,
        transform: `translate(${horizontalOffset}px, ${dropHeight}px)`,
        transition: 'none'
      };
    }

    if (animationState === 'exiting') {
      const exitHorizontalOffset = horizontalOffset * 1.5;
      return {
        opacity: 1,
        transform: `translate(${exitHorizontalOffset}px, ${dropHeight}px)`,
        transition: 'transform 300ms ease-out',
        willChange: 'transform'
      };
    }

    // Main scroll-based animation
    return {
      opacity: 1,
      transform: `translate(${currentX}px, ${currentY}px)`,
      transition: scrollProgress === 0 ? 'none' : 'transform 800ms cubic-bezier(0.4, 0, 0.2, 1)', // Much slower with smooth easing
      willChange: 'transform'
    };
  };

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      style={{ minHeight: '1em' }} // Prevent layout shift
    >
      <div
        className={`
          ${getFontClass(font)}
          ${getResponsiveFontSize(text.length)}
          font-black
          tracking-tighter
          ${className.includes('text-') ? '' : 'text-foreground'}
          leading-none
          select-none
        `}
        role="heading"
        aria-label={text}
      >
        {characters.map(({ char, index }) => (
          <span
            key={index}
            className="inline-block"
            style={getCharacterStyle(index)}
            aria-hidden="true"
          >
            {char}
          </span>
        ))}
      </div>
      
      {/* Screen reader accessible text */}
      <span className="sr-only">{text}</span>
    </div>
  );
}
