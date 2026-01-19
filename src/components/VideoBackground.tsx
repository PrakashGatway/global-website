'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  videos: string[];
}

export default function VideoBackground({ videos }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      // Move to next video, loop back to first if at the end
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    };

    video.addEventListener('ended', handleVideoEnd);

    // Load and play the current video
    video.src = videos[currentVideoIndex];
    video.load();
    video.play().catch((error) => {
      console.error('Error playing video:', error);
    });

    return () => {
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, [currentVideoIndex, videos]);

  return (
    <video 
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className="w-full h-full object-cover"
    />
  );
}
