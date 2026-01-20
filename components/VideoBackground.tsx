'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  videos: string[];
}

export default function VideoBackground({ videos }: VideoBackgroundProps) {
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const [active, setActive] = useState<0 | 1>(0);
  const [indexes, setIndexes] = useState<[number, number]>(() => [0, 1]);

  // 🔒 Stable switch function
  const switchVideo = useCallback(() => {
    setIndexes(([a, b]) => {
      const next = (Math.max(a, b) + 1) % videos.length;
      return active === 0 ? [a, next] : [next, b];
    });

    setActive((prev) => (prev === 0 ? 1 : 0));
  }, [active, videos.length]);

  // ⏱️ Timer (does NOT recreate every render)
  useEffect(() => {
    if (videos.length < 2) return;

    const timer = setInterval(switchVideo, 10000);
    return () => clearInterval(timer);
  }, [switchVideo, videos.length]);

  // ▶️ Play only active video
  useEffect(() => {
    const video = videoRefs.current[active];
    if (!video) return;

    video.currentTime = 0;
    video.play().catch(() => {});
  }, [active]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {[0, 1].map((i) => (
        <video
          key={i}
          ref={(el) => {
            if (el) videoRefs.current[i] = el;
          }}
          src={videos[indexes[i]]}
          muted
          playsInline
          autoPlay
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            active === i ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
}
