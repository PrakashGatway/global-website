"use client"

import axiosInstance from "@/app/axiosInstance"
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
                <div className="w-full  bg-[#fffcf7] shadow-[0_12px_28px_rgba(0,0,0,0.08)] border border-[#e8dfd3] rounded-sm py-8 px-6 md:px-10 transition-all">

                    {/* header: name + role */}
                    <div className="flex flex-wrap items-baseline justify-between border-b-2 border-[#d9cdbc] pb-3 mb-5">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-semibold text-[#1e3a5f] tracking-wide">
                                {author.name}
                            </h1>
                            <p className="text-sm text-[#5f4e3c] italic mt-0.5">{author.role}</p>
                        </div>
                        <span className="text-sm font-medium text-[#ed6c02] bg-[#fef3e8] px-3 py-1 rounded-full border border-[#ed6c02]/20">
                            {author.specializes}
                        </span>
                    </div>

                    {/* about section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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