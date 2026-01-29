import Image from "next/image"
import { serverInstance } from "@/app/axiosInstance"
import { notFound } from "next/navigation"
import Link from "next/link"
import TableOfContents from "@/components/tableofcontent"


// Define types
interface BlogSEO {
    metaTitle: string
    metaDescription: string
    keywords: string[]
}

interface Blog {
    _id: string
    title: string
    slug: string
    description: string
    shortDescription: string
    coverImage: string
    seo: BlogSEO
    tags: string[]
    status: string
    isFeatured: boolean
    views: number
    createdAt: string
    updatedAt: string
    __v: number
}

export default async function BlogDetailsPage({

    params,
}: {
    params: { slug: string }
}) {








    const { slug } = await params

    let blog: Blog

    try {
        const res = await serverInstance.get(`/blogs/${slug}`)
        blog = res.data.data
        console.log("Blog Data:", blog)
    } catch (error) {
        console.error("Error fetching blog:", error)
        return notFound()
    }


    const res = await serverInstance.get("/blogs/categories")
    const blogCategory = res.data.data
    console.log(blogCategory)


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
            <div className="relative w-full h-[420px]">
                <Image
                    src={
                        blog?.coverImage && blog.coverImage.trim() !== ""
                            ? blog.coverImage
                            : "https://static-cse.canva.com/blob/1134734/Thepowerofheroimagedesignfeaturedimage.jpg"
                    }
                    alt={blog.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end">
                    <div className="max-w-7xl mx-auto px-4 pb-12 w-full">
                        <div className="text-white">
                            {/* Blog title and meta */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                                {blog.title}
                            </h1>

                            {/* Last updated date */}
                            <div className="flex items-center gap-4 text-sm opacity-90">
                                <span>Last updated: </span>
                                <span>
                                    {new Date(blog.updatedAt).toLocaleDateString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </span>
                                <span className="px-1">|</span>
                                <span>{blog.views} views</span>
                                {blog.isFeatured && (
                                    <>

                                        <span className="px-3 py-1 bg-orange-500 text-white text-xs rounded-full">Featured</span>
                                    </>
                                )}

                                <span className="px-3 py-1 bg-orange-500 text-white text-xs rounded-full">{blog.blogType}</span>
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
                            <p>Keywords: {blog.seo?.keywords?.join(', ')}</p>
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
                            <p className="text-sm text-gray-500 mt-4">
                                Published on: {new Date(blog.createdAt).toLocaleDateString("en-IN")}
                                {blog.updatedAt !== blog.createdAt && (
                                    <span className="ml-4">
                                        Last updated: {new Date(blog.updatedAt).toLocaleDateString("en-IN")}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ================= RIGHT SIDEBAR ================= */}
                <aside className="space-y-6 sticky top-18 h-fit">

                    {/* ================= BLOG CATEGORIES ================= */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <h4 className="font-bold text-lg mb-4 text-gray-800">
                            Blog Categories
                        </h4>

                        <ul className="space-y-3">
                            {blogCategory.map((cat: any) => (
                                <li key={cat._id}>
                                    <Link
                                        href={`/blog?category=${cat._id || cat.name}`}
                                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-[#FF6B35] transition-all"
                                    >
                                        <span>{cat.name}</span>

                                        <span className="ml-auto mr-2 bg-orange-500 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                                            {cat.totalBlogs}
                                        </span>

                                        <span className="text-sm">→</span>
                                    </Link>

                                </li>
                            ))}
                        </ul>
                    </div>


                    {/* ACTION CARD 2 */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <h4 className="font-bold text-lg mb-4 text-gray-800">
                            I want FREE assistance with
                        </h4>

                        <div className="space-y-3">
                            <button className="w-full bg-blue-50 hover:bg-orange-100 text-orange-600 font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-between px-4">
                                <span>Finding University</span>
                                <span>→</span>
                            </button>

                            <button className="w-full bg-blue-50 hover:bg-orange-100 text-orange-600 font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-between px-4">
                                <span>Finding Courses</span>
                                <span>→</span>
                            </button>

                            <button className="w-full bg-blue-50 hover:bg-orange-100 text-orange-600 font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-between px-4">
                                <span>Study Abroad Loans</span>
                                <span>→</span>
                            </button>

                            <button className="w-full bg-blue-50 hover:bg-orange-100 text-orange-600 font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-between px-4">
                                <span>Test Prep (IELTS, PTE)</span>
                                <span>→</span>
                            </button>
                        </div>
                    </div>

                    {/* CERTIFICATIONS CARD */}
                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-b-2xl border border-gray-200 shadow-sm">

                        {/* Orange accent strip */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-orange-500 rounded-t-2xl"></div>

                        <h4 className="font-bold text-lg text-gray-800 mb-5 leading-snug">
                            India’s Most Trusted <span className="text-orange-500">Study Abroad Platform</span>
                            <br />
                            Certified By
                        </h4>

                        <div className="grid grid-cols-2 gap-4">

                            {["ICEF", "CIAC", "BRITISH COUNCIL", "CCA"].map((item, index) => (
                                <div
                                    key={index}
                                    className="group bg-white border border-gray-200 rounded-xl h-14 flex items-center justify-center
                   font-semibold text-gray-700 tracking-wide
                   transition-all duration-300
                   hover:border-orange-400 hover:shadow-md hover:-translate-y-1 text-center"
                                >
                                    <span className="group-hover:text-orange-500 transition-colors duration-300">
                                        {item}
                                    </span>
                                </div>
                            ))}

                        </div>
                    </div>


                    {/* PROMOTIONAL CARD */}
                    <div className="bg-gradient-to-br from-gray-500 to-gray-600 text-white p-6 rounded-xl shadow-lg">
                        <h4 className="font-bold text-xl mb-2">Hand Picked Courses</h4>
                        <p className="text-orange-100 mb-4">Get Scholarship Assistance</p>

                        <div className="bg-white/20 p-4 rounded-lg mb-4">
                            <p className="font-bold text-lg">Get Offer in 15 Days*</p>
                            <p className="text-sm">Finance/Loan Assistance</p>
                        </div>

                        <button className="w-full bg-white text-orange-600 hover:bg-orange-50 font-bold py-3 rounded-lg transition-colors duration-200">
                            Apply Now
                        </button>
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