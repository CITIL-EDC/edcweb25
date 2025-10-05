'use client';

import { useEffect, useRef } from 'react';

/**
 * Hero section component for EDC website
 * Features the main club name with elegant typography using General Sans variable font
 * With animated diagonal grid background
 */
export default function Hero() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    // Create grid squares
    const createGrid = () => {
      const gridSize = 30; // 30px x 30px squares
      const cols = Math.ceil(window.innerWidth / gridSize) + 2;
      const rows = Math.ceil(window.innerHeight / gridSize) + 2;
      
      grid.innerHTML = '';
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const square = document.createElement('div');
          square.className = 'grid-square';
          square.style.cssText = `
            position: absolute;
            width: ${gridSize}px;
            height: ${gridSize}px;
            left: ${col * gridSize}px;
            top: ${row * gridSize}px;
            border: 1px solid currentColor;
            opacity: 0.1;
            transition: all 0.3s ease;
            cursor: pointer;
          `;
          
          // Add hover effect
          square.addEventListener('mouseenter', () => {
            square.style.backgroundColor = 'currentColor';
            square.style.opacity = '0.08';
            square.style.transform = 'scale(1.05)';
          });
          
          square.addEventListener('mouseleave', () => {
            square.style.backgroundColor = 'transparent';
            square.style.opacity = '0.5';
            square.style.transform = 'scale(1)';
          });
          
          grid.appendChild(square);
        }
      }
    };

    createGrid();
    window.addEventListener('resize', createGrid);

    return () => {
      window.removeEventListener('resize', createGrid);
    };
  }, []);

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-background pt-20 relative overflow-hidden">
      {/* Animated Grid Background */}
      <div 
        ref={gridRef}
        className="absolute inset-0 text-foreground pointer-events-auto"
        style={{
          animation: 'moveGrid 20s linear infinite',
          transform: 'translate(-30px, -30px)', // Start offset for seamless loop
        }}
      />
      
      <div className="text-center px-6 max-w-6xl mx-auto relative z-10">
        <h1 
          className="text-6xl md:text-8xl lg:text-9xl font-black text-foreground leading-tight tracking-tight font-general-sans"
          style={{ 
            fontVariationSettings: '"wght" 900', // Maximum weight for variable font
            letterSpacing: '-0.02em' // Tight letter spacing for modern look
          }}
        >
          Entrepreneurship
          <br />
          <span className="block">Development Cell</span>
        </h1>
        
        <div className="mt-8 space-y-4">
          <p 
            className="text-xl md:text-2xl text-foreground/80 font-general-sans max-w-3xl mx-auto"
            style={{ 
              fontVariationSettings: '"wght" 400', // Regular weight
              lineHeight: '1.6'
            }}
          >
            Fostering innovation, nurturing startups, and building the next generation of entrepreneurs
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <button 
              className="px-8 py-4 bg-foreground text-background font-general-sans font-semibold text-lg rounded-lg hover:bg-foreground/90 transition-colors"
              style={{ fontVariationSettings: '"wght" 600' }}
            >
              Join Our Community
            </button>
            <button 
              className="px-8 py-4 border-2 border-foreground text-foreground font-general-sans font-medium text-lg rounded-lg hover:bg-foreground hover:text-background transition-colors"
              style={{ fontVariationSettings: '"wght" 500' }}
            >
              Explore Programs
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
