"use client"
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Youtube, Send, Linkedin, MessageSquare } from "lucide-react";
import UniversitiesSlider from '@/components/PageComponent/UniversitiesSlider';
import { useEffect, useState, useTransition } from 'react';

import Link from 'next/link';
import BlogGrid from './blogGrid';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axiosInstance from '@/app/axiosInstance';
import UniversitySliderClient from './PageComponent/Unversity';


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

    const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post("/contactus", {
        subject: "Contact Form",
        type: "Website",
        fullName: data.Name,
        email: data.email,
        phone: data.phone,
        destination: data.destination,
        description: "form",
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Message sent successfully ✅");
        reset();
      } else {
        toast.error("Failed to send message ❌");
      }
    } catch (error) {
      toast.error("Failed to send message ❌");
    }
  };




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
  {[
    {
      Icon: Facebook,
      link: "https://www.facebook.com/share/18vb1scYJk/?mibextid=wwXIfr",
    },
    {
      Icon: Instagram,
      link: "https://www.instagram.com/ooshasglobal",
    },
    {
      Icon: Youtube,
      link: "https://youtube.com/@ooshasglobal",
    },
    {
      Icon: Linkedin,
      link: "https://www.linkedin.com/",
    },
  ].map(({ Icon, link }, i) => (
    <a
      key={i}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer"
      aria-label={Icon.name}
    >
      <Icon size={18} className="sm:hidden" />
      <Icon size={20} className="hidden sm:block lg:hidden" />
      <Icon size={24} className="hidden lg:block" />
    </a>
  ))}
</div>

    </div>
  </div>
</section>
            <section className='py-12 bg-white'>
                      <UniversitySliderClient />
                
            </section>


            {/* Book Your Online Counselling Session */}
           <section id="contact-form" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
               Send Us a Message
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Have question about studying abroad ? Fill out the form below and our education experts will get back to you within 24 hours
              </p>

              <div className="space-y-6">
                {[{
                  title : "Why Choose Us?",
                  subtitle : "Get personalized guidance from experienced counselors who understand your academic goals and career aspirations."
                },{
                  title : "Quick Response",
                  subtitle : "Our team ensures a quick response within 24 hours. For urgent queries, feel free to call us directly."
                }].map((point, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <MessageSquare className="h-6 w-6" style={{ color: '#FF6B35' }} />
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">{point.title}</h4>
                      <p className="text-gray-600">{point.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Name *
                  </label>
                  <input
                    {...register("Name", { required: "First name is required" })}
                    type="text"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Email Address *
                  </label>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    type="email"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Phone Number *
                  </label>
                  <input
                    maxLength={10}
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Please enter a valid 10-digit phone number"
                      }
                    })}
                    type="tel"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Country to Study
                  </label>
                  <select
                    {...register("destination")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                  >
                    <option value="">Select Destination</option>
                    <option value="usa">Study in USA</option>
                    <option value="uk">Study in UK</option>
                    <option value="canada">Study in France</option>
                    <option value="australia">Study in Italy</option>
                    <option value="germany">Study in Germany</option>
                    <option value="france">Study in Dubai</option>
                  </select>
                </div>



                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms-contact"
                    {...register("terms", { required: "You must agree to the terms" })}
                    className="mt-1 mr-3"
                  />
                  <label htmlFor="terms-contact" className="text-sm text-gray-700">
                    I agree to receive updates and promotional materials from Ooshas Global
                  </label>
                  {errors.terms && (
                    <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full text-white px-6 py-4 rounded-lg font-bold text-lg transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
                  style={{ backgroundColor: '#FF6B35', borderTopRightRadius: '25px' }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
        </>
    )
}