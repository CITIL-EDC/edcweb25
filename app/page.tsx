"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";
import Hero from "./components/Hero";
import NavBar from "./components/NavBar";
import AboutUs from "./components/AboutUs";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const loadingDuration = 3; // Duration in seconds

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, loadingDuration * 1000); // Simple timing - just use the duration directly

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
