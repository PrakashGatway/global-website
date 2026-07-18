// app/universities/components/UniversityCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';

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
     <div className="group bg-white overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      
      {/* Image */}
      <div className="relative h-40 overflow-hidden shrink-0">
        <Image
          src={
            uni?.cover_photo
              ? uni?.cover_photo
              : "https://etimg.etb2bimg.com/photo/121373442.cms"
          }
          alt={uni.name}
          className="w-full h-full object-cover transition-transform duration-700"
          onError={(e) => {
            e.currentTarget.src =
              "https://etimg.etb2bimg.com/photo/121373442.cms";
          }}
          width={400}
          height={160}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent"></div>
      </div>

      {/* Inner wrapper */}
      <div className="p-1 relative flex flex-col flex-1">
        
        {/* Top Content (Logo, Name, Address) */}
        {/* 'shrink-0' ensures this section never collapses */}
        <div className="relative px-4 shrink-0">
          <div className="-mt-14 relative z-10">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white p-1 shadow-lg border-4 border-white overflow-hidden">
              <Image
                src={uni.uni_logo || "/images/newlogo3.png"}
                alt={uni.name}
                className=""
                onError={(e) => {
                  e.currentTarget.src = "/images/fevi-icon.png";
                }}
                width={64}
                height={40}
              />
            </div>
          </div>
          <div className="mt-1">
            <h3 className="font-semibold text-gray-900 line-clamp-2">
              {uni.name}
            </h3>
            <div className="flex items-center text-gray-500 mt-2">
              <MapPin size={18} className="mr-1 shrink-0" />
              <span className="text-xs line-clamp-1">{uni.address}</span>
            </div>
          </div>
        </div>

        {/* Middle Content (Slogan, Intakes, Tags) */}
        {/* 'flex-1' makes this section grow to fill any extra vertical space */}
        <div className="relative flex px-4 pt-3 flex-col flex-1">
          {/* Slogan */}
          {uni.slogan && (
            <p className="text-xs text-muted-foreground italic mb-3 line-clamp-2">
              "{uni.slogan}"
            </p>
          )}

          {/* Intakes */}
          {uni.intakes && uni.intakes.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Intakes
              </p>
              <div className="flex flex-wrap gap-1">
                {uni.intakes.slice(0, 3).map((intake, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-primary/10 text-primary font-medium rounded"
                  >
                    {intake}
                  </span>
                ))}
                {uni.intakes.length > 3 && (
                  <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                    +{uni.intakes.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {/* {uni.tags && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {uni.tags
                .split(",")
                .slice(0, 3)
                .map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 capitalize py-0.5 bg-muted/50 text-xs text-muted-foreground border border-border/50 rounded"
                  >
                    {tag.trim()}
                  </span>
                ))}
            </div>
          )} */}
        </div>

        {/* 2. Footer */}
        {/* 'mt-auto' pushes this element to the very bottom of the flex container */}
        <div className="flex mt-auto px-5 py-2 pb-4 w-full">
          {/* Added 'w-full' so 'justify-end' correctly pushes buttons to the right edge */}
          <div className="flex gap-2 justify-end items-center w-full">
            <Link href={`/universities/${uni.slug}`}>
              <button className="bg-secondary hover:bg-primary text-white px-3 md:px-5 py-1.5 md:py-2 rounded text-xs md:text-sm font-medium transition-colors whitespace-nowrap">
                View Details
              </button>
            </Link>
            <Link href={`/dashboard`}>
              <button className="hover:bg-secondary bg-primary text-white px-3 md:px-5 py-1.5 md:py-2 rounded text-xs md:text-sm font-medium transition-colors whitespace-nowrap">
                Apply
              </button>
            </Link>
          </div>
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