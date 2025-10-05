'use client';

import { useState } from 'react';

/**
 * Custom EDC Logo component using typography and SVG elements
 * Combines the E, D, C letters with geometric accents for a modern look
 */
export default function EDCLogo() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative group cursor-pointer select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main logo container */}
      <div className="flex flex-col items-start -space-y-2">
        {/* "Citil" text in Dancing Script */}
        <div className="ml-0">
          <span className="font-dancing-script text-xl text-foreground/80 transition-all duration-300 group-hover:text-foreground">
            Citil
          </span>
        </div>

        {/* EDC Letters */}
        <div className="flex items-center space-x-0">
          <span className="font-inter text-3xl font-black text-foreground transition-all duration-300 group-hover:text-foreground/90">
            E
          </span>
          <span className="font-inter text-3xl font-black text-foreground transition-all duration-300 group-hover:text-foreground/90">
            D
          </span>
          <span className="font-inter text-3xl font-black text-foreground transition-all duration-300 group-hover:text-foreground/90">
            C
          </span>
        </div>
      </div>

      {/* Underline accent that expands on hover */}
      <div 
        className={`absolute bottom-0 left-0 h-0.5 bg-foreground transition-all duration-500 ease-out ${
          isHovered ? 'w-full' : 'w-0'
        }`}
      />

      {/* Optional subtle glow effect */}
      <div 
        className={`absolute inset-0 rounded-lg transition-all duration-300 ${
          isHovered ? 'bg-foreground/5 scale-110' : 'bg-transparent scale-100'
        }`}
        style={{ zIndex: -1 }}
      />
    </div>
  );
}