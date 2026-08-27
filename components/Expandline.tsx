import { useState, useRef, useEffect } from "react";

export default function ExpandableText({
  htmlContent,
  lines = 3,
  className = "",
}) {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (!contentRef.current || expanded) return;

      const el = contentRef.current;

      // Temporarily remove line clamp to determine actual height
      const originalWebkitLineClamp = el.style.webkitLineClamp;
      const originalOverflow = el.style.overflow;

      el.style.webkitLineClamp = "unset";
      el.style.overflow = "visible";

      const fullHeight = el.scrollHeight;

      el.style.webkitLineClamp = originalWebkitLineClamp;
      el.style.overflow = originalOverflow;

      const lineHeight = parseFloat(
        window.getComputedStyle(el).lineHeight
      );

      const maxHeight = lineHeight * lines;

      setShowButton(fullHeight > maxHeight + 2);
    };

    // Give browser time to render HTML
    const timeout = setTimeout(checkOverflow, 50);

    window.addEventListener("resize", checkOverflow);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", checkOverflow);
    };
  }, [htmlContent, lines, expanded]);

  return (
    <div className={`w-full ${className}`}>
      {/* Content */}
      <div
        ref={contentRef}
        className={`
          mt-4 sm:mt-2
          text-sm sm:text-base
          leading-7
          font-normal
          tracking-wide

          transition-[max-height]
          duration-300
          ease-in-out

          ${!expanded ? `line-clamp-${lines}` : ""}

          /* FORCE TEXT COLOR */
          !text-white

          [&_*]:!text-white
          [&_p]:!text-white
          [&_span]:!text-white
          [&_div]:!text-white
          [&_strong]:!text-white
          [&_b]:!text-white
          [&_em]:!text-white
          [&_i]:!text-white
          [&_li]:!text-white
          [&_ul]:!text-white
          [&_ol]:!text-white
          [&_h1]:!text-white
          [&_h2]:!text-white
          [&_h3]:!text-white
          [&_h4]:!text-white
          [&_h5]:!text-white
          [&_h6]:!text-white

          /* LINKS */
          [&_a]:!text-white
          [&_a]:underline
          [&_a]:underline-offset-2
          [&_a]:transition-opacity
          [&_a:hover]:opacity-80

          /* IMAGES */
          [&_img]:max-w-full
          [&_img]:h-auto
          [&_img]:rounded-xl
          [&_img]:my-3

          /* LISTS */
          [&_ul]:list-disc
          [&_ul]:pl-6
          [&_ol]:list-decimal
          [&_ol]:pl-6
          [&_li]:mb-1

          /* HEADINGS */
          [&_h1]:text-2xl
          [&_h1]:font-bold
          [&_h2]:text-xl
          [&_h2]:font-bold
          [&_h3]:text-lg
          [&_h3]:font-semibold

          /* PARAGRAPHS */
          [&_p]:mb-3

          /* BLOCKQUOTES */
          [&_blockquote]:border-l-4
          [&_blockquote]:border-white/30
          [&_blockquote]:pl-4
          [&_blockquote]:italic
          [&_blockquote]:text-white/80
        `}
        dangerouslySetInnerHTML={{
          __html: htmlContent || "",
        }}
      />

      {/* Read More / Read Less */}
      {showButton && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="
            mt-3
            inline-flex
            items-center
            gap-1.5

            !text-white
            hover:!text-white

            text-sm
            font-semibold

            underline
            underline-offset-4

            cursor-pointer

            transition-all
            duration-200

            hover:opacity-80
            active:scale-95

            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-white/50
            rounded
          "
        >
          {expanded ? "Read Less" : "Read More"}

          <span
            className={`
              text-xs
              transition-transform
              duration-300
              ${expanded ? "rotate-180" : ""}
            `}
          >
            ↓
          </span>
        </button>
      )}
    </div>
  );
}