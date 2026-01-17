"use client";

export default function VideoInSvgShape() {
    return (
        <div className="relative w-[420px] h-[260px]">
            <svg width="0" height="0">
                <defs>
                    <clipPath id="video-shape" clipPathUnits="objectBoundingBox">
                        <path
                            d="
                M0.05,0
                H0.9
                C0.95,0,1,0.08,1,0.15
                V0.85
                C1,0.92,0.95,1,0.9,1
                H0.05
                C0,1,0,0.92,0,0.85
                V0.15
                C0,0.08,0,0,0.05,0
                Z
              "
                        />
                    </clipPath>
                </defs>
            </svg>
            <div
                className="w-full h-full overflow-hidden"
                style={{
                    clipPath: "url(#video-shape)",
                    WebkitClipPath: "url(#video-shape)",
                }}
            >
                <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&controls=1"
                    title="YouTube video"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                />
            </div>
        </div>
    );
}
