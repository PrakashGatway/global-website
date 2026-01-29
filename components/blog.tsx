"use client"
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Youtube, Send, Linkedin } from "lucide-react";
import UniversitiesSlider from '@/components/PageComponent/UniversitiesSlider';
import { useState } from 'react';

import Link from 'next/link';

export default function Blogs({ Blogdata,
    categoryData,
    page,
    limit,
    total }) {

    const [search, setSearch] = useState("")
    const [activeCategory, setActiveCategory] = useState("all")

    const totalPages = Math.ceil(total / limit)







    const handleCategoryClick = (category) => {
        setActiveCategory(category)
    }


    const filteredBlogs = Blogdata.filter((post) => {
        const matchSearch =
            post.title?.toLowerCase().includes(search.toLowerCase()) ||
            post.shortDescription?.toLowerCase().includes(search.toLowerCase()) ||
            post.category?.name?.toLowerCase().includes(search.toLowerCase())

        const matchCategory =
            activeCategory === "all" ||
            post.category?.name === activeCategory

        return matchSearch && matchCategory
    })







    return (
        <>
            <section className="relative py-10 bg-[#fffaf7] pt-20 overflow-hidden">
                <div className="absolute -left-30 top-[55%] -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block">
                    <div style={{
                        transform: 'rotate(35deg)',
                        filter: 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)',
                        mixBlendMode: 'multiply'
                    }}>
                        <Image
                            src="/images/g logo.png"
                            alt="Decorative Arrow"
                            width={400}
                            height={40}
                            className="w-64 h-66 lg:w-96 lg:h-96 object-contain"
                        />
                    </div>
                </div>
                {/* Decorative Arrow on Right Side */}
                <div className="absolute -right-30 top-[55%] -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block">
                    <Image
                        src="/images/g logo.png"
                        alt="Decorative Arrow"
                        width={400}
                        height={40}
                        className="w-64 h-66 lg:w-96 lg:h-96 object-contain"
                        style={{ transform: 'scaleX(-1) rotate(-35deg)' }}
                    />
                </div>
                <div className="max-w-7xl mx-auto px-2">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <h1 className="text-6xl lg:text-[7.6rem] font-bold text-[#636363] flex items-center justify-center gap-0">
                            BLO
                            <Image
                                src="/images/g logo.png"
                                alt="G Logo"
                                width={120}
                                height={120}
                                className="w-16 h-16 lg:w-35 lg:h-[6.6rem] object-contain "
                            />
                            S
                        </h1>
                        <p className="text-lg font-medium text-gray-600 leading-relaxed max-w-3xl mx-auto">
                            Studying abroad is not only academic experience but it&apos;s a lifetime experience. Global Study Abroad Blog will help you with best resources, advice and tips.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-4xl mx-auto mt-8">
                            <div className="flex flex-col sm:flex-row gap-4 p-2 px-4 rounded-full shadow-lg border border-gray-400">
                                <div className="flex-1 ml-3  flex items-center gap-3">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="What are you looking for?"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="flex-1 outline-none text-gray-700 ml-2"
                                    />

                                </div>
                                <button className="bg-[#4A4A4A] rounded-full hover:bg-gray-700 text-white px-8 py-3 font-bold transition-all mb-0">
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-10">
                <div className="mx-auto px-0">
                    <div
                        className="
    relative
    bg-[#FF6B35]
    p-6 sm:p-8 md:p-12
    overflow-hidden
    min-h-[320px]
    sm:min-h-[360px]
    lg:min-h-[390px]
    bg-[url('/images/map.png')]
    bg-no-repeat
    bg-center
    lg:bg-left
    bg-contain
    lg:bg-[length:50%_auto]
  "
                    >



                        {/* FILTER TAGS */}
                        <div
                            className="
          relative
          z-15
          flex
          flex-col
          gap-3
          mt-6
          items-center

          lg:items-end
          lg:mr-40
          lg:mt-8
        "
                        >
                            {/* ROW 1 */}
                            <div className="flex flex-wrap justify-center lg:justify-end gap-2">
                                <button
                                    onClick={() => setActiveCategory("all")}
                                    className={`
    px-6 py-3 font-semibold
    ${activeCategory === "all"
                                            ? "bg-gray-600 text-white rounded-tl-[20px] "
                                            : "bg-white text-gray-800"}
  `}

                                >
                                    All
                                </button>

                                {categoryData.map((cat) => (
                                    <button
                                        key={cat._id}
                                        onClick={() => handleCategoryClick(cat.name)}
                                        className={`
      px-6 py-3 font-semibold
      transition-all
      ${activeCategory === cat.name
                                                ? "bg-gray-600 text-white rounded-tl-[20px]"
                                                : "bg-white text-gray-800 hover:bg-gray-600 hover:text-white"
                                            }
    `}
                                    >
                                        {cat.name}
                                    </button>
                                ))}

                            </div>


                        </div>
                    </div>
                </div>
            </section>


            {/* Blog Posts Grid */}
            <section className="bg-white py-12 sm:py-14 lg:py-16 px-2 relative overflow-hidden">
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
                    absolute -top-2 -left-2
                    w-28 h-28 sm:w-36 sm:h-36 lg:w-45 lg:h-45
                    rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px]
                    bg-[#FF6B35] -z-10
                  "
                                    />

                                    {/* IMAGE */}
                                    <div
                                        className="
                    relative overflow-hidden bg-gray-300
                    h-[200px] sm:h-[220px] lg:h-[220px]
                    rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px]
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

                                        {/* OVERLAY */}
                                        <div
                                            className="
                      absolute inset-0 bg-black/50
                      flex flex-col items-center justify-center text-center px-4
                      rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px]
                    "
                                        >
                                            <h3 className="text-white text-lg sm:text-xl lg:text-3xl font-semibold mb-2">
                                                {post.title}
                                            </h3>

                                            <p className="text-white text-sm sm:text-base">
                                                {post.category?.name}{" "}
                                                {new Date(post.createdAt).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
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

            {/* Pagination */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex justify-center items-center gap-2 flex-wrap">

                        {/* PREVIOUS */}
                        {page > 1 ? (
                            <Link
                                href={`/blog?page=${page - 1}&limit=${limit}`}
                                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700"
                            >
                                &lt;&lt;
                            </Link>
                        ) : (
                            <span className="px-4 py-2 rounded-lg border border-gray-200 text-gray-400">
                                &lt;&lt;
                            </span>
                        )}

                        {/* PAGE NUMBERS */}
                        {Array.from({ length: totalPages }).map((_, index) => {
                            const pageNumber = index + 1

                            return (
                                <Link
                                    key={pageNumber}
                                    href={`/blog?page=${pageNumber}&limit=${limit}`}
                                    className={`
              px-4 py-2 rounded-full w-10 h-10 font-semibold
              ${page === pageNumber
                                            ? "bg-[#FF6B35] text-white"
                                            : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                                        }
            `}
                                >
                                    {pageNumber}
                                </Link>
                            )
                        })}

                        {/* NEXT */}
                        {page < totalPages ? (
                            <Link
                                href={`/blog?page=${page + 1}&limit=${limit}`}
                                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700"
                            >
                                &gt;
                            </Link>
                        ) : (
                            <span className="px-4 py-2 rounded-lg border border-gray-200 text-gray-400">
                                &gt;
                            </span>
                        )}

                    </div>
                </div>
            </section>




            {/* Join Our Exclusive Study Abroad Network */}
            <section className="py-12 bg-[#FF6B35] relative overflow-visible">
                {/* Decorative Arrow on Left Side */}
                <div className="absolute -left-30 top-30 -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block">
                    <div style={{
                        transform: 'rotate(-20deg)',
                        filter: 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)',
                        mixBlendMode: 'multiply'
                    }}>
                        <Image
                            src="/images/g logo.png"
                            alt="Decorative Arrow"
                            width={400}
                            height={40}
                            className="w-64 h-66 lg:w-96 lg:h-96 object-contain"
                        />
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-2 py-6">
                    <div className="max-w-5xl mx-auto text-center">
                        <h2 className="text-4xl lg:text-[2.6rem] font-bold text-white mb-4">
                            Join Our Exclusive Study Abroad Network
                        </h2>
                        <p className="text-white text-base mb-8 opacity-90">
                            Get updates on what&apos;s happening around in the study abroad space, important notifications on events and journeys of other students
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full sm:w-[500px] px-6 py-3 rounded-none outline-none text-gray-800 bg-white border border-gray-300"
                            />
                            <button className="bg-white text-[#FF6B35] w-full sm:w-[200px] px-6 py-3 rounded-none font-bold hover:bg-gray-100 transition-all whitespace-nowrap">
                                I AM IN
                            </button>
                        </div>
                        <div className="flex justify-center gap-4 mt-6">
                            <button
                                className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer"
                                aria-label="Facebook"
                            >
                                <Facebook size={24} />
                            </button>
                            <button
                                className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer"
                                aria-label="Instagram"
                            >
                                <Instagram size={24} />
                            </button>
                            <button
                                className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer"
                                aria-label="Twitter"
                            >
                                <Twitter size={24} />
                            </button>
                            <button
                                className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer"
                                aria-label="YouTube"
                            >
                                <Youtube size={24} />
                            </button>
                            <button
                                className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer"
                                aria-label="Telegram"
                            >
                                <Send size={24} />
                            </button>
                            <button
                                className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer"
                                aria-label="LinkedIn"
                            >
                                <Linkedin size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <section className='py-12'>
                <UniversitiesSlider />
            </section>


            {/* Book Your Online Counselling Session */}
            <section className="py-12 bg-gray-600 relative overflow-hidden">
                {/* BACKGROUND IMAGE */}
                <div
                    className="absolute inset-0 opacity-80"
                    style={{
                        backgroundImage:
                            "url(https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&h=800&fit=crop)",
                        backgroundSize: "cover",
                        backgroundPosition: "top",
                        filter: "blur(1px)",
                    }}
                ></div>

                <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
                    <div
                        className="
        flex flex-col gap-10
        lg:flex-row lg:justify-between lg:items-start
      "
                    >
                        {/* LEFT CONTENT */}
                        <div className="w-full lg:w-35/80 text-center lg:text-left">
                            <h2 className="text-2xl sm:text-3xl lg:text-6xl font-bold text-white leading-tight">
                                Book Your Online
                                <br />
                                Counselling
                                <br />
                                Session
                            </h2>

                            <p className="text-white text-base sm:text-lg leading-relaxed opacity-80 mt-4">
                                {/* optional text */}
                            </p>
                        </div>

                        {/* FORM */}
                        <div className="bg-white w-full lg:w-40/80 p-6 py-10 sm:py-12 rounded-lg">
                            <form className="space-y-8">
                                <input
                                    type="text"
                                    placeholder="Name *"
                                    className="w-full px-2 py-1.5 border-b border-gray-300 focus:outline-none focus:border-b-2 focus:border-[#FF6B35]"
                                    required
                                />

                                <input
                                    type="tel"
                                    placeholder="Mobile Number *"
                                    className="w-full px-2 py-1.5 border-b border-gray-300 focus:outline-none focus:border-b-2 focus:border-[#FF6B35]"
                                    required
                                />

                                <input
                                    type="email"
                                    placeholder="Email Address *"
                                    className="w-full px-2 py-1.5 border-b border-gray-300 focus:outline-none focus:border-b-2 focus:border-[#FF6B35]"
                                    required
                                />

                                <input
                                    type="text"
                                    placeholder="Preferred Study Destination *"
                                    className="w-full px-2 py-1.5 border-b border-gray-300 focus:outline-none focus:border-b-2 focus:border-[#FF6B35]"
                                />

                                <input
                                    type="text"
                                    placeholder="Message *"
                                    className="w-full px-2 py-1.5 border-b border-gray-300 focus:outline-none focus:border-b-2 focus:border-[#FF6B35]"
                                />

                                <div className="flex items-start">
                                    <input type="checkbox" id="terms" className="mt-1 mr-2" required />
                                    <label htmlFor="terms" className="text-sm text-gray-700">
                                        I agree to the terms and conditions
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full text-white px-6 py-2 rounded-lg font-semibold text-base hover:opacity-90 transition"
                                    style={{ backgroundColor: "#FF6B35" }}
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}