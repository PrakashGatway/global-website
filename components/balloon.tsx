const Balloon = ({ Pageres  }) => {
 
  return (
    <div className="flex min-h-screen items-end justify-center pb-12 hidden
              lg:block">
      <div className="flex flex-col items-center">

        {/* BALLOON */}
       <div className="relative w-20 lg:w-18 h-72 balloon-animation">
  <svg viewBox="0 0 200 320" className="w-full h-full relative">

    <defs>
      {/* Balloon Shape */}
      <clipPath id="balloonClip">
        <path d="M100 5C155 5 185 40 182 100
                 C177 155 137 205 103 216
                 C68 205 26 138 25 99
                 C21 47 48 8 100 5Z" />
      </clipPath>

      {/* Glass Gradient */}
      <linearGradient id="glassGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
        <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
      </linearGradient>
    </defs>

    {/* ✅ FLAG IMAGE (Centered Perfectly) */}
   <image
  href={Pageres?.country?.flg}
  x="-70"
  y="-44"
  width="350"
  height="330"
  clipPath="url(#balloonClip)"
  preserveAspectRatio="xMidYMid meet"
/>

    {/* ✅ Glass Overlay */}
    <path
      d="M100 5C155 5 185 40 182 100
         C177 155 137 205 103 216
         C68 205 26 138 25 99
         C21 47 48 8 100 5Z"
      fill="url(#glassGradient)"
    />

    {/* ✅ Light Reflection */}
    <ellipse
      cx="90"
      cy="50"
      rx="35"
      ry="22"
      fill="rgba(255,255,255,0.25)"
    />

    {/* Balloon Border */}
    <path
      d="M100 5C155 5 185 40 182 100
         C177 155 137 205 103 216
         C68 205 26 138 25 99
         C21 47 48 8 100 5Z"
      fill="none"
      stroke="rgba(255,255,255,0.4)"
      strokeWidth="0"
    />

    {/* Knot */}
    <polygon points="95,216 105,216 100,230" fill="#888" />

    {/* String */}
    <path
      d="M100 230 C95 260,105 290,100 320"
      stroke="#fff"
      strokeWidth="2"
      fill="none"
    />
  </svg>
</div>

      </div>
    </div>
  );
};

export default Balloon;