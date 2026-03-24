import { useState } from "react";

export default function ExpandableText({ htmlContent, lines = 3 }) {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div className="mt-6 sm:mt-8">
      <p
        className={`text-white leading-relaxed transition-all duration-300 ${
          expanded ? "" : `line-clamp-${lines}`
        }`}
        dangerouslySetInnerHTML={{ __html: htmlContent || "" }}
      />

      <button
        type="button"
        onClick={handleToggle}
        className="text-yellow-300 mt-3 font-semibold cursor-pointer"
      >
        {expanded ? "Read Less" : "Read More"}
      </button>
    </div>
  );
}