"use client"

import axiosInstance from "@/app/axiosInstance"
import { Linkedin, Twitter } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AuthorPage({ author }) {
    const [blogs, setblogs] = useState([])


    useEffect(() => {
        const fetchblog = async () => {
            try {
                const res = await axiosInstance.get("/blogs?limit=50");

                const filteredBlogs = res.data.data.filter(
                    (item) =>
                        item.author?.toLowerCase() === author.name?.toLowerCase()
                );

                console.log(filteredBlogs);

                setblogs(filteredBlogs);
            } catch (error) {
                console.error(error);
                toast.error("Something went wrong...");
            }
        };

        fetchblog();
    }, [author.name]);



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
          src={author.image || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=cover"}
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

          <div className="flex gap-3 mt-4">
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
</div>
        </div>
      </div>

      {/* Right Stats */}
      <div className="flex gap-10 text-white">
        <div className="text-center">
          <h3 className="text-4xl font-bold">592</h3>
          <p className="text-white/80">Posts</p>
        </div>

        <div className="text-center">
          <h3 className="text-4xl font-bold">45.6L</h3>
          <p className="text-white/80">Reads</p>
        </div>
      </div>
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
                            <p className="text-[#2c241a] text-sm pt-1">
                                <span className="font-medium text-[#1e3a5f]">Contact:</span>{' '}
                                <a href={`mailto:${author.email}`} className="text-[#ed6c02] hover:underline">
                                    {author.email}
                                </a>
                            </p>
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}