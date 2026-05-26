"use client";
import axiosInstance from "@/app/axiosInstance";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const inter = Inter({
    subsets: ["latin"],
});

type LeadForm = {
    name: string;
    email: string;
    phone: string;
    course: string;
};

const testimonials = [
    {
        id: 1,
        name: "Yashaswi Bansode",
        date: "7 June, 2025",
        image:
            "https://randomuser.me/api/portraits/women/44.jpg",
        review:
            "I had a wonderful experience with Yes Germany Consultancy. Their team was incredibly supportive throughout the entire process and helped me achieve my dream.",
    },

    {
        id: 2,
        name: "Saathwick Senthilkumar",
        date: "4 May, 2025",
        image:
            "https://randomuser.me/api/portraits/men/32.jpg",
        review:
            "Yes Germany Abroad Consultation made my dream of studying in Germany come true! They secured visa dates quickly and guided me perfectly.",
    },

    {
        id: 3,
        name: "Mansi Joshi",
        date: "1 May, 2025",
        image:
            "https://randomuser.me/api/portraits/women/68.jpg",
        review:
            "The team treats students very professionally and personally. They answered every query with kindness and helped throughout the journey.",
    },

    {
        id: 4,
        name: "Rahul Sharma",
        date: "20 April, 2025",
        image:
            "https://randomuser.me/api/portraits/men/75.jpg",
        review:
            "From university applications to visa process, everything was smooth and stress-free. Highly recommended for Germany study abroad guidance.",
    },

    {
        id: 5,
        name: "Priya Verma",
        date: "11 March, 2025",
        image:
            "https://randomuser.me/api/portraits/women/90.jpg",
        review:
            "Amazing support and transparent process. Their counselors genuinely care about students and help with every small detail.",
    },
];

export function TestimonialSection() {
    return (
        <section className="bg-[#F36D45] py-16 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">

                {/* Heading */}
                <h2 className="text-center text-white text-3xl sm:text-5xl font-semibold mb-16">
                    Student Feedbacks
                </h2>
                <div className="relative">

                    {/* Infinite Slider */}
                    <motion.div
                        className="flex gap-6"
                        animate={{
                            x: ["0%", "-50%"],
                        }}
                        transition={{
                            duration: 20,
                            ease: "linear",
                            repeat: Infinity,
                        }}
                    >
                        {[...testimonials, ...testimonials].map(
                            (testimonial, index) => (
                                <div
                                    key={index}
                                    className="min-w-[320px] max-w-[320px] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-300"
                                >
                                    {/* User */}
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />

                                        <div>
                                            <h3 className="text-lg font-semibold text-black line-clamp-1">
                                                {testimonial.name}
                                            </h3>
                                            <p className="text-gray-500 text-sm mt-px">
                                                {testimonial.date}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stars */}
                                    <div className="flex items-center gap-1 mt-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={18}
                                                className="fill-[#f7b500] text-[#f7b500]"
                                            />
                                        ))}
                                    </div>

                                    {/* Review */}
                                    <p className="mt-3 text-[#222] text-base line-clamp-5">
                                        {testimonial.review}
                                    </p>

                                    {/* Read More */}
                                    <button className="mt-4 text-gray-500 hover:text-black transition-colors">
                                        Read more
                                    </button>
                                </div>
                            )
                        )}
                    </motion.div>
                </div>

                {/* Bottom CTA */}
                <div className="flex justify-center mt-14">
                    <button className="border-2 rounded-full hover:bg-[#bb1f34] text-white px-6 py-3 text-lg font-semibold shadow-xl transition-all duration-300 hover:scale-103">
                        Connect with Experts to Choose the Right Course
                    </button>
                </div>

            </div>
        </section>
    );
}

export default function GermanyLanding() {
    const [popupOpen, setPopupOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [form, setForm] = useState<LeadForm>({ name: "", email: "", phone: "", course: "" });
    const [heroForm, setHeroForm] = useState<LeadForm>({ name: "", email: "", phone: "", course: "" });
    const [submitted, setSubmitted] = useState(false);
    const [heroSubmitted, setHeroSubmitted] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const t = setTimeout(() => setPopupOpen(true), 6000);
        return () => clearTimeout(t);
    }, []);

    const closePopup = () => setPopupOpen(false);

    const handleSubmit = async (
        e: React.FormEvent,
        isHero = false
    ) => {
        e.preventDefault();

        try {
            const currentForm = isHero ? heroForm : form;
            const payload = {
                fullName: currentForm.name,
                email: currentForm.email,
                phone: currentForm.phone,
                destination: "Italy",
                subject: "Study Abroad Enquiry",
                type: "website-form",
                source: "website",
                city: currentForm.city || "",
                description: `Course Interest: ${currentForm.course}`,
            };
            await axiosInstance.post("/contactus", payload);
            toast.success("Form submitted successfully");
            if (isHero) {
                setHeroSubmitted(true);

                setTimeout(() => {
                    setHeroSubmitted(false);

                    setHeroForm({
                        name: "",
                        email: "",
                        phone: "",
                        course: "",
                    });
                }, 2000);
            }
            else {
                setSubmitted(true);
                setTimeout(() => {
                    setSubmitted(false);
                    setPopupOpen(false);

                    setForm({
                        name: "",
                        email: "",
                        phone: "",
                        course: "",
                    });
                }, 2000);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit the form. Please try again.");
        }
    };

    const faqs = [
        { q: "Are Bachelor's programs available in English in Italy?", a: "Yes, many Italian universities offer Bachelor's and Master's programs fully taught in English across engineering, business and design." },
        { q: "Are scholarships available for Indian students?", a: "Yes, Italian universities and the government offer multiple scholarships including tuition waivers and DSU regional grants up to 100%." },
        { q: "Can I study in Italy without IELTS?", a: "A few universities accept alternatives like MOI or English-medium 12th certificates. Our counsellors will guide you based on your profile." },
        { q: "What is the cost of studying in Italy?", a: "Public university tuition typically ranges from €900 to €4,000 per year, with affordable living costs compared to other European countries." },
        { q: "Is MBA a good option in Italy?", a: "Absolutely. Italy hosts globally ranked B-schools such as SDA Bocconi, MIP Politecnico di Milano and LUISS." },
    ];

    const studyPrograms = [
        {
            id: 1,
            title: "Engineering",
            icon: "/svg/engineering.svg",
            subjects: [
                "Mechanical Engineering",
                "Civil Engineering",
                "Electrical Engineering",
                "Automotive Engineering",
                "Aerospace Engineering",
                "Industrial Engineering",
                "Mechatronics",
                "Robotics & Automation"
            ]
        },

        {
            id: 2,
            title: "Technology & IT",
            icon: "/svg/technology.svg",
            subjects: [
                "Computer Science & IT",
                "Artificial Intelligence (AI)",
                "Data Science & Analytics",
                "Cyber Security",
                "Software Engineering",
                "Cloud Computing",
                "Game Design & Development",
            ]
        },

        {
            id: 3,
            title: "Design & Arts",
            icon: "/svg/creativity.svg",
            subjects: [
                "Architecture",
                "Interior Design",
                "Animation & Graphic Design",
                "Media & Communication",
                "Game Design & Development",
            ],
        },

        {
            id: 4,
            title: "Business & Management",
            icon: "/svg/research.svg",
            subjects: [
                "Business Management",
                "MBA",
                "International Business",
                "Finance & Accounting",
                "Digital Marketing",
                "Supply Chain & Logistics Management",
                "Economics",
            ],

        },

        {
            id: 5,
            title: "Hospitality & Tourism",
            icon: "/svg/hotel.svg",
            subjects: [
                "Hospitality & Hotel Management",
                "Tourism Management",
                "Supply Chain & Logistics Management",
                "Event Management",
                "Hotel & Resort Management",
                "Food & Beverage Management",
            ],
        },

        {
            id: 6,
            title: "Science & Mathematics",
            icon: "/svg/people.svg",
            subjects: [
                "Physics & Applied Sciences",
                "Mathematics & Statistics",
                "Environmental Engineering",
                "Renewable Energy",
            ],
        },
    ];

    const universities = [
        {
            id: 1,
            name: "Technical University of Munich",
            image: "/germany/tum.webp",
            logo: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Logo_of_the_Technical_University_of_Munich.svg",
            address: "Arcisstraße 21, 80333 Munich, Bavaria, Germany",
            description:
                "The Technical University of Munich is a public research university in Munich, Bavaria, Germany. It specializes in engineering, technology, medicine, and applied and natural sciences.",
        },
        {
            id: 2,
            name: "Free University of Berlin",
            image: "/germany/berlin.webp",
            logo: "https://www.standyou.com/uploads/20220507124025_file_Free-University-of-Berlin.png",
            address: "Kaiserswerther Str. 16–18, 14195 Berlin, Germany",
            description:
                "The Free University of Berlin is a public research university founded in West Berlin in 1948 during the early Cold War period.",
        },
        {
            id: 3,
            name: "Ludwig Maximilian University of Munich",
            image: "/germany/lmu.webp",
            logo: "https://d2lk14jtvqry1q.cloudfront.net/media/small_Ludwig_Maximilian_University_of_Munich_04e35b6553_534996274e_c70ef7f15c.png",
            address: "Geschwister-Scholl-Platz 1, 80539 Munich, Germany",
            description:
                "The Ludwig Maximilian University of Munich is a public research university in Munich, Bavaria, Germany, and one of Germany's oldest universities.",
        },
        {
            id: 4,
            name: "University of Hamburg",
            image: "/germany/hamburg.webp",
            logo: "https://www.erneuerbare-energien-hamburg.de/assets/images/c/Universit%C3%A4t%20Hamburg-3e2b0ea9.png",
            address: "Mittelweg 177, 20148 Hamburg, Germany",
            description:
                "The University of Hamburg is a public research university founded in 1919 and is one of Germany’s largest universities.",
        },
        {
            id: 5,
            name: "Humboldt University of Berlin",
            image: "/germany/humboldt.webp",
            logo: "https://erudera.com/media/images/Huberlin-logo.svg.original.png",
            address: "Unter den Linden 6, 10099 Berlin, Germany",
            description:
                "The Humboldt University of Berlin was established in 1810 and is one of Berlin’s oldest and most prestigious universities.",
        },
        {
            id: 6,
            name: "Karlsruhe Institute of Technology",
            image: "/germany/kit.webp",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Logo_KIT.svg/1280px-Logo_KIT.svg.png",
            address: "Kaiserstraße 12, 76131 Karlsruhe, Germany",
            description:
                "The Karlsruhe Institute of Technology is a leading public research university and a member of the Helmholtz Association.",
        },
    ];

    return (
        <div className={`min-h-screen bg-white text-[#0b2545]`}>
            <header className={`sticky top-0 z-40 bg-white transition-all duration-300 ${scrolled ? 'shadow-[0_2px_10px_rgba(11,37,69,0.08)]' : 'shadow-none py-1'}`}>
                <div className="max-w-7xl overflow-hidden mx-auto px-4 flex items-center justify-between h-16 lg:h-20">
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

            {/* HERO SECTION WITH BACKGROUND IMAGE + FORM */}
            <section id="home" className="relative overflow-hidden">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('/2.jpg')`,
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-black/30" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 py-12 lg:py-12 grid grid-cols-1 lg:grid-cols-3 gap-3 items-center">
                    {/* Left Content */}
                    <div className="lg:col-span-2 text-white">

                        <h1 className="mt-5 text-3xl sm:text-5xl font-bold leading-tight">
                            <span className="text-white">Make Your Study In <span className="text-[#F46C44]">Germany</span> <br /> Dream Into A Reality</span>
                        </h1>

                        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-1 gap-1.5 text-white font-medium">
                            {[
                                "Assured Admission in Germany's Top Universities",
                                "Get Up to 100% Scholarships",
                                "100% Visa Assistance",
                                "English Taught Programs Available"
                            ].map((b) => (
                                <li key={b} className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold">✓</span>
                                    {b}
                                </li>
                            ))}
                        </ul>

                        <div className="relative overflow-hidden max-w-2xl mt-10 w-full">
                            <motion.div
                                className="flex gap-3 items-center"
                                animate={{
                                    x: ["0%", "-50%"],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 18,
                                    ease: "linear",
                                }}
                            >
                                {[...universities, ...universities].map(
                                    (university, index) => (
                                        <div
                                            key={index}
                                            className="min-w-[150px] h-[80px] bg-white/90 border border-white/20 flex items-center justify-center p-2"
                                        >
                                            <img
                                                src={university.logo}
                                                alt={university.name}
                                                className="max-h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                                            />
                                        </div>
                                    )
                                )}
                            </motion.div>
                        </div>


                        {/* <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <a
                                href="#process"
                                className="border-2 border-white text-white hover:bg-[#f46c44] hover:text-white px-7 py-3 rounded-full font-semibold text-center transition-colors"
                            >
                                Explore Process
                            </a>
                        </div> */}
                    </div>
                    <div className="relative w-full max-w-md min-h-[400px] p-1.5 bg-[#f46c44] sm:ml-auto">

                        <div className="relative bg-white shadow-2xl overflow-hidden">

                            {/* Top Header */}
                            <div className="absolute rounded-br-3xl top-0 left-0 bg-gradient-to-r from-[#EA6C46] to-[#EA6C46]/80 px-4 py-2">
                                <h3 className="text-white text-base font-medium">
                                    Book Your Free Consultation
                                </h3>
                            </div>

                            {/* Stats */}
                            <div className="mt-10 flex items-center justify-center gap-8 py-3 border-b border-gray-200 text-[#0b2545] font-semibold text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">📚</span>
                                    <span>100 + Courses</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xl">👨‍🎓</span>
                                    <span>10K + Counseled</span>
                                </div>
                            </div>

                            {heroSubmitted ? (
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
                                <form
                                    onSubmit={(e) => handleSubmit(e, true)}
                                    className="p-5 space-y-3"
                                >
                                    {/* Name + Mobile */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-sm font-semibold text-[#0b2545] block mb-2">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>

                                            <input
                                                required
                                                value={heroForm.name}
                                                onChange={(e) =>
                                                    setHeroForm({ ...heroForm, name: e.target.value })
                                                }
                                                placeholder="Enter Full Name*"
                                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d]"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-[#0b2545] block mb-2">
                                                Mobile No. <span className="text-red-500">*</span>
                                            </label>

                                            <input
                                                required
                                                type="tel"
                                                value={heroForm.phone}
                                                onChange={(e) =>
                                                    setHeroForm({ ...heroForm, phone: e.target.value })
                                                }
                                                placeholder="Enter Mobile No.*"
                                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d]"
                                            />
                                        </div>
                                    </div>

                                    {/* Email + Degree */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-sm font-semibold text-[#0b2545] block mb-2">
                                                Email Id <span className="text-red-500">*</span>
                                            </label>

                                            <input
                                                required
                                                type="email"
                                                value={heroForm.email}
                                                onChange={(e) =>
                                                    setHeroForm({ ...heroForm, email: e.target.value })
                                                }
                                                placeholder="Enter Email Id*"
                                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d]"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-[#0b2545] block mb-2">
                                                Degree <span className="text-red-500">*</span>
                                            </label>

                                            <input
                                                required
                                                value={heroForm.course}
                                                onChange={(e) =>
                                                    setHeroForm({ ...heroForm, course: e.target.value })
                                                }
                                                placeholder="Enter Degree*"
                                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d]"
                                            />
                                        </div>
                                    </div>

                                    {/* State */}
                                    <div>
                                        <label className="text-sm font-semibold text-[#0b2545] block mb-2">
                                            City <span className="text-red-500">*</span>
                                        </label>

                                        <input
                                            required
                                            value={heroForm?.city}
                                            onChange={(e) =>
                                                setHeroForm({ ...heroForm, city: e.target.value })
                                            }
                                            placeholder="Enter City*"
                                            className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d]"
                                        />
                                    </div>

                                    {/* Branch */}
                                    <div>
                                        <label className="text-sm font-semibold text-[#0b2545] block mb-2">
                                            State {""}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            required
                                            value={heroForm?.state}
                                            onChange={(e) =>
                                                setHeroForm({ ...heroForm, state: e.target.value })
                                            }
                                            placeholder="Enter State*"
                                            className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d]"
                                        />

                                    </div>

                                    {/* Checkbox */}
                                    <div className="flex items-start gap-2 text-sm text-[#0b2545]">
                                        <input type="checkbox" required className="mt-1" />

                                        <p className="leading-5">
                                            I agree to receive information from Ooshas Global.
                                        </p>
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        className="w-full bg-[#F46C44] hover:bg-[#bf341f] transition-all text-white font-bold py-2.5 rounded-md text-xl shadow-lg"
                                    >
                                        Submit
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            {/* Top Universities Section */}
            <section className="relative py-12 to-white overflow-hidden">

                <div className="relative max-w-7xl mx-auto px-4">
                    <div className="text-center max-w-5xl mx-auto mb-14">
                        <h2 className="text-3xl md:text-4xl font-semibold text-[#0b2545] leading-tight">
                            Applying For{" "}
                            <span className="text-[#f46c44]">
                                Top Universities in Germany
                            </span>
                        </h2>
                        <p className="mt-3 text-base text-[#0b2545]/80 font-medium leading-8">
                            Here are some of the top universities in Germany for students to study in Germany.
                        </p>
                    </div>

                    {/* University Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {universities.map((university, index) => (
                            <div className="duration-300 hover:scale-105 transition-all hover:-translate-y-1 cursor-pointer" key={index}>
                                <div className="bg-[#efefef] p-2 max-w-[450px] mx-auto">
                                    <div className="overflow-hidden">
                                        <img
                                            src={"https://techportal.in/wp-content/uploads/2023/12/munvh.jpg" || university.image}
                                            alt={university.name}
                                            className="w-full h-[220px] object-cover"
                                        />
                                        <div className="flex -mt-20 ml-2">
                                            <div className="bg-white p-2 shadow-xl">
                                                <img
                                                    src={university.logo}
                                                    alt="logo"
                                                    className="h-12 object-contain"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 px-2">
                                        <div className="relative group w-fit">
                                            <h3 className="text-xl line-clamp-1 font-medium text-black cursor-pointer">
                                                {university.name}
                                            </h3>

                                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg z-50">
                                                {university.name}
                                            </div>
                                        </div>

                                        <p className="text-[#444] mt-1 text-sm leading-relaxed">
                                            {university.address}
                                        </p>

                                        <p className="text-[#444] mt-2 text-sm line-clamp-3 leading-relaxed">
                                            {university.description}
                                        </p>

                                        {/* Bottom CTA */}
                                        <div onClick={() => setPopupOpen(true)} className="flex pb-2 items-center justify-between mt-3 group cursor-pointer">
                                            <span className="text-[#F46C44] text-lg font-semibold tracking-wide">
                                                Enquiry Now
                                            </span>

                                            <span className=" right-0 text-[#F46C44] text-4xl group-hover:translate-x-2 transition-all duration-300">
                                                →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>))}
                    </div>
                </div>
            </section>

            <section className="relative py-12 bg-gradient-to-b from-white to-[#fff7f3] overflow-hidden">

                <div className="relative max-w-7xl mx-auto px-4">
                    <div className="text-center max-w-4xl mx-auto mb-8">
                        <h2 className="text-3xl md:text-4xl font-semibold text-[#0b2545] leading-tight">
                            Top Demanding{" "}
                            <span className="text-[#f46c44]">
                                Courses in Germany
                            </span>
                        </h2>
                        <p className="mt-3 text-base text-[#0b2545]/80 font-medium leading-8">
                            Explore the most in-demand courses in Germany that offer strong
                            career opportunities, international exposure, and affordable
                            world-class education.
                        </p>
                    </div>

                    {/* Course Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {studyPrograms.map((program) => (
                            <div
                                key={program.id}
                                className="bg-[#f5f5f5] p-2 shadow transition-all duration-300"
                            >
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="flex items-center bg-white justify-center p-1 min-h-[280px] ">
                                        <img
                                            src={program.icon}
                                            alt={program.title}
                                            className="w-24 h-24 object-contain"
                                        />
                                    </div>
                                    <div className="p-2 col-span-2 bg-white flex flex-col justify-start">
                                        <h3 className="text-lg font-semibold text-[#F46C44] mb-2">
                                            {program.title}
                                        </h3>
                                        <ul className="space-y-1">
                                            {program.subjects.map((subject, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start gap-3 text-[#2d2d2d] text-sm font-medium leading-relaxed"
                                                >
                                                    <span className="text-[#F46C44] text-sm leading-none mt-1">
                                                        ✓
                                                    </span>
                                                    <span>{subject}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-12">
                        <button onClick={() => setPopupOpen(true)} type="button" className="bg-[#f46c44] hover:bg-[#e45c36] text-white px-6 py-3 rounded-full text-lg font-semibold shadow-[0_12px_35px_rgba(244,108,68,0.35)] hover:shadow-[0_16px_45px_rgba(244,108,68,0.45)] hover:scale-101 transition-all duration-300">
                            Connect with Experts to Choose the Right Course →
                        </button>
                    </div>
                </div>
            </section>
            {/* Study Support Section */}

            <TestimonialSection />

            <section className="bg-[#f7f7f7] py-12 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4">

                    <div className="grid lg:grid-cols-2 gap-14 items-center">

                        {/* LEFT CONTENT */}
                        <div>

                            {/* Heading */}
                            <h2 className="text-3xl sm:text-4xl font-semibold leading-tight text-black max-w-2xl">
                                Most Trusted German Education Consultant
                            </h2>

                            {/* Description */}
                            <div className="mt-3 space-y-3">
                                <p className="text-base sm:text-lg text-[#222]">
                                    Are you looking to undertake your higher studies in Germany?
                                    Our consultancy offers personalized services providing you
                                    with individual attention and counselling throughout your
                                    academic journey. Let us help you find your perfect home
                                    at an institution in Germany.
                                </p>

                                <p className="text-base sm:text-lg text-[#222]">
                                    Convenience is key, which is why we have a German Education
                                    Consultancy right at your doorstep. No need to travel far
                                    when expert advice is right at your doorstep. We are committed
                                    to providing you with the highest quality service, tailored
                                    to your specific needs and preferences.
                                </p>
                            </div>

                            {/* CTA */}
                            <div className="mt-6">
                                <button
                                    onClick={() => setPopupOpen(true)}
                                    className="bg-[#F36D45] hover:bg-[#c1182a] text-white px-6 py-3 rounded-full text-lg font-semibold shadow-xl hover:scale-102 transition-all duration-300"
                                >
                                    Connect with Experts to Choose the Right Course
                                </button>
                            </div>

                        </div>

                        {/* RIGHT IMAGES */}
                        <div className="relative flex justify-center lg:justify-end items-center min-h-[650px]">

                            {/* Dot Pattern */}
                            <div className="absolute top-0 right-10 grid grid-cols-6 gap-3 opacity-30">
                                {[...Array(36)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="w-[4px] h-[4px] rounded-full bg-black"
                                    />
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="relative z-10">
                                <img
                                    src="https://img.freepik.com/free-photo/portrait-cute-young-brunette-student-holding-exercise-books-isolated-white-wall_231208-11488.jpg?semt=ais_hybrid&w=740&q=80"
                                    alt="Students"
                                    className="w-[420px] h-[520px] object-cover rounded-[20px] shadow-2xl"
                                />
                            </div>

                            {/* Side Image */}
                            <div className="absolute left-0 bottom-10 z-20">
                                <img
                                    src="https://img.magnific.com/premium-psd/young-indian-college-student-with-laptop-book-isolated-background-png_920413-3117.jpg?semt=ais_hybrid&w=740&q=80"
                                    alt="Student"
                                    className="w-[280px] h-[430px] object-cover rounded-[20px] shadow-2xl border-[8px] border-[#f7f7f7]"
                                />
                            </div>

                            {/* Paper Plane */}
                            <div className="absolute bottom-16 left-10 z-30">
                                <div className="relative">

                                    {/* Dashed Curve */}
                                    <svg
                                        width="220"
                                        height="120"
                                        viewBox="0 0 220 120"
                                        fill="none"
                                        className="absolute -top-12 -left-10"
                                    >
                                        <path
                                            d="M10 20 C 80 120, 140 120, 210 20"
                                            stroke="#dba39a"
                                            strokeWidth="2"
                                            strokeDasharray="6 6"
                                            fill="transparent"
                                        />
                                    </svg>

                                    {/* Plane */}
                                    <div className="text-[#dba39a] text-6xl rotate-12">
                                        ✈
                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </section>
            <section className="relative py-12 bg-gradient-to-b from-[#fff8f5] to-white overflow-hidden">
                <div className="relative max-w-7xl mx-auto px-4">
                    {/* Heading */}
                    <div className="text-center max-w-4xl mx-auto mb-10">
                        <h2 className="text-3xl md:text-4xl font-semibold text-[#0b2545] leading-tight">
                            Why Students Choose{" "}
                            <span className="relative inline-block text-[#f46c44]">
                                Ooshas Global
                            </span>
                        </h2>

                        <p className="mt-3 text-base text-[#0b2545]/80 font-medium leading-8">
                            We provide complete support for students planning to study in Italy —
                            from university selection and scholarships to visa approval and
                            settlement assistance.
                        </p>
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

                        {[
                            {
                                icon: "/svg/res.svg",
                                title: "Student Profile Analysis",
                                desc: "We carefully evaluate your academic background, career goals, and interests to create a personalized Italy study plan.",
                            },
                            {
                                icon: "/svg/classroom.svg",
                                title: "Course & University Selection",
                                desc: "Get expert guidance in choosing the best-fit universities and courses based on your profile and future career goals.",
                            },
                            {
                                icon: "/svg/consultant.svg",
                                title: "Admission Assistance",
                                desc: "Complete support for applications, SOPs, documentation, and university admissions without confusion or delays.",
                            },
                            {
                                icon: "/svg/tuition.svg",
                                title: "Scholarship Assistance",
                                desc: "We help students identify scholarship opportunities and maximize funding chances for affordable education in Italy.",
                            },
                            {
                                icon: "/svg/mentoring.svg",
                                title: "IELTS Coaching",
                                desc: "Professional IELTS guidance with mock tests and personalized coaching to help you meet language requirements.",
                            },
                            {
                                icon: "/svg/passport.svg",
                                title: "Study Visa Assistance",
                                desc: "End-to-end visa filing support including documentation, embassy appointments, and interview preparation.",
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-[#f5f5f5] p-2 shadow transition-all duration-300"
                            >
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="flex items-center bg-white justify-center p-1 min-h-[200px]">
                                        <img
                                            src={item.icon}
                                            alt={item.title}
                                            className="w-24 h-24 object-contain"
                                        />
                                    </div>
                                    <div className="p-3 col-span-2 bg-white flex flex-col justify-center">
                                        <h3 className="text-xl font-semibold text-[#F46C44] mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <div className="mt-12 text-center">

                        <div className="inline-flex flex-col items-center">
                            <div className="flex flex-wrap justify-center gap-5">
                                <button onClick={() => setPopupOpen(true)} type="button" className="bg-[#f46c44] hover:bg-[#e15d37] text-white px-6 py-3 rounded-full text-lg font-semibold shadow-[0_12px_35px_rgba(244,108,68,0.35)] hover:shadow-[0_18px_45px_rgba(244,108,68,0.45)] hover:scale-101 transition-all duration-300">
                                    Book Your FREE Counselling →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* FAQ Section */}
            <section
                id="faq"
                className="relative py-12 overflow-hidden bg-black"
            >
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{
                        backgroundImage:
                            "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwnbYK2MCt3tMOIx19cy8xYGjSuzZBpoWQzQ&s')",
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-4">

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        <div className="">
                            <p className="text-white/80 font-medium text-lg">
                                Answers You Need To Know
                            </p>

                            <h2 className="mt-3 text-3xl md:text-4xl font-semibold leading-tight">
                                <span className="text-white">
                                    Frequently Asked
                                </span>{" "}
                                <span className="text-[#f46c44]">
                                    Questions
                                </span>
                            </h2>

                            {/* Description */}
                            <p className="mt-3 text-white/70 leading-8 font-medium max-w-xl">
                                Get clear answers to all your admission-related questions for
                                Italian universities. With expert guidance and complete support,
                                your study journey to Italy becomes smooth and stress-free.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-5 mt-4">

                                <button onClick={() => setPopupOpen(true)} type="button" className="bg-[#f46c44] hover:bg-[#e15d37] text-white px-6 py-3 rounded-full text-lg font-semibold shadow-[0_12px_35px_rgba(244,108,68,0.35)] hover:shadow-[0_18px_45px_rgba(244,108,68,0.45)] hover:scale-105 transition-all duration-300">
                                    Book Appointment →
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">

                            {faqs.map((f, i) => (
                                <div
                                    key={i}
                                    className="group border border-white/10 bg-white/5 backdrop-blur-xl rounded overflow-hidden shadow-[0_10px_35px_-15px_rgba(0,0,0,0.45)] hover:border-[#f46c44]/10 transition-all duration-300"
                                >
                                    {/* Question */}
                                    <button
                                        onClick={() =>
                                            setOpenFaq(openFaq === i ? null : i)
                                        }
                                        className="w-full flex justify-between items-center gap-3 p-2 px-3 text-left"
                                    >
                                        <span className="text-white text-base font-semibold leading-8">
                                            {f.q}
                                        </span>

                                        <div
                                            className={`min-w-[30px] h-[30px] rounded flex items-center justify-center bg-[#f46c44]/10 text-[#f46c44] text-3xl font-light transition-all duration-300 ${openFaq === i
                                                ? "rotate-180 bg-[#f46c44] text-white"
                                                : ""
                                                }`}
                                        >
                                            +
                                        </div>
                                    </button>

                                    {/* Answer */}
                                    <div
                                        className={`grid transition-all duration-500 ease-in-out ${openFaq === i
                                            ? "grid-rows-[1fr] opacity-100"
                                            : "grid-rows-[0fr] opacity-0"
                                            }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="px-4 pb-2 text-white/80 text-[15px] leading-8">
                                                {f.a}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Simple CTA Footer */}
            <footer className="relative overflow-hidden ">

                <div
                    className="absolute inset-0 bg-cover z bg-center"
                    style={{
                        backgroundImage:
                            "url('https://cdn.sanity.io/images/uqxwe2qj/production/4ee9fb18bdc214aefebf7859557a6611125c3841-760x426.png?q=80&auto=format&fit=clip&w=760')",
                    }}
                />

                {/* Red Overlay */}
                <div className="absolute inset-0 bg-[#F46C44]/90" />

                <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">

                    {/* Heading */}
                    <h2 className="text-2xl md:text-3xl font-semibold text-white leading-tight max-w-7xl mx-auto">
                        Want Guaranteed Admissions at Top Italian Universities for
                        MBA, Masters & Bachelor in Upcoming Intake?
                    </h2>

                    {/* Text */}
                    <div className="mt-6 space-y-2 text-white text-base">
                        <p>BOOK NOW for a FREE Counselling Session !!</p>
                        <p>Register Now to Get Free Profile Evaluation</p>
                        <p>Choose from 70+ Universities</p>
                        <p>Hurry Up! Admission Open for Upcoming Intake.</p>
                    </div>

                    {/* Button */}
                    <div className="mt-10">
                        <button onClick={() => setPopupOpen(true)} type="button" className="bg-white hover:bg-gray-200 hover:scale-102 text-[#b91c1c] font-semibold text-xl px-6 py-3 rounded-full shadow-lg transition-all">
                            Book Your Seat Now
                        </button>
                    </div>
                </div>
            </footer>

            {/* POPUP */}
            {popupOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[1px]"
                    onClick={closePopup}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-lg"
                    >

                        {/* Form Card */}
                        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">

                            {/* Close Button */}
                            <button
                                onClick={closePopup}
                                aria-label="Close"
                                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white shadow-md hover:bg-[#f46c44] hover:text-white text-[#0b2545] flex items-center justify-center transition-all"
                            >
                                ✕
                            </button>

                            {/* Header */}
                            <div className="bg-gradient-to-r from-[#EA6C46] to-[#EA6C46]/80 px-5 py-4">
                                <h3 className="text-white text-xl font-semibold text-center uppercase tracking-wide">
                                    Book Your Free Consultation
                                </h3>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-center gap-8 py-3 border-b border-gray-200 text-[#0b2545] font-semibold text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">📚</span>
                                    <span>100 + Courses</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xl">👨‍🎓</span>
                                    <span>10K + Counseled</span>
                                </div>
                            </div>

                            {/* Success State */}
                            {submitted ? (
                                <div className="py-12 px-6 text-center">
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
                                <form
                                    onSubmit={(e) => handleSubmit(e, false)}
                                    className="p-5 space-y-3"
                                >

                                    {/* Name + Mobile */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                        <div>
                                            <label className="text-sm font-semibold text-[#0b2545] block mb-2">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>

                                            <input
                                                required
                                                value={form.name}
                                                onChange={(e) =>
                                                    setForm({ ...form, name: e.target.value })
                                                }
                                                placeholder="Enter Full Name*"
                                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d]"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-[#0b2545] block mb-2">
                                                Mobile No. <span className="text-red-500">*</span>
                                            </label>

                                            <input
                                                required
                                                type="tel"
                                                value={form.phone}
                                                onChange={(e) =>
                                                    setForm({ ...form, phone: e.target.value })
                                                }
                                                placeholder="Enter Mobile No.*"
                                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d]"
                                            />
                                        </div>
                                    </div>

                                    {/* Email + Degree */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                        <div>
                                            <label className="text-sm font-semibold text-[#0b2545] block mb-2">
                                                Email Id <span className="text-red-500">*</span>
                                            </label>

                                            <input
                                                required
                                                type="email"
                                                value={form.email}
                                                onChange={(e) =>
                                                    setForm({ ...form, email: e.target.value })
                                                }
                                                placeholder="Enter Email Id*"
                                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d]"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-[#0b2545] block mb-2">
                                                Degree <span className="text-red-500">*</span>
                                            </label>

                                            <input
                                                required
                                                value={form.course}
                                                onChange={(e) =>
                                                    setForm({ ...form, course: e.target.value })
                                                }
                                                placeholder="Enter Degree*"
                                                className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d]"
                                            />
                                        </div>
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label className="text-sm font-semibold text-[#0b2545] block mb-2">
                                            City <span className="text-red-500">*</span>
                                        </label>

                                        <input
                                            required
                                            value={form.city}
                                            onChange={(e) =>
                                                setForm({ ...form, city: e.target.value })
                                            }
                                            placeholder="Enter City*"
                                            className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d]"
                                        />
                                    </div>

                                    {/* State */}
                                    <div>
                                        <label className="text-sm font-semibold text-[#0b2545] block mb-2">
                                            State <span className="text-red-500">*</span>
                                        </label>

                                        <input
                                            required
                                            value={form.state}
                                            onChange={(e) =>
                                                setForm({ ...form, state: e.target.value })
                                            }
                                            placeholder="Enter State*"
                                            className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#ff6b3d]/30 focus:border-[#ff6b3d]"
                                        />
                                    </div>

                                    {/* Checkbox */}
                                    <div className="flex items-start gap-2 text-sm text-[#0b2545]">
                                        <input type="checkbox" required className="mt-1" />

                                        <p className="leading-5">
                                            I agree to receive information from Ooshas Global.
                                        </p>
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        className="w-full bg-[#F46C44] hover:bg-[#bf341f] transition-all text-white font-bold py-3 rounded-md text-lg shadow-lg"
                                    >
                                        Submit
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}