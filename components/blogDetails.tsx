"use client"

import Image from "next/image"
import Link from "next/link"
import TableOfContents from "@/components/tableofcontent"
import { useForm } from "react-hook-form"
import axiosInstance from "@/app/axiosInstance"
import toast from "react-hot-toast"




export default function BlogDetailsPage({blog,latestBlogs,blogCategory,allBlogs}) {




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
            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">

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
 <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-md border border-gray-200">
      <h4 className="font-bold text-lg mb-4 text-gray-800">
        Book Free Counselling
      </h4>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Name */}
        <div>
          <input
            {...register("name", { required: "Name is required" })}
            placeholder="Name *"
            className="w-full border-b border-gray-300 py-2 outline-none focus:border-orange-500"
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>

        {/* Mobile */}
        <div>
          <input
            {...register("mobile", {
              required: "Mobile number required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter valid 10 digit number",
              },
            })}
            placeholder="Mobile Number *"
            className="w-full border-b border-gray-300 py-2 outline-none focus:border-orange-500"
          />
          {errors.mobile && (
            <p className="text-red-500 text-xs">{errors.mobile.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            {...register("email", {
              required: "Email required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email",
              },
            })}
            placeholder="Email Address *"
            className="w-full border-b border-gray-300 py-2 outline-none focus:border-orange-500"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        {/* Destination */}
        <select
          {...register("destination", {
            required: "Select destination",
          })}
          className="w-full border-b border-gray-300 py-2 outline-none bg-transparent focus:border-orange-500"
        >
          <option value="">Preferred Study Destination *</option>
          <option>Canada</option>
          <option>UK</option>
          <option>USA</option>
          <option>Australia</option>
          <option>Germany</option>
        </select>
        {errors.destination && (
          <p className="text-red-500 text-xs">
            {errors.destination.message}
          </p>
        )}

        {/* Message */}
        <textarea
          rows={3}
          {...register("message", { required: "Message required" })}
          placeholder="Message *"
          className="w-full border-b border-gray-300 py-2 outline-none focus:border-orange-500"
        />
        {errors.message && (
          <p className="text-red-500 text-xs">{errors.message.message}</p>
        )}

        {/* Checkbox */}
        <label className="flex gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            {...register("agree", {
              required: "You must accept terms",
            })}
          />
          I agree to the terms and conditions
        </label>
        {errors.agree && (
          <p className="text-red-500 text-xs">{errors.agree.message}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
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
            <div className="max-w-5xl mx-auto px-4 pb-20">
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

                    {/* Comments will appear here */}
                    <div className="mt-6">
                        <p className="text-gray-500 text-center py-4">
                            No comments yet. Be the first to comment!
                        </p>
                    </div>
                </div>
            </div>

        </section>
    )
}