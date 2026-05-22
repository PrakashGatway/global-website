"use client"

import Image from "next/image"
import Link from "next/link"
import TableOfContents from "@/components/tableofcontent"
import { useForm } from "react-hook-form"
import axiosInstance from "@/app/axiosInstance"
import toast from "react-hot-toast"
import FAQSection from "./faqPage"




export default function BlogDetailsPage({blog,latestBlogs,blogCategory,allBlogs}) {


console.log(blog)

    const {register , handleSubmit, reset , formState : {errors, isSubmitting} } = useForm()


    const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post("/contactus", {
        subject: "Contact Form",
        type: "Website",
        fullName: `${data.name}`,
        email: data.email,
        phone: data.phone,
        destination: data.destination,
        description: data.message,
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

  const currentIndex = allBlogs.findIndex(
  (b: any) => b._id === blog._id
);

const previousBlog =
  currentIndex > 0 ? allBlogs[currentIndex - 1] : null;

const nextBlog =
  currentIndex < allBlogs.length - 1
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

        return html.replace(
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



    const toc = extractTOC(blog.description)

    const htmlWithIds = addHeadingIds(blog.description)

    const headings = extractHeadings(blog.description)

    return (
        <section className="bg-[#f7f9fc] min-h-screen">

            {/* ================= BREADCRUMB NAVIGATION ================= */}
            <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-600">
                <nav className="flex items-center gap-2">
                    <Link href={"/"} ><span className="hover:text-orange-600 cursor-pointer" >Home</span></Link>

                    <span>›</span>
                    <Link href={"/blog"} ><span className="hover:text-orange-600 cursor-pointer" >Blogs</span></Link>

                    <span>›</span>
                    <span className="text-orange-600 font-medium">{blog.title}</span>
                </nav>
            </div>

            {/* ================= HERO SECTION ================= */}
            <div className="relative w-full h-[360px]">
  <div className="absolute inset-0 bg-gray-600/50  flex items-end">

    {/* Main container */}
    <div className=" mx-auto w-full px-4 pb-4 flex items-end justify-between gap-6">

      {/* LEFT SIDE — TEXT */}
      <div className="text-white max-w-3xl px-20">
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold leading-tight mb-4">
          {blog.title}
        </h1>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 text-sm opacity-90">
          <span>Last updated:</span>
          <span>
            {new Date(blog.updatedAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>

          <span>|</span>
          <span>{blog.views} views</span>

          {blog.isFeatured && (
            <span className="px-3 py-1 bg-orange-500 text-xs rounded-full">
              Featured
            </span>
          )}

          <span className="px-3 py-1 bg-orange-500 text-xs rounded-full">
            {blog.blogType}
          </span>
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT SIDE — IMAGE */}
      <div className="relative w-140 h-86 shrink-0">
        <Image
          src={
            blog?.coverImage && blog.coverImage.trim() !== ""
              ? blog.coverImage
              : "https://static-cse.canva.com/blob/1134734/Thepowerofheroimagedesignfeaturedimage.jpg"
          }
          alt={blog.title}
          fill
          className="object-fill rounded-br-[60px] rounded-bl-[60px]"
          priority
          sizes="160px"
        />
      </div>

    </div>
  </div>
</div>
        

            {/* ================= MAIN CONTENT AREA ================= */}
            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5">

                {/* ================= LEFT CONTENT COLUMN ================= */}
                <div className="space-y-8">

                    {/* SHORT DESCRIPTION SECTION */}
                    {blog.shortDescription && (
                        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                            <p className="text-gray-700 leading-relaxed text-lg">
                                {blog.shortDescription}
                            </p>
                        </div>
                    )}

                    {/* TABLE OF CONTENTS - Dynamically generated from headings */}
                    <TableOfContents toc={toc} />


                    {/* MAIN BLOG CONTENT */}
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                        {/* SEO Meta Info (hidden but for structure) */}
                        <div className="sr-only">
                            <h1>{blog.seo?.metaTitle || blog.title}</h1>
                            <p>{blog.seo?.metaDescription}</p>
                            <p>
                                Keywords: {blog.seo?.keywords?.split(",").join(", ")}
                            </p>

                        </div>

                        {/* Blog Content */}
                        <div>
                            <style>{`
    .blog-html table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 15px;
    }

    .blog-html th,
    .blog-html td {
      border: 1px solid #e5e7eb;
      padding: 12px 14px;
      text-align: left;
      vertical-align: top;
    }

    .blog-html th {
      background: #f3f4f6;
      font-weight: 600;
    }

    .blog-html tr:nth-child(even) {
      background-color: #fafafa;
    }

    .blog-html h2 {
      font-size: 26px;
      margin: 28px 0 12px;
      font-weight: 700;
    }

    .blog-html h3 {
      font-size: 20px;
      margin: 22px 0 10px;
      font-weight: 600;
    }

    .blog-html h4 {
      font-size: 18px;
      margin: 18px 0 8px;
      font-weight: 600;
    }

    .blog-html p {
      margin: 12px 0;
      line-height: 1.8;
    }

    .blog-html ul {
      margin-left: 22px;
      list-style: disc;
    }

    .blog-html ol {
      margin-left: 22px;
      list-style: decimal;
    }

    .blog-html li {
      margin: 6px 0;
    }

    .blog-html figure.table {
      overflow-x: auto;
      margin: 20px 0;
    }

    .blog-html strong {
      font-weight: 600;
    }
      html {
      scroll-behavior: smooth;
    }
  `}</style>

                            <div
                                className="blog-html"
                                dangerouslySetInnerHTML={{ __html: htmlWithIds }}
                            />
                        </div>




                        {/* Blog Meta Info at bottom */}
                        <div className="mt-8 pt-6 border-t border-gray-200">

  {/* TAGS */}
  <div className="flex flex-wrap gap-2">
    {blog.tags.map((tag, index) => (
      <span
        key={index}
        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
      >
        #{tag}
      </span>
    ))}
  </div>

  <div className="flex justify-between">
     {/* DATE */}
  <p className="text-sm text-gray-500 mt-4">
    Published on:{" "}
    {new Date(blog.createdAt).toLocaleDateString("en-IN")}
    {blog.updatedAt !== blog.createdAt && (
      <span className="ml-4">
        Last updated:{" "}
        {new Date(blog.updatedAt).toLocaleDateString("en-IN")}
      </span>
    )}

  </p>
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
                <aside className="space-y-6 sticky top-32 h-fit">

                    {/* ================= BLOG ENQUIRY FORM ================= */}
<div className="bg-white/95 relative backdrop-blur-sm p-5 rounded-2xl  border border-primary max-w-130 mx-auto">
 <div className="absolute top-4 right-4 z-10">
  <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-orange-200 px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200">
    {/* Animated Pulse Dot */}
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
    </span>
    
    {/* Text */}
    <span className="text-xs font-bold text-gray-700 whitespace-nowrap">
      Book Free Counselling
    </span>
  </div>
</div>

  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
  
  {/* Name & Mobile Row */}
  <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 pt-5">
    {/* Name */}
    <div className="space-y-1.5">
      <label htmlFor="name" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
        Full Name
      </label>
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <input
          id="name"
          {...register("name", { required: "Name is required" })}
          placeholder="Enter your name"
          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300"
        />
      </div>
      {errors.name && <p className="text-[11px] text-red-500 font-medium">{errors.name.message}</p>}
    </div>

    {/* Mobile */}
    <div className="space-y-1.5">
      <label htmlFor="mobile" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
        Mobile Number
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
          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300"
        />
      </div>
      {errors.mobile && <p className="text-[11px] text-red-500 font-medium">{errors.mobile.message}</p>}
    </div>
  </div>

  {/* Email */}
  <div className="space-y-1.5">
    <label htmlFor="email" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
      Email Address
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
        className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300"
      />
    </div>
    {errors.email && <p className="text-[11px] text-red-500 font-medium">{errors.email.message}</p>}
  </div>

  {/* Destination */}
  <div className="space-y-1.5">
    <label htmlFor="destination" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
      Preferred Destination
    </label>
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <select
        id="destination"
        {...register("destination", { required: "Select destination" })}
        className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all duration-200 appearance-none cursor-pointer text-gray-700 hover:border-gray-300"
      >
        <option value="" disabled className="text-gray-400">Select country</option>
        <option>France</option>
        <option>UK</option>
        <option>USA</option>
        <option>Italy</option>
        <option>Dubai</option>
        <option>Germany</option>
      </select>
      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    {errors.destination && <p className="text-[11px] text-red-500 font-medium">{errors.destination.message}</p>}
  </div>

 

  {/* Checkbox */}
  <div className="flex items-start gap-2.5 pt-1">
    <input
      type="checkbox"
      id="agree"
      {...register("agree", { required: "You must accept terms" })}
      className="mt-1 w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400/30 cursor-pointer transition"
    />
    <label htmlFor="agree" className="text-[12px] text-gray-600 leading-tight cursor-pointer">
      I agree to the <a href="/terms" className="text-orange-600 font-medium hover:underline">terms & privacy policy</a>
    </label>
  </div>
  {errors.agree && <p className="text-[11px] text-red-500 font-medium -mt-2">{errors.agree.message}</p>}

  {/* Submit Button */}
  <button
    type="submit"
    disabled={isSubmitting}
    className="w-full mt-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98]"
  >
    {isSubmitting ? (
      <span className="flex items-center justify-center gap-2">
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
        </svg>
        Processing...
      </span>
    ) : (
      "Book Free Counselling →"
    )}
  </button>
  
 
</form>
</div>

                    {/* ================= LATEST BLOGS ================= */}
<div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
  <h4 className="font-bold text-lg mb-5 text-gray-800">
    Latest Blogs
  </h4>

  <div className="space-y-4">
    {latestBlogs.map((item: any) => (
      <Link
        key={item._id}
        href={`/blog/${item.slug}`}
        className="flex gap-3 group"
      >
        {/* Image */}
        <div className="relative w-20 h-16 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={
              item.coverImage ||
              "https://static-cse.canva.com/blob/1134734/Thepowerofheroimagedesignfeaturedimage.jpg"
            }
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <h5 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-orange-600 transition">
            {item.title}
          </h5>

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
                  <div className="bg-white p-5 rounded-xl border border-gray-200">
  <h4 className="font-semibold text-lg mb-4 text-gray-800">
    Categories
  </h4>

  <div className="flex flex-wrap gap-3">
    {blogCategory.map((cat: any) => (
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
      <FAQSection Faqres={blog.faq} />


        </section>
    )
}