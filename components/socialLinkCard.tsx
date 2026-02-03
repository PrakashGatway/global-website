"use client";

import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

interface SocialLinksProps {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

export default function SocialLinksCard({
  facebook,
  twitter,
  instagram,
  linkedin,
}: SocialLinksProps) {
  return (
    <div
      className="
        hidden lg:flex
        fixed left-4 top-1/2 -translate-y-1/2
        z-50
        flex-col gap-7
        bg-orange-500
        border border-gray-300
        rounded-xl
        p-3
        shadow-lg
      "
    >
      {facebook && (
        <a
          href={facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-600 transition"
        >
          <Facebook className="w-5 h-5" />
        </a>
      )}

      {twitter && (
        <a
          href={twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-600 transition"
        >
          <Twitter className="w-5 h-5" />
        </a>
      )}

      {instagram && (
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-600 transition"
        >
          <Instagram className="w-5 h-5" />
        </a>
      )}

      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-600 transition"
        >
          <Linkedin className="w-5 h-5" />
        </a>
      )}
    </div>
  );
}
