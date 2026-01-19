'use client';

import { useState, useEffect } from 'react';
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-[9999] bg-white shadow-md"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        width: '100%',
        zIndex: 9999,
        backgroundColor: 'white'
      }}
    >
      <TopBar isScrolled={isScrolled} />
      <div className={`bg-white transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
        <Header isScrolled={isScrolled} />
      </div>
    </div>
  );
}
