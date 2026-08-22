"use client"

import Image from "next/image"
import Link from "next/link"
import TableOfContents from "@/components/tableofcontent"
import { useForm } from "react-hook-form"
import axiosInstance from "@/app/axiosInstance"
import toast from "react-hot-toast"
import FAQSection from "./faqPage"
import UniversityCard from "./UniversityCard"
import StudentVisaStories from "./Studentvisa"
import VideoTestimonialsSlider from "./PageComponent/VideoTestimonial"
import { useCallback, useEffect, useState } from "react"
import { useGlobal } from "@/src/statecontext"
import VisaDetails from "./dashboard/VisaDetails/visaDetails"
import { PenBoxIcon } from "lucide-react"
import InnerContent, { BlogContent } from "./dom/DomParser"




export default function BlogDetailsPage({ blog, latestBlogs, blogCategory, allBlogs, uniblog, imageData, videoData, isPreview }: any) {


  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

  // const [visacontent, setVisaContent] = useState([]);
  const { openPopup } = useGlobal();

  // const fetchVisa = useCallback(() => {
  //   const filtervisa = imageData?.filter(
  //     (item) => item.target === "visa"
  //   );
  //   setVisaContent(filtervisa);
  // }, [imageData]);

  // useEffect(() => {
  //   fetchVisa();
  // }, [fetchVisa]);


  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post("/contactus", {
        subject: "Contact Form",
        type: "Website",
        fullName: `${data.name}`,
        email: data.email,
        phone: data.mobile,
        destination: data.destination,
        description: data?.message || "no message",
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

  const currentIndex = allBlogs && allBlogs?.findIndex(
    (b: any) => b._id === blog._id
  );

  const previousBlog =
    currentIndex > 0 ? allBlogs[currentIndex - 1] : null;

  const nextBlog =
    currentIndex < allBlogs?.length - 1
      ? allBlogs[currentIndex + 1]
      : null;




  // Function to extract headings from HTML for Table of Contents
  const extractHeadings = (html: string) => {
    // Simple regex to find h1-h3 tags
    const headingRegex = /<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi
    const headings: string[] = []
    let match

    while ((match = headingRegex.exec(html)) !== null) {
      // Remove HTML tags from the heading text
      const cleanText = match[1].replace(/<[^>]*>/g, '').trim()
      if (cleanText) {
        headings.push(cleanText)
      }
    }

    return headings.length > 0 ? headings : [
      "What is a Student Visa?",
      "Eligibility Requirements",
      "Documents Required",
      "Visa Fees",
      "Processing Time",
      "FAQs"
    ]
  }



  const addHeadingIds = (html: string) => {
    let index = 0

    return html?.replace(
      /<h([1-3])([^>]*)>(.*?)<\/h\1>/gi,
      (match, level, attrs, content) => {
        const id = `heading-${index++}`
        return `<h${level}${attrs} id="${id}">${content}</h${level}>`
      }
    )
  }

  const extractTOC = (html: string) => {
    const regex = /<h([2-3])[^>]*>(.*?)<\/h\1>/gi

    const toc: any[] = []
    let currentH2: any = null
    let index = 0
    let match

    while ((match = regex.exec(html)) !== null) {
      const level = match[1]
      const text = match[2].replace(/<[^>]*>/g, "").trim()
      const id = `heading-${index++}`

      if (level === "2") {
        currentH2 = {
          title: text,
          id,
          children: []
        }
        toc.push(currentH2)
      }

      if (level === "3" && currentH2) {
        currentH2.children.push({
          title: text,
          id
        })
      }
    }

    return toc
  }

  useEffect(() => {
    window.openCounsellingPopup = () => {
      openPopup();
    };

    return () => {
      delete window.openCounsellingPopup;
    };
  }, []);

 


  const toc = extractTOC(blog.description)

  const htmlWithIds = addHeadingIds(blog.description)



  // const cleanedHtml = finalHtml?.replace(/table-layout:\s*fixed;?/gi, "table-layout:auto;")?.replace(/width:\s*[\d.]+pt;?/gi, "width:100%;");
  const headings = extractHeadings(blog.description)

  if (isPreview) {
    return (
      <div className="">
        <div>
          <BlogContent cleanedHtml={htmlWithIds} />

        </div>

        {/* Blog Meta Info at bottom */}
        <div className="mt-8 pt-6 border-t border-gray-200">

          {/* TAGS */}
          <div className="flex flex-wrap gap-2">
            {blog?.tags && blog?.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex justify-between">
            <Link
              href={`/author/sakshi-taneja`}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm">
                {blog?.author?.charAt(0) || "S"}
              </div>

              <div>
                <p className="text-xs text-gray-500">Author</p>
                <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {"Sakshi Taneja"}
                </p>
              </div>
            </Link>

            {/* PREV / NEXT NAVIGATION */}
            <div className="flex justify-between gap-4">

              {/* Previous */}
              {previousBlog ? (
                <Link
                  href={`/blog/${previousBlog.slug}`}
                  className="flex-1 bg-primary border border-gray-200 rounded-lg p-4 hover:bg-[#F46C44] transition"
                >
                  <p className="text-xs text-white ">← Previous</p>

                </Link>
              ) : <div />}

              {/* Next */}
              {nextBlog && (
                <Link
                  href={`/blog/${nextBlog.slug}`}
                  className="flex bg-primary border border-gray-200 rounded-lg p-4 text-right hover:bg-[#F46C44] transition"
                >
                  <p className="text-xs text-white ">Next →</p>

                </Link>
              )}
            </div>
          </div>
        </div>
      </div>)
  }


  return (
    <section className="font-medium min-h-screen ">

      {/* ================= BREADCRUMB NAVIGATION ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50">


        <div className="relative max-w-7xl mx-auto px-4 py-10">

          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/" className="hover:text-[#F36D45] transition">
              Home
            </Link>

            <span>/</span>

            <Link href="/blog" className="hover:text-[#F36D45] transition">
              Blogs
            </Link>

            <span>/</span>

            <span className="text-[#F36D45] font-semibold line-clamp-1">
              {blog.title}
            </span>
          </nav>

          <div className="grid lg:grid-cols-5 gap-6 items-center">
            <div className="lg:col-span-5">
              <h1 className="mt-3 text-3xl md:text-[2.3rem] font-bold leading-snug text-[#1C2E5A]">
                {blog.title}
              </h1>

              {blog.shortDescription && (
                <div className="mt-3 text-base leading-7 text-gray-600">
                  <InnerContent cleanedHtml={blog.shortDescription || ""} />
                </div>
              )}

              {/* Meta */}
              <div className="mt-4 flex flex-wrap gap-6 text-xs text-gray-500">

                <div className="flex items-center gap-2">
                  📅
                  <span>
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  ⏱
                  <span>8 min read</span>
                </div>

                <Link href={`/author/sakshi-taneja`} className="flex items-center gap-2">
                  <PenBoxIcon className="h-4 w-4" />
                  <span>Sakshi Taneja</span>
                </Link>

              </div>

            </div>

            {/* Right */}
            <div className="relative lg:col-span-2">

              {/* <div className="relative overflow-hidden rounded-3xl">

                <Image
                  src={
                    blog?.coverImage?.trim()
                      ? blog.coverImage
                      : "https://static-cse.canva.com/blob/1134734/Thepowerofheroimagedesignfeaturedimage.jpg"
                  }
                  alt={blog.title}
                  width={700}
                  height={500}
                  priority
                  className="h-full w-full object-fit transition duration-700 "
                />

              </div> */}

            </div>

          </div>

        </div>
      </section>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="max-w-7xl mx-auto px-4 py-6 mt-3 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">

        {/* ================= LEFT CONTENT COLUMN ================= */}
        <div className="space-y-4 max-w-5xl">



          {/* SHORT DESCRIPTION SECTION */}
          <div className="relative overflow-hidden rounded-3xl">

            <Image
              src={
                blog?.coverImage?.trim()
                  ? blog.coverImage
                  : "https://static-cse.canva.com/blob/1134734/Thepowerofheroimagedesignfeaturedimage.jpg"
              }
              alt={blog.title}
              width={700}
              height={500}
              priority
              className="h-full w-full object-fit transition duration-700 "
            />

          </div>

          {/* TABLE OF CONTENTS - Dynamically generated from headings */}
          <TableOfContents toc={toc} />


          {/* MAIN BLOG CONTENT */}
          <div className="">
            <div>
              <BlogContent cleanedHtml={htmlWithIds} />

            </div>

            {/* Blog Meta Info at bottom */}
            <div className="mt-8 pt-6 border-t border-gray-200">

              {/* TAGS */}
              <div className="flex flex-wrap gap-2">
                {blog?.tags && blog?.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between">
                <Link
                  href={`/author/sakshi-taneja`}
                  className="flex items-center gap-2 group"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm">
                    {blog?.author?.charAt(0) || "S"}
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Author</p>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {"Sakshi Taneja"}
                    </p>
                  </div>
                </Link>

                {/* PREV / NEXT NAVIGATION */}
                <div className="flex justify-between gap-4">

                  {/* Previous */}
                  {previousBlog ? (
                    <Link
                      href={`/blog/${previousBlog.slug}`}
                      className="flex-1 bg-primary border border-gray-200 rounded-lg p-4 hover:bg-[#F46C44] transition"
                    >
                      <p className="text-xs text-white ">← Previous</p>

                    </Link>
                  ) : <div />}

                  {/* Next */}
                  {nextBlog && (
                    <Link
                      href={`/blog/${nextBlog.slug}`}
                      className="flex bg-primary border border-gray-200 rounded-lg p-4 text-right hover:bg-[#F46C44] transition"
                    >
                      <p className="text-xs text-white ">Next →</p>

                    </Link>
                  )}
                </div>
              </div>





            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <aside className="space-y-3 sticky top-24 h-fit">

          {/* ================= BLOG ENQUIRY FORM ================= */}
          <div className="relative w-full max-w-md p-[3px] bg-[#f46c44] sm:ml-auto">
            <div className="relative bg-white shadow-2xl overflow-hidden h-full">

              {/* Top Header */}
              <div className="absolute rounded-br-3xl top-0 left-0 bg-gradient-to-r from-[#EA6C46] to-[#EA6C46]/80 px-4 py-2 z-10">
                <h3 className="text-white text-sm font-medium">
                  Book Your Free Consultation
                </h3>
              </div>

              {/* Stats */}
              <div className="mt-8 flex items-center justify-center gap-8 py-2 border-b border-gray-200 text-[#0b2545] font-semibold text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📚</span>
                  <span>100 + Courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">👨‍🎓</span>
                  <span>10K + Counseled</span>
                </div>
              </div>

              {false ? (
                <div className="py-10 px-6 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto">
                    ✓
                  </div>
                  <h4 className="mt-4 text-2xl font-bold text-[#0b2545]">
                    Thank You!
                  </h4>
                  <p className="text-sm text-gray-500 mt-2">
                    Our counsellor will contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="block text-xs font-semibold text-[#0b2545] uppercase tracking-wider">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <input
                          id="name"
                          {...register("name", { required: "Name is required" })}
                          placeholder="Enter your name"
                          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d] transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300"
                        />
                      </div>
                      {errors.name && <p className="text-[11px] text-red-500 font-medium">{errors.name.message as string}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="mobile" className="block text-xs font-semibold text-[#0b2545] uppercase tracking-wider">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <input
                          id="mobile"
                          {...register("mobile", {
                            required: "Mobile number required",
                            pattern: { value: /^[0-9]{10}$/, message: "Enter valid 10 digit number" },
                          })}
                          placeholder="10-digit mobile"
                          type="tel"
                          inputMode="numeric"
                          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d] transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300"
                        />
                      </div>
                      {errors.mobile && <p className="text-[11px] text-red-500 font-medium">{errors.mobile.message as string}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="block text-xs font-semibold text-[#0b2545] uppercase tracking-wider">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <input
                          id="email"
                          {...register("email", {
                            required: "Email required",
                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                          })}
                          placeholder="your@email.com"
                          type="email"
                          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d] transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300"
                        />
                      </div>
                      {errors.email && <p className="text-[11px] text-red-500 font-medium">{errors.email.message as string}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="destination" className="block text-xs font-semibold text-[#0b2545] uppercase tracking-wider">
                        Destination <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <select
                          id="destination"
                          {...register("destination", { required: "Select destination" })}
                          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d] transition-all duration-200 appearance-none cursor-pointer text-gray-700 hover:border-gray-300"
                        >
                          <option value="" disabled className="text-gray-400">Select country</option>
                          {["USA", "UK", "France", "Germany", "Italy", "Dubai", "New Zealand", "Australia"].map((c) => (
                            <option key={c} value={c.toLowerCase()}>
                              Study In {c}
                            </option>
                          ))}
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      {errors.destination && <p className="text-[11px] text-red-500 font-medium">{errors.destination.message as string}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="agree"
                      {...register("agree", { required: "You must accept terms" })}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-[#F46C44] focus:ring-[#ff6b3d]/30 cursor-pointer transition"
                    />
                    <label htmlFor="agree" className="text-[12px] text-[#0b2545] leading-tight cursor-pointer">
                      I agree to the <a href="/terms-condition" className="text-[#F46C44] font-medium hover:underline">terms & privacy policy</a>
                    </label>
                  </div>
                  {errors.agree && <p className="text-[11px] text-red-500 font-medium -mt-2">{errors.agree.message as string}</p>}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 bg-[#F46C44] hover:bg-[#bf341f] transition-all text-white font-bold py-2.5 rounded-md text-xl shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2 text-base">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ================= LATEST BLOGS ================= */}
          <div className="bg-white p-4 border-2 border-gray-200">
            <h3 className="font-bold text-lg mb-5 text-gray-800">
              Latest Blogs
            </h3>

            <div className="space-y-2">
              {latestBlogs && latestBlogs?.map((item: any) => (
                <Link
                  key={item._id}
                  href={`/blog/${item.slug}`}
                  className="flex gap-1 group bg-gray-50"
                >
                  {/* Image */}
                  <div className="relative w-28 h-20 shrink-0 overflow-hidden">
                    <Image
                      src={
                        item.coverImage ||
                        "https://static-cse.canva.com/blob/1134734/Thepowerofheroimagedesignfeaturedimage.jpg"
                      }
                      loading="lazy"
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col p-2">
                    <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-orange-600 transition">
                      {item.title}
                    </h4>

                    <span className="text-xs text-gray-500 mt-1">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ================= BLOG CATEGORIES ================= */}
          <div className="bg-white p-4 border border-gray-200">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">
              Categories
            </h3>

            <div className="flex flex-wrap gap-3">
              {blogCategory && blogCategory?.map((cat: any) => (
                <Link
                  key={cat._id}
                  href={`/blog?category=${cat.slug || cat.name}`}
                  className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700
                   hover:bg-orange-500 hover:text-white
                   transition-all duration-200"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ================= COMMENTS SECTION ================= */}
      {/* <div className="max-w-5xl mx-auto px-4 pb-20">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h4 className="font-semibold text-lg mb-4">0 comments</h4>

                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            className="flex-1 border border-gray-300 rounded-full px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-200">
                            Post
                        </button>
                    </div>

                
                    <div className="mt-6">
                        <p className="text-gray-500 text-center py-4">
                            No comments yet. Be the first to comment!
                        </p>
                    </div>
                </div>
            </div> */}

      <div className="relative max-w-7xl  mx-auto pt-6 pl-4 lg:pl-0">
        <h2 className="text-xl   mb-8 ">
          <span className="text-primary lg:text-4xl font-semibold" >
            Top universities for Indian students
          </span>
        </h2>

      </div>
      {uniblog && <UniversityCard university={uniblog?.result} perView={3} />}

      {/* <VideoTestimonialsSlider items={videoData}/> */}
      {/* <div className="py-10">
        <StudentVisaStories stories={visacontent} isSameLine={"no"} />

      </div> */}

      <VisaDetails />

      <section className="relative bg-[#ee6a43] overflow-hidden py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-0">

          {/* Text */}
          <div className="text-white relative z-10">
            <span className="text-xl sm:text-3xl md:text-4xl font-semibold leading-tight">{blog?.extraMetadata?.ctaTitle}</span>

            <br /> <span
              className="mt-4 text-sm sm:text-base lg:text-lg max-w-xl text-white/90"

            >{blog?.extraMetadata?.ctaDescription}</span>
            <div className="mt-4">
              <a href="/contact">
                <button className="bg-secondary hover:bg-primary px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium shadow-md hover:scale-105 transition text-xs sm:text-base">
                  Contact US
                </button>
              </a>
            </div>
          </div>

          {/* Decorative circle — only on lg */}
          <div className="hidden lg:flex relative h-[325px] items-center justify-center">
            <img
              src="/images/circle stand.png"
              alt=""
              className="absolute z-10 w-[90px] bottom-0"
              style={{ right: "calc(50% - 45px)" }}
            />
            <img
              src="/images/circle.png"
              alt=""
              className="w-80 xl:w-96 animate-spin [animation-duration:60s]"
            />
          </div>
        </div>

        <img
          src="/images/country-building-img.png"
          alt=""
          className="absolute bottom-0 right-0 w-2/3 sm:w-1/2 object-contain pointer-events-none"
        />
        <div className="absolute bottom-0 left-0 w-full sm:w-1/2 h-2 sm:h-3 bg-yellow-400" />
      </section>

      <FAQSection Faqres={blog?.faq || []} />

    </section>
  )
}

