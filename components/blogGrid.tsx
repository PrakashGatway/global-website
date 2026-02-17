"use client"


import Image from "next/image"
import Link from "next/link"


export default function BlogGrid({filteredBlogs}){


    
    return(
        <>
        <section className=" py-12 sm:py-14 lg:py-16 px-2 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="absolute right-[-70px] top-[70%] -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block z-0">
                        <Image
                            src="/images/g logo.png"
                            alt="Decorative Arrow"
                            width={400}
                            height={80}
                            className="w-64 h-66 lg:w-96 lg:h-96 object-contain"
                            style={{ transform: 'scaleX(-1) rotate(-40deg)' }}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12 relative z-[10]">
                        {filteredBlogs.length > 0 ? (
                            filteredBlogs.map((post) => (
                                <div
                                    key={post._id}
                                    className="
                  relative bg-white border border-[#FF6B35]
                  rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px]
                  transition-all duration-300 hover:shadow-xl
                "
                                >
                                    {/* ORANGE BACK SHAPE */}
                                    <div
                                        className="
                    absolute -top-2 -left-[6.5px]
                    w-28 h-28 sm:w-36 sm:h-36 lg:w-35 lg:h-35
                    rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-[20px] lg:rounded-tl-[70px]
                    bg-[#FF6B35] -z-10
                  "
                                    />

                                    {/* IMAGE */}
                                    <div
                                        className="
                    relative overflow-hidden bg-gray-300
                    h-[200px] sm:h-[220px] lg:h-[220px]
                    rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[65px]
                  "
                                    >
                                        <img
                                            src={
                                                post.coverImage ||
                                                "https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg"
                                            }
                                            alt={post.title}
                                            className="w-full h-[220px] object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg"
                                            }}
                                        />

                                       
                                        
                                    </div>

                                    {/* CONTENT */}
                                    <div className="p-3 text-center">
                                        <p className="text-gray-800 text-base font-medium mb-3 line-clamp-2">
                                            {post.shortDescription}
                                        </p>

                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="
    text-white px-6 lg:w-50 py-2 mx-auto
    bg-[#1f2937]
    rounded-tr-4xl
    shadow-[-4px_0px_4px_0px_rgba(0,0,0,0.55)]
    text-sm font-semibold
    hover:bg-[#FF6B35]
    hover:shadow-[-6px_6px_5px_0px_rgba(0,0,0,0.60)]
    flex items-center justify-center gap-2
    transition-all
  "
                                        >
                                            Read More »
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500 text-xl">
                                No blogs found
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}