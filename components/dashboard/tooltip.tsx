"use client";
import { useState } from "react";
import { Info } from "lucide-react";

export default function Tooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* ICON */}
      <div className="ml-2 cursor-pointer">
        <Info className="w-4 h-4 text-gray-400" />
      </div>

      {/* TOOLTIP */}
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-8 w-72 z-50">
          <div className="relative bg-slate-600 text-white text-xs p-4 rounded-lg shadow-xl">
            {text}

            {/* ARROW */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-3 h-3 bg-slate-600 rotate-45" />
          </div>
        </div>
      )}
    </div>
  );
}
