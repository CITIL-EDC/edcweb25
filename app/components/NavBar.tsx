'use client';

import React, { useState, useEffect } from 'react';
import EDCLogo from './EDCLogo';

/**
 * Navigation bar component for EDC website
 * Clean, simple navigation with scroll detection
 * Uses Intersection Observer API to detect which section is currently in viewport
 */

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { label: 'ABOUT US', href: '#about' },
    { label: 'WHAT WE DO', href: '#services' },
    { label: 'EVENTS', href: '#events' },
  ];

  // Track scroll position for background effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section using Intersection Observer
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -80% 0px', // Trigger when section is 20% from top
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          setActiveSection(sectionId);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections that have corresponding nav items
    const sections = ['hero', 'about', 'services', 'events', 'articles'];
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  // Helper function to determine if a nav item is active
  const isActive = (href: string) => {
    const sectionId = href.replace('#', '');
    return activeSection === sectionId;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? 'bg-background/90 backdrop-blur-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between w-full">
          {/* Logo - Far Left */}
          <div className="transition-all duration-500 flex-shrink-0">
            <div className="scale-150 origin-left">
              <EDCLogo />
            </div>
          </div>

          {/* Navigation Items - Center */}
          <div className="flex items-center space-x-12 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`relative font-jetbrains-mono text-lg tracking-wider transition-all duration-300 uppercase group font-medium px-4 py-3 ${
                  isActive(item.href)
                    ? 'text-foreground'
                    : 'text-foreground/80 hover:text-foreground'
                }`}
              >
                <span className="relative z-10">[ {item.label} ]</span>
                {/* Active indicator */}
                {isActive(item.href) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-foreground"></span>
                )}
                {/* Hover effect for non-active items */}
                {!isActive(item.href) && (
                  <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mx-4 -my-3 bg-foreground/10"></span>
                )}
              </a>
            ))}
          </div>

          {/* Articles Button - Far Right */}
          <div className="transition-all duration-500 flex-shrink-0">
            <a
              href="#articles"
              className={`font-jetbrains-mono text-lg tracking-wider transition-all duration-300 uppercase inline-flex items-center group font-medium px-4 py-3 ${
                isActive('#articles')
                  ? 'text-foreground'
                  : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              <span className={`pb-1 ${
                isActive('#articles') 
                  ? 'border-b-2 border-foreground' 
                  : 'border-b-2 border-foreground/60 group-hover:border-foreground'
              }`}>
                ARTICLES
              </span>
              <svg
                className="ml-3 w-5 h-5 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between">
          {/* Mobile Logo */}
          <div className="transition-all duration-500">
            <div className="scale-125 origin-left">
              <EDCLogo />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex flex-col justify-center items-center w-10 h-10 p-2 rounded-md transition-all duration-500 hover:bg-foreground/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-foreground transition-all duration-300 my-1.5 ${
                isMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pt-8 pb-6 space-y-8 border-t border-foreground/10 mt-6 rounded-lg bg-background/90 backdrop-blur-md px-6">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`block font-jetbrains-mono text-xl tracking-wider transition-all duration-300 uppercase py-3 px-4 rounded-md font-medium ${
                  isActive(item.href)
                    ? 'text-foreground bg-foreground/10'
                    : 'text-foreground/80 hover:text-foreground hover:bg-foreground/5'
                }`}
                onClick={() => setIsMenuOpen(false)}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: isMenuOpen ? 'slideInFromLeft 0.4s ease-out forwards' : 'none'
                }}
              >
                [ {item.label} ]
              </a>
            ))}
            <a
              href="#articles"
              className={`flex font-jetbrains-mono text-xl tracking-wider transition-all duration-300 uppercase items-center group py-3 px-4 rounded-md font-medium ${
                isActive('#articles')
                  ? 'text-foreground bg-foreground/10'
                  : 'text-foreground/80 hover:text-foreground hover:bg-foreground/5'
              }`}
              onClick={() => setIsMenuOpen(false)}
              style={{ 
                animationDelay: '300ms',
                animation: isMenuOpen ? 'slideInFromLeft 0.4s ease-out forwards' : 'none'
              }}
            >
              <span className={`pb-1 ${
                isActive('#articles') 
                  ? 'border-b-2 border-foreground' 
                  : 'border-b-2 border-foreground/60'
              }`}>
                ARTICLES
              </span>
              <svg
                className="ml-4 w-6 h-6 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
