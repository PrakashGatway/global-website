const Balloon = async ({ Pageres  }) => {
 
  return (
    <div className="flex min-h-screen items-end justify-center pb-12 hidden
              lg:block">
      <div className="flex flex-col items-center">

        {/* BALLOON */}
        <div className="relative w-20 lg:w-18 h-72  balloon-animation">
          <svg viewBox="0 0 200 320" className="w-full h-full relative">

            <defs>
              <clipPath id="balloonClip">
                <path d="M100 5C155 5 185 40 182 100
                         C177 155 137 205 103 216
                         C68 205 26 138 25 99
                         C21 47 48 8 100 5Z" />
              </clipPath>
            </defs>

            {/* ✅ FLAG IMAGE COVERING ENTIRE BALLOON */}
            <image
              href={Pageres?.country?.flg}
              x="-60"
              y="-40"
              width="360"
              height="315"
              clipPath="url(#balloonClip)"
              preserveAspectRatio="xMidYMid slice"
            />

            {/* Balloon border overlay */}
            <path
              d="M100 5C155 5 185 40 182 100
                 C177 155 137 205 103 216
                 C68 205 26 138 25 99
                 C21 47 48 8 100 5Z"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2"
            />



            {/* Knot */}
            <polygon points="95,216 105,216 100,230" fill="#666" />

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