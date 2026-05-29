"use client";
import axiosInstance from "@/app/axiosInstance";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Inter } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";

const inter = Inter({
    subsets: ["latin"],
});

type LeadForm = {
    fullName: string;
    email: string;
    phone: string;
    degree: string;
    state: string;
    branch: string;
    agreeTerms: boolean;
};

export default function YesItalyLanding() {
    const [form, setForm] = useState<LeadForm>({
        fullName: "",
        email: "",
        phone: "",
        degree: "",
        state: "",
        branch: "",
        agreeTerms: false,
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const degrees = [
        "Select Degree*",
        "Bachelor's Degree",
        "Master's Degree",
        "Other"
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.agreeTerms) {
            toast.error("Please agree to receive information from Yes Italy");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                fullName: form.fullName,
                email: form.email,
                phone: form.phone,
                destination: "Italy",
                subject: "Study Abroad Enquiry - YES Italy",
                type: "landingPage",
                source: "website",
                city: form.city,
                state: form.state,
                description: `Degree Interest: ${form.degree}, Nearest Branch: ${form.branch}`,
            };

            await axiosInstance.post("/contactus", payload);
            toast.success("Form submitted successfully! We'll contact you soon.");
            router.push("/thank-you");
            setSubmitted(true);

            setTimeout(() => {
                setSubmitted(false);
                setForm({
                    fullName: "",
                    email: "",
                    phone: "",
                    degree: "",
                    state: "",
                    branch: "",
                    agreeTerms: false,
                });
            }, 3000);
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit the form. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen bg-white ${inter.className}`}>

            <header className={`sticky top-0 py-1 z-40 bg-white transition-all duration-300 ${'shadow-none'}`}>
                <div className="max-w-7xl overflow-hidden mx-auto px-4 flex items-center justify-between h-16">
                    <div className="items-center text-end gap-2">
                        <Link href="/">
                            <Image
                                src="/images/newlogo3.png"
                                alt="Logo"
                                width={900}
                                height={100}
                                className={`object-contain w-28 m-auto py-1 lg:w-32 `}
                                priority
                            />
                        </Link>
                    </div>

                    <a href="tel:+918302092630">
                        <button
                            className="inline-flex justify-center items-center gap-2 bg-[#f46c44] hover:bg-[#ea6c46] text-white font-semibold px-5 py-2.5 rounded shadow-[-4px_0px_4px_0px_rgba(0,0,0,0.25)] transition-all"
                        >
                            📞 <span>+91 8302092630</span>
                        </button>
                    </a>
                </div>
            </header>
            {/* Header Section */}
            <section className="py-8 bg-gradient-to-b from-[#fff7f3] to-white">
                <div className="max-w-7xl mx-auto px-4">

                    <div className="grid lg:grid-cols-2 gap-10">

                        {/* LEFT CONTENT */}
                        <div className="pt-4 sm:pt-12">
                            <span className="inline-block text-sm px-4 py-2 bg-[#F46C44]/10 text-[#F46C44] font-semibold rounded-full">
                                Contact Ooshas Global
                            </span>

                            <h2 className="mt-6 text-3xl sm:text-5xl font-semibold text-[#0b2545] leading-tight">
                                Elevate your education and future with
                                <span className="text-[#F46C44]">
                                    {" "} Ooshas Global
                                </span>
                            </h2>

                            <p className="mt-5 text-base sm:text-lg text-[#0b2545]/80 leading-relaxed font-medium">
                                Connect with our expert counsellors and get personalized
                                guidance for admissions, scholarships, visa assistance,
                                university selection and career planning.
                            </p>
                        </div>

                        {/* RIGHT FORM */}
                        <div>
                            <div className="relative w-full max-w-xl mx-auto">

                                {/* ORANGE BORDER */}
                                <div className="bg-[#F46C44] p-1.5 shadow-[0_20px_60px_rgba(244,108,68,0.25)]">

                                    <div className="bg-white relative overflow-hidden">

                                        {/* TOP LABEL */}
                                        <div className="absolute top-0 left-0 bg-gradient-to-r from-[#EA6C46] to-[#F46C44] px-5 py-2 rounded-br-3xl">
                                            <h3 className="text-white font-medium">
                                                Book Your Free Consultation
                                            </h3>
                                        </div>

                                        {/* STATS */}
                                        <div className="mt-10 flex justify-center gap-10 py-2 border-b border-gray-200">

                                            <div className="text-center">
                                                <h4 className="text-xl font-bold text-[#0b2545]">
                                                    100+
                                                </h4>
                                                <p className="text-xs font-medium text-gray-500">
                                                    Courses
                                                </p>
                                            </div>

                                            <div className="w-px bg-gray-200" />

                                            <div className="text-center">
                                                <h4 className="text-xl font-bold text-[#0b2545]">
                                                    10K+
                                                </h4>
                                                <p className="text-xs font-medium text-gray-500">
                                                    Counseled
                                                </p>
                                            </div>
                                        </div>

                                        {/* FORM */}
                                        <form onSubmit={handleSubmit} className="p-6 space-y-5">

                                            {/* Name + Mobile */}
                                            <div className="grid md:grid-cols-2 gap-4">

                                                <div>
                                                    <label className="text-sm font-semibold text-[#0b2545] block mb-1">
                                                        Full Name *
                                                    </label>

                                                    <input
                                                        type="text"
                                                        required
                                                        value={form.fullName}
                                                        onChange={(e) =>
                                                            setForm({
                                                                ...form,
                                                                fullName: e.target.value,
                                                            })
                                                        }
                                                        placeholder="Enter Full Name"
                                                        className="w-full h-11 px-4 border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#F46C44] outline-none transition-all"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-sm font-semibold text-[#0b2545] block mb-1">
                                                        Mobile Number *
                                                    </label>

                                                    <input
                                                        type="tel"
                                                        required
                                                        value={form.phone}
                                                        onChange={(e) =>
                                                            setForm({
                                                                ...form,
                                                                phone: e.target.value,
                                                            })
                                                        }
                                                        placeholder="Enter Mobile Number"
                                                        className="w-full h-11 px-4 border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#F46C44] outline-none transition-all"
                                                    />
                                                </div>
                                            </div>

                                            {/* Email + Degree */}
                                            <div className="grid md:grid-cols-2 gap-4">

                                                <div>
                                                    <label className="text-sm font-semibold text-[#0b2545] block mb-1">
                                                        Email Address *
                                                    </label>

                                                    <input
                                                        type="email"
                                                        required
                                                        value={form.email}
                                                        onChange={(e) =>
                                                            setForm({
                                                                ...form,
                                                                email: e.target.value,
                                                            })
                                                        }
                                                        placeholder="Enter Email Address"
                                                        className="w-full h-11 px-4 border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#F46C44] outline-none transition-all"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-sm font-semibold text-[#0b2545] block mb-1">
                                                        Degree *
                                                    </label>

                                                    <select
                                                        required
                                                        value={form.degree}
                                                        onChange={(e) =>
                                                            setForm({
                                                                ...form,
                                                                degree: e.target.value,
                                                            })
                                                        }
                                                        className="w-full h-11 px-4 border border-gray-200 bg-gray-50 focus:border-[#F46C44] outline-none"
                                                    >
                                                        {degrees.map((degree) => (
                                                            <option key={degree} value={degree}>
                                                                {degree}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* State */}
                                            <div>
                                                <label className="text-sm font-semibold text-[#0b2545] block mb-1">
                                                    State *
                                                </label>

                                                <input
                                                    type="text"
                                                    required
                                                    value={form.state}
                                                    onChange={(e) =>
                                                        setForm({
                                                            ...form,
                                                            state: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Enter State"
                                                    className="w-full h-11 px-4 border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#F46C44] outline-none transition-all"
                                                />
                                            </div>

                                            {/* Branch */}
                                            <div>
                                                <label className="text-sm font-semibold text-[#0b2545] block mb-1">
                                                    Nearest Branch *
                                                </label>

                                                <input
                                                    type="text"
                                                    required
                                                    value={form.branch}
                                                    onChange={(e) =>
                                                        setForm({
                                                            ...form,
                                                            branch: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Enter Branch"
                                                    className="w-full h-11 px-4 border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#F46C44] outline-none transition-all"
                                                />
                                            </div>

                                            {/* Checkbox */}
                                            <label className="flex items-start gap-3 text-sm text-[#0b2545] cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={form.agreeTerms}
                                                    onChange={(e) =>
                                                        setForm({
                                                            ...form,
                                                            agreeTerms: e.target.checked,
                                                        })
                                                    }
                                                    className="mt-1"
                                                />

                                                <span>
                                                    I agree to receive information from Ooshas Global.
                                                </span>
                                            </label>

                                            {/* Submit */}
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-[#F46C44] hover:bg-[#e15d37] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 text-lg transition-all duration-300"
                                            >
                                                {loading ? "Submitting..." : "Book Free Consultation"}
                                            </button>

                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
            {submitted && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl transform animate-[fadeIn_0.3s_ease-out]">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-[#0b2545] mb-2">Thank You!</h3>
                        <p className="text-gray-600">Our counsellor will contact you shortly.</p>
                    </div>
                </div>
            )}

        </div>
    );
}