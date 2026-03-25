import { useState, useRef, useEffect } from "react";

export default function ExpandableText({ htmlContent, lines = 3 }) {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      const el = contentRef.current;

      // Check if content is actually overflowing
      if (el.scrollHeight > el.clientHeight) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    }
  }, [htmlContent]);

  return (
    <div className="mt-6 sm:mt-8">

      <div
        ref={contentRef}
        className={`text-white leading-relaxed transition-all duration-300 ${
          expanded ? "" : `line-clamp-${lines}`
        }`}
        dangerouslySetInnerHTML={{ __html: htmlContent || "" }}
      />

      {/* ✅ Show button ONLY if needed */}
      {showButton && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-black mt-3 font-semibold cursor-pointer"
        >
          {expanded ? "Read Less" : "Read More"}
        </button>
      )}

    </div>
  );
}