"use client"
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Youtube, Send, Linkedin } from "lucide-react";
import UniversitiesSlider from '@/components/PageComponent/UniversitiesSlider';
import { useEffect, useState, useTransition } from 'react';

import Link from 'next/link';
import BlogGrid from './blogGrid';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axiosInstance from '@/app/axiosInstance';


export default function Blogs({ Blogdata,
    categoryData,
    page,
    limit,
    total }) {

    const [search, setSearch] = useState("")
    const [activeCategory, setActiveCategory] = useState("all");
    const [isPending, startTransition] = useTransition();


    const totalPages = Math.ceil(total / limit)




    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    useEffect(() => {
        const cat = searchParams.get("category") || "all";
        setActiveCategory(cat);
    }, [searchParams]);



    const handleCategoryClick = (category) => {
        setActiveCategory(category); // instant UI update

        const params = new URLSearchParams(searchParams.toString());
        params.set("category", category);
        params.set("page", "1");
        startTransition(() =>
            router.push(`${pathname}?${params.toString()}`)
        )
    };

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

    const onSubmit = async (data) => {
        try {
            const res = await axiosInstance.post("/contactus", {
                subject: "contactform",
                type: "Website",
                fullName: data.name,
                email: data.email,
                phone: data.phone,
                destination: data.destination,
                description: data.description
            })

            if (res.status === 200 || res.status === 201) {
                toast.success("Message sent successfully ✅");
                reset();
            } else {
                toast.error("Failed to send message ❌");
            }

        }
        catch {
            toast.error("Somthing went wrong ❌")
        }
    }




    const filteredBlogs = Blogdata.filter((post) => {
        return (
            post.title?.toLowerCase().includes(search.toLowerCase()) ||
            post.shortDescription?.toLowerCase().includes(search.toLowerCase()) ||
            post.category?.name?.toLowerCase().includes(search.toLowerCase())
        );
    });







    return (
        <>
           
            <section className="relative py-8 sm:py-12 lg:py-20 bg-[#fffaf7] overflow-hidden">

  <div className="max-w-7xl mx-auto px-3 sm:px-6">
    
    <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">

      {/* Heading */}
      <h1 className="text-3xl sm:text-5xl lg:text-[7.6rem] font-bold text-[#636363] flex items-center justify-center gap-1 sm:gap-2">
        
        BLO

        <Image
          src="/images/g logo.png"
          alt="G Logo"
          width={120}
          height={120}
          className="w-8 h-8 sm:w-12 sm:h-12 lg:w-35 lg:h-[6.6rem] object-contain"
        />

        S
      </h1>

      {/* Subtitle */}
      <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-600 leading-relaxed max-w-3xl mx-auto px-1">
        Studying abroad is not only academic experience but it&apos;s a lifetime experience. 
        Global Study Abroad Blog will help you with best resources, advice and tips.
      </p>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mt-4 sm:mt-8">
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-2 sm:p-2.5 px-3 sm:px-4 rounded-full shadow-lg border border-gray-400">

          {/* Input */}
          <div className="flex-1 flex items-center gap-2 sm:gap-3">
            
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            <input
              type="text"
              placeholder="What are you looking for?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-gray-700 text-sm sm:text-base"
            />

          </div>

          {/* Button */}
          <button className="w-full sm:w-auto bg-[#4A4A4A] rounded-full hover:bg-gray-700 text-white px-5 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-bold transition-all">
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
    px-2 sm:p-8 md:p-12
    overflow-hidden
    min-h-[250px]
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
          absolute
          lg:-right-10
          z-15
          flex
          flex-col
          gap-3
          mt-6
          items-center

          lg:items-left
          lg:mr-40
          lg:mt-8
          max-w-160

        "
                        >
                            {/* ROW 1 */}
                            <div className="flex flex-wrap justify-center lg:justify-left gap-2 ">
                                <button
                                    onClick={() => {
                                        setActiveCategory("all");
                                        router.push(pathname);
                                    }}
                                    className={`
    px-6 py-3 font-semibold
    ${activeCategory === "all"
                                            ? "bg-gray-600 text-white rounded-tl-[20px] text-sm lg:text-base"
                                            : "bg-white text-gray-800"}
  `}

                                >
                                    All
                                </button>

                                {categoryData.map((cat) => (
                                    <button
                                        key={cat._id}
                                        onClick={() => handleCategoryClick(cat.slug)}
                                        className={`
      px-6 py-3 font-semibold
      transition-all
      ${activeCategory === cat.slug
                                                ? "bg-gray-600 text-white rounded-tl-[20px] text-sm lg:text-base "
                                                : "bg-white text-gray-800 hover:bg-gray-600 hover:text-white lg:text-base text-sm"
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
            <BlogGrid filteredBlogs={filteredBlogs} />

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
            <section className="py-6 sm:py-8 lg:py-10 bg-[#FF6B35] relative overflow-visible">
      
  <div className="container mx-auto px-3 sm:px-6">
    
    <div className="max-w-4xl mx-auto text-left lg:text-center">

      {/* Heading */}
      <h2 className="text-lg sm:text-2xl lg:text-5xl font-bold text-white mb-2 sm:mb-4">
        Join Our Exclusive Study Abroad Network
      </h2>

      {/* Subtext */}
      <p className="text-white text-xs sm:text-sm lg:text-lg mb-4 sm:mb-6 lg:mb-8 opacity-90">
        Get updates on what's happening around in the study abroad space,
        important notifications on events and journeys of other students
      </p>

      {/* Input + Button */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6 sm:mb-8 justify-start lg:justify-center">
        
        <input
          type="email"
          placeholder="Email"
          className="w-full sm:w-[500px] px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-none outline-none text-gray-800 bg-white border border-gray-300"
        />

        <button
          className="w-full sm:w-[200px] px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-white text-[#FF6B35] rounded-none font-bold hover:bg-gray-100 transition-all whitespace-nowrap"
        >
          I AM IN
        </button>

      </div>

      {/* Social Icons */}
      <div className="flex justify-start lg:justify-center gap-2 sm:gap-4 mt-4 sm:mt-6">
        {[Facebook, Instagram, Twitter, Youtube, Send, Linkedin].map((Icon, i) => (
          <button
            key={i}
            className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer"
            aria-label={Icon.name}
          >
            <Icon size={18} className="sm:hidden" />
            <Icon size={20} className="hidden sm:block lg:hidden" />
            <Icon size={24} className="hidden lg:block" />
          </button>
        ))}
      </div>

    </div>
  </div>
</section>
            <section className='py-12'>
                <UniversitiesSlider />
            </section>


            {/* Book Your Online Counselling Session */}
           <section className="py-6 sm:py-10 lg:py-12 bg-gray-600 relative overflow-hidden">

  {/* Background */}
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

  <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-10 relative z-10">
    
    <div className="flex flex-col gap-6 sm:gap-10 lg:flex-row lg:justify-between lg:items-start">

      {/* LEFT CONTENT */}
      <div className="w-full lg:w-35/80 text-left lg:text-left">
        
        <h2 className="text-xl sm:text-3xl lg:text-6xl font-bold text-white leading-tight">
          Book Your Online <br />
          Counselling <br />
          Session
        </h2>

        <p className="text-white text-sm sm:text-base lg:text-lg opacity-80 mt-2 sm:mt-4">
          {/* optional text */}
        </p>

      </div>

      {/* FORM */}
      <div className="bg-white w-full lg:w-40/80 p-4 sm:p-6 lg:py-10 rounded-lg shadow-md">
        
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6 lg:space-y-8"
        >

          {/* Name */}
          <div>
            <input
              {...register("name", { required: "full name is required" })}
              type="text"
              placeholder="Name *"
              className="w-full text-sm sm:text-base px-2 py-2 border-b border-gray-300 focus:outline-none focus:border-b-2 focus:border-[#FF6B35]"
            />
            {errors.name && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              {...register("phone", { required: "phone number is required" })}
              type="tel"
              placeholder="Mobile Number *"
              className="w-full text-sm sm:text-base px-2 py-2 border-b border-gray-300 focus:outline-none focus:border-b-2 focus:border-[#FF6B35]"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              {...register("email", { required: "email is required" })}
              type="email"
              placeholder="Email Address *"
              className="w-full text-sm sm:text-base px-2 py-2 border-b border-gray-300 focus:outline-none focus:border-b-2 focus:border-[#FF6B35]"
            />
            {errors.email && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Destination */}
          <div>
            <input
              {...register("destination", { required: "destination is required" })}
              type="text"
              placeholder="Preferred Study Destination *"
              className="w-full text-sm sm:text-base px-2 py-2 border-b border-gray-300 focus:outline-none focus:border-b-2 focus:border-[#FF6B35]"
            />
            {errors.destination && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {errors.destination.message}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <input
              {...register("description")}
              type="text"
              placeholder="Message *"
              className="w-full text-sm sm:text-base px-2 py-2 border-b border-gray-300 focus:outline-none focus:border-b-2 focus:border-[#FF6B35]"
            />
          </div>

          {/* Checkbox */}
          <div className="flex items-start gap-2">
            <input
              {...register("terms", { required: "You must agree to the terms" })}
              type="checkbox"
              id="terms"
              className="mt-1"
            />
            <label htmlFor="terms" className="text-xs sm:text-sm text-gray-700">
              I agree to the terms and conditions
            </label>
          </div>

          {errors.terms && (
            <p className="text-red-500 text-xs sm:text-sm -mt-2">
              {errors.terms.message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full text-white px-6 py-2.5 rounded-lg font-semibold text-sm sm:text-base hover:opacity-90 transition active:scale-95"
            style={{ backgroundColor: "#FF6B35" }}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>

        </form>

      </div>

    </div>
  </div>
</section>
        </>
    )
}