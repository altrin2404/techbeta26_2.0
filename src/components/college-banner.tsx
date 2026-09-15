"use client";

import Image from "next/image";

export function CollegeBanner() {
  return (
    <div className="w-full bg-[#eef8fc] py-2.5 sm:py-4 shadow-sm overflow-hidden rounded-2xl sm:rounded-3xl">
      <div className="container mx-auto px-2 sm:px-4 max-w-7xl">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          <div className="relative flex-grow h-14 sm:h-28 md:h-40 min-w-[120px]">
            <Image 
              src="/img/banner.jpeg" 
              alt="College Header" 
              fill
              sizes="(max-width: 640px) 70vw, (max-width: 1024px) 60vw, 50vw"
              className="object-contain object-left"
              priority
            />
          </div>

          <div className="relative w-14 h-14 sm:w-28 sm:h-28 md:w-40 md:h-40 flex-shrink-0">
            <Image 
              src="/img/brigitz-logo.png" 
              alt="Brigitz Logo" 
              fill
              sizes="(max-width: 640px) 56px, (max-width: 1024px) 112px, 160px"
              className="object-contain object-right"
              priority
            />
          </div>

        </div>
      </div>
    </div>
  );
}
