'use client';
import { useState, useEffect } from 'react';
import IvyLeagueTopBar from "@/components/IvyLeagueTopBar";
import IvyLeagueHeader from "@/components/IvyLeagueHeader";

export default function IvyLeagueNavigation() {
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
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300`}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 9999 
      }}
    >
      <IvyLeagueTopBar isScrolled={isScrolled} />
      <div className="bg-white shadow-md" style={{ backgroundColor: 'white' }}>
        <IvyLeagueHeader isScrolled={isScrolled} />
      </div>
    </div>
  );
}

