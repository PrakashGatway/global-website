"use client"



import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useTransition } from "react";


export default function BlogGrid({ filteredBlogs }) {

    const [isPending, startTransition] = useTransition()

    const router = useRouter()

    const goToBlog = (slug) => {
        startTransition(() => {
            router.push(`/blog/${slug}`);
        });
    };



    return (
        <>
            <section className=" py-12 sm:py-14 lg:py-16 px-2 relative overflow-hidden bg-white">

                <div className="max-w-7xl mx-auto">

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
                    absolute -top-1 -left-[3px] shadow-xl
                    w-28 h-28 sm:w-36 sm:h-36 lg:w-35 lg:h-35
                    bg-[#FF6B35] -z-10
                  "
                                    />

                                    {/* IMAGE */}
                                    <div
                                        className="" >
                                        <img
                                            src={
                                                post.coverImage ||
                                                "https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg"
                                            }
                                            alt={post.title}
                                            className="w-full h-[210px] object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg"
                                            }}
                                        />



                                    </div>

                                    {/* CONTENT */}
                                    <div className="p-4 pt-2 text-start">

                                        <h3 onClick={() => goToBlog(post.slug)} className="text-gray-900 hover:text-[#FF6B35] cursor-pointer text-lg font-medium mb-1 line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm font-medium mb-2 line-clamp-2">
                                            {post.shortDescription}
                                        </p>
                                        <button
                                            onClick={() => goToBlog(post.slug)}
                                            className="font-medium text-sm text-blue-900 hover:translate-x-2 cursor-pointer border p-1.5 px-3 transition-all duration-300"
                                        >
                                            Read More »
                                        </button>
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