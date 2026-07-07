// app/universities/components/UniversityCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

interface UniversityCardProps {
  uni: {
    _id: string;
    name: string;
    slug: string;
    address: string;
    image?: string;
    logo?: string;
  };
}

export default function UniversityCard({ uni }: UniversityCardProps) {
  return (
    <div className="group bg-white overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <Image
          src={uni.image || "https://www.mapleleafschools.com/assets/top-universities-india-hero-BhWm9a1d.jpg"}
          alt={uni.name}
          fill
          className="object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative px-4">
        <div className="-mt-8 relative z-10">
          <div className="w-14 h-14 rounded-full bg-white p-1 shadow-lg border-4 border-white overflow-hidden">
            <Image
              src={uni.logo || "https://ooshasglobal.com/images/fevi-icon.png"}
              alt={uni.name}
              width={50}
              height={50}
              className="rounded-full object-cover w-full h-full"
            />
          </div>
        </div>
        <div className="mt-1">
          <h3 className="font-bold text-gray-900 line-clamp-2">
            {uni.name}
          </h3>
          <div className="flex items-center text-gray-500 mt-2">
            <MapPin size={18} className="mr-1" />
            <span className="text-xs">{uni.address}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 px-5 py-2">
        <div className="flex gap-2 justify-between items-center">
          <Link href={`/universities/${uni.slug}`}>
            <button className="bg-secondary hover:bg-primary text-white px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold transition-colors whitespace-nowrap">
              View Details
            </button>
          </Link>
          <Link href={`/universities/${uni.slug}`}>
            <button className="bg-secondary hover:bg-primary text-white px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold transition-colors whitespace-nowrap">
              Apply
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}


// app/universities/components/UniversityListSkeleton.tsx
export function UniversityListSkeleton() {
  return (
    <>
      {Array.from({ length: 9 }).map((_, index) => (
        <div key={index} className="bg-white overflow-hidden border border-gray-200 animate-pulse">
          {/* Image Skeleton */}
          <div className="relative h-40 bg-gray-200"></div>
          
          {/* Content Skeleton */}
          <div className="relative px-4">
            <div className="-mt-8 relative z-10">
              <div className="w-14 h-14 rounded-full bg-gray-200 border-4 border-white"></div>
            </div>
            <div className="mt-1 space-y-2">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
          
          {/* Footer Skeleton */}
          <div className="mt-3 px-5 py-2">
            <div className="flex gap-2 justify-between items-center">
              <div className="h-8 bg-gray-200 rounded-full w-24"></div>
              <div className="h-8 bg-gray-200 rounded-full w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}