"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";
import Hero from "./components/Hero";
import NavBar from "./components/NavBar";
import AboutUs from "./components/AboutUs";

export default function Home() {
  // Temporarily disable loading screen for debugging
  const [isLoading, setIsLoading] = useState(false);
  const loadingDuration = 5; // Duration in seconds

  useEffect(() => {
    // Calculate total animation time: up (1.5s) + stay (duration-1.5s) + down (1.5s) - SNAPPIER!
    const upDuration = 2.5;
    const downDuration = 2.5;
    const stayDuration = Math.max(0, loadingDuration - upDuration);
    const totalDuration = upDuration + stayDuration + downDuration;
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, totalDuration * 1000); // Convert to milliseconds

    return () => clearTimeout(timer);
  }, [loadingDuration]);

  if (isLoading) {
    return <LoadingScreen duration={loadingDuration} />;
  }

  return (
    <>
      <NavBar />
      <Hero />
      <AboutUs />
    </>
  );
}
