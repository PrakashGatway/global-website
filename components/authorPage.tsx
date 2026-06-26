"use client"

import axiosInstance from "@/app/axiosInstance"
import { Linkedin, Twitter } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AuthorPage({ author }) {
    const [blogs, setblogs] = useState([])
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);




    useEffect(() => {
        const fetchblog = async (page) => {
            try {
                const res = await axiosInstance.get(`/blogs?page=${page}&limit=10`);


                console.log(res.data);

                setblogs(res.data.data);
                setTotalPages(res.data.pages)
            } catch (error) {
                console.error(error);
                toast.error("Something went wrong...");
            }
        };

        fetchblog(page);
    }, [author.name, page]);






    return (
        <>
            <div className="min-h-screen  flex items-center justify-center py-10 px-4 max-w-7xl mx-auto grid grid-cols-1">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">

                    {/* header: name + role */}
                    <div
                        className="relative overflow-hidden rounded-t-lg"
                        style={{
                            backgroundColor: "#f46c44",
                            backgroundImage:
                                "url('https://www.transparenttextures.com/patterns/back-pattern.png')",
                        }}
                    >


                        {/* Main Header */}
                        <div className="relative  px-6 md:px-10 py-8">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                                {/* Left Section */}
                                <div className="flex items-center gap-5">
                                    <img
                                        src={author.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcxSIkbDpRi11M201gRDRamK_4nK4D1rGbeGT3LUJM3g&s=10"}
                                        alt={author.name}
                                        className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white object-cover shadow-lg"
                                    />

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h1 className="text-3xl font-bold text-white">
                                                {author.name}
                                            </h1>

                                            <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                                ✓
                                            </span>
                                        </div>

                                        <p className="text-white/90 text-lg mt-1">
                                            {author.role}
                                        </p>

                                        {/* <div className="flex gap-3 mt-4">
  <a
    href={author.linkedin}
    target="_blank"
    rel="noopener noreferrer"
    className="w-9 h-9 rounded bg-white text-[#006d77] flex items-center justify-center hover:scale-110 transition"
  >
    <Linkedin size={18} />
  </a>

  <a
    href={author.twitter}
    target="_blank"
    rel="noopener noreferrer"
    className="w-9 h-9 rounded bg-white text-[#006d77] flex items-center justify-center hover:scale-110 transition"
  >
    <Twitter size={18} />
  </a>
</div> */}

                                    </div>
                                </div>

                                {/* Right Stats */}
                                {/* <div className="flex gap-10 text-white">
        <div className="text-center">
          <h3 className="text-4xl font-bold">592</h3>
          <p className="text-white/80">Posts</p>
        </div>

        <div className="text-center">
          <h3 className="text-4xl font-bold">45.6L</h3>
          <p className="text-white/80">Reads</p>
        </div>
      </div> */}

                            </div>
                        </div>
                    </div>

                    {/* about section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 p-5">
                        <div className="md:col-span-2 space-y-3">
                            <h2 className="text-xs uppercase tracking-[0.15em] text-[#1e3a5f] font-semibold border-b border-[#ed6c02] inline-block pb-1">
                                About
                            </h2>
                            <p className="text-[#2c241a] text-base leading-relaxed">
                                <span className="font-semibold text-[#1e3a5f]">{author.name}</span> – {author.title}
                            </p>
                            <p className="text-[#2c241a] text-base leading-relaxed">
                                <span className="font-medium text-[#1e3a5f]">Education:</span> {author.education}
                            </p>
                            <p className="text-[#2c241a] text-base leading-relaxed">
                                <span className="font-medium text-[#1e3a5f]">Expertise:</span> {author.expertise}
                            </p>
                            <p className="text-[#2c241a] text-base leading-relaxed">
                                {author.about}
                                <span className="text-[#ed6c02] font-medium"> {author.exams.slice(0, 4).join(', ')}</span>
                                <span className="text-[#ed6c02] font-medium"> {author.exams.slice(4).join(', ')}</span>
                                {author.exams.length > 0 && ' and other popular exams.'}
                            </p>
                            {/* <p className="text-[#2c241a] text-sm pt-1">
                                <span className="font-medium text-[#1e3a5f]">Contact:</span>{' '}
                                <a href={`mailto:${author.email}`} className="text-[#ed6c02] hover:underline">
                                    {author.email}
                                </a>
                            </p> */}
                        </div>
                        <div className="bg-[#faf7f1] border border-[#e8dfd3] p-4 rounded-sm self-start">
                            <h3 className="text-xs uppercase tracking-[0.1em] text-[#1e3a5f] font-semibold border-b border-[#d9cdbc] pb-1 mb-2">
                                Specializes in
                            </h3>
                            <p className="text-[#2c241a] font-medium text-base">{author.specializes}</p>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {author.exams.slice(0, 5).map((exam) => (
                                    <span key={exam} className="bg-[#fef3e8] text-[#ed6c02] text-xs px-2 py-0.5 rounded border border-[#ed6c02]/20">
                                        {exam}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>



                    {/* subtle footer – classical */}

                </div>
                <div>
                    {/* articles section */}
                    <div className="mt-8 pt-2 border-t-2 border-[#d9cdbc] bg-[#fffcf7] shadow-[0_12px_28px_rgba(0,0,0,0.08)] border border-[#e8dfd3] rounded-sm y-8 px-6 md:px-10 md:py-6">
                        <h2 className="text-sm uppercase tracking-[0.15em] text-[#1e3a5f] font-semibold mb-4 flex items-center gap-2">
                            <span className="bg-[#ed6c02] w-1.5 h-5 inline-block"></span>
                            Articles
                        </h2>

                        <div className="space-y-6">
                            {blogs.map((article) => (
                                <div
                                    key={article._id}
                                    className="flex flex-col md:flex-row gap-4 border-b border-[#e8dfd3] pb-5 last:border-0"
                                >
                                    {/* Left Image */}
                                    <div className="w-full md:w-52 flex-shrink-0">
                                        <img
                                            src={article.coverImage}
                                            alt={article.title}
                                            className="w-full h-32 md:h-36 object-cover rounded-lg"
                                        />
                                    </div>

                                    {/* Right Content */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-[#1e3a5f] hover:text-[#ed6c02] transition-colors">
                                            {article.title}
                                        </h3>

                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-[#5f4e3c]">
                                            <span>
                                                {new Date(article.createdAt).toLocaleDateString()}
                                            </span>

                                            <span className="flex items-center gap-1">
                                                <i className="far fa-eye text-[#ed6c02]"></i>
                                                {article.views} Views
                                            </span>

                                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                                                {article.status}
                                            </span>
                                        </div>

                                        <p className="mt-3 text-gray-600 text-sm line-clamp-3">
                                            {article.shortDescription}
                                        </p>

                                        <a
                                            href={`/blog/${article.slug}`}
                                            className="inline-flex items-center mt-3 text-[#ed6c02] font-medium hover:underline"
                                        >
                                            Read More →
                                        </a>
                                    </div>
                                </div>
                            ))}

                            <div className="flex items-center justify-center mt-8 gap-2">
                                {/* Previous */}
                                <button
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                    className={`flex items-center px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200
      ${page === 1
                                            ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                                            : "border-gray-300 bg-white text-gray-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 shadow-sm"
                                        }`}
                                >
                                    ← Previous
                                </button>

                                {/* Page Numbers */}
                                <div className="flex items-center gap-2">
                                    {[...Array(totalPages)].map((_, index) => {
                                        const pageNumber = index + 1;

                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => setPage(pageNumber)}
                                                className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-200
            ${page === pageNumber
                                                        ? "bg-orange-500 text-white shadow-lg scale-105"
                                                        : "bg-white border border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-500 hover:text-orange-600"
                                                    }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Next */}
                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === totalPages}
                                    className={`flex items-center px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200
      ${page === totalPages
                                            ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                                            : "border-gray-300 bg-white text-gray-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 shadow-sm"
                                        }`}
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}