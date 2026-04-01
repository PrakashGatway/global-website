"use client";

import { Link } from "lucide-react";

const destinations = [
  // Left column
  { name: "United States", href: "/destination/study-in-usa", img: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80", col: "left", size: "tall" },
  { name: "Germany", href: "/destination/study-in-germany", img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80", col: "left-row", size: "mid" },
  { name: "UK", href: "/destination/study-in-uk", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80", col: "left-row", size: "mid" },
  // Middle column
  { name: "Canada", href: "#", img: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&q=80", col: "mid", size: "short" },
  { name: "France", href: "#", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80", col: "mid", size: "mid" },
  { name: "Ireland", href: "#", img: "https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=800&q=80", col: "mid", size: "short" },
  // Right column
  { name: "Australia", href: "#", img: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80", col: "right-row", size: "mid" },
  { name: "Dubai", href: "#", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80", col: "right-row", size: "mid" },
  { name: "Italy", href: "#", img: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80", col: "right", size: "tall" },
];

function DestCard({ name, href, img, height }) {
  return (
    <Link
      href={href}
      className={`group relative block rounded-2xl overflow-hidden flex-1 min-w-0 ${height}`}
    >
      <img
        src={img}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent transition-all duration-300 group-hover:from-black/65" />
      {/* Label */}
      <span className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-10 bg-black/80 group-hover:bg-[#F46C44]/90 backdrop-blur-sm text-white font-bold text-xs lg:text-sm px-5 py-1.5 rounded-lg whitespace-nowrap tracking-wide transition-all duration-300 group-hover:-translate-y-1 group-hover:-translate-x-1/2">
        {name}
      </span>
    </Link>
  );
}

export default function StudyDestinations({ homePage }) {
  const [title1, title2] = homePage.studyDestinations.title.split("||");

  return (
    <section className="max-w-7xl mx-auto py-10 px-4">

      {/* Heading */}
      <div className="mb-9">
        <h2>
          <span className="text-[#F46C44] font-light block text-xl lg:text-3xl">{title1}</span>
          <span className="font-bold text-2xl lg:text-5xl text-primary relative inline-block">
            {title2}
            <span className="absolute right-0 -bottom-1 w-20 h-[3px] bg-[#F46C44] rounded-full" />
          </span>
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-3">
          <DestCard name="United States" href="/destination/study-in-usa"
            img="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80"
            height="h-48 lg:h-52" />
          <div className="flex gap-3">
            <DestCard name="Germany" href="/destination/study-in-germany"
              img="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80"
              height="h-40 lg:h-44" />
            <DestCard name="UK" href="/destination/study-in-uk"
              img="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80"
              height="h-40 lg:h-44" />
          </div>
        </div>

        {/* MIDDLE COLUMN */}
        <div className="flex flex-col gap-3">
          <DestCard name="Canada" href="#"
            img="https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&q=80"
            height="h-28 lg:h-32" />
          <DestCard name="France" href="#"
            img="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80"
            height="h-40 lg:h-44" />
          <DestCard name="Ireland" href="#"
            img="https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=800&q=80"
            height="h-28 lg:h-32" />
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1">
          <div className="flex gap-3">
            <DestCard name="Australia" href="#"
              img="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80"
              height="h-40 lg:h-44" />
            <DestCard name="Dubai" href="#"
              img="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80"
              height="h-40 lg:h-44" />
          </div>
          <DestCard name="Italy" href="#"
            img="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80"
            height="h-48 lg:h-52" />
        </div>

      </div>
    </section>
  );
}