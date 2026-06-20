"use client";
import axiosInstance from "@/app/axiosInstance";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useRouter } from "next/navigation";

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
        name: "Ananya Verma",
        date: "12 June, 2025",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        review:
            "Ooshas Global provided excellent guidance throughout my Germany admission process. Their counselors helped me shortlist public universities and prepare strong applications.",
        score: "University Admission",
        country: "Germany",
    },

    {
        id: 2,
        name: "Aman Verma",
        date: "8 June, 2025",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        review:
            "I was confused about APS, blocked account, and visa procedures, but Ooshas Global guided me perfectly and made the Germany process smooth.",
        score: "Visa Approved",
        country: "Germany",
    },

    {
        id: 3,
        name: "Naveen Kumar",
        date: "4 June, 2025",
        image: "https://randomuser.me/api/portraits/men/41.jpg",
        review:
            "The entire Germany admission journey became stress-free because of Ooshas Global. Their SOP guidance and documentation support were outstanding.",
        score: "Admission Success",
        country: "Germany",
    },

    {
        id: 4,
        name: "Ritika Sharma",
        date: "29 May, 2025",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        review:
            "The counselors were always available to answer my doubts. From university shortlisting to visa preparation, everything was handled professionally.",
        score: "Offer Letter",
        country: "Germany",
    },

    {
        id: 5,
        name: "Pratik Meena",
        date: "22 May, 2025",
        image: "https://randomuser.me/api/portraits/men/75.jpg",
        review:
            "I had an amazing experience with Ooshas Global. Their transparent process and Germany counseling made my dream of studying abroad possible.",
        score: "Student Visa",
        country: "Germany",
    },

    {
        id: 6,
        name: "Akshita Jain",
        date: "18 May, 2025",
        image: "https://randomuser.me/api/portraits/women/90.jpg",
        review:
            "The team helped me with SOP preparation, APS certificate process, and German university applications. Their support was exceptional.",
        score: "APS Cleared",
        country: "Germany",
    },

    {
        id: 7,
        name: "Rahul Singh",
        date: "11 May, 2025",
        image: "https://randomuser.me/api/portraits/men/85.jpg",
        review:
            "Their counselors carefully evaluated my profile and suggested the best German public universities according to my career goals and budget.",
        score: "Profile Selection",
        country: "Germany",
    },

    {
        id: 8,
        name: "Priyanshi Soni",
        date: "5 May, 2025",
        image: "https://randomuser.me/api/portraits/women/55.jpg",
        review:
            "Ooshas Global made the whole Germany process stress-free. Their visa interview preparation and blocked account guidance were incredibly helpful.",
        score: "Visa Success",
        country: "Germany",
    },

    {
        id: 9,
        name: "Mohit Sharma",
        date: "28 April, 2025",
        image: "https://randomuser.me/api/portraits/men/60.jpg",
        review:
            "From documentation to university applications, every step was handled professionally. I highly recommend Ooshas Global for Germany study guidance.",
        score: "Admission Confirmed",
        country: "Germany",
    },

    {
        id: 10,
        name: "Sneha Kapoor",
        date: "20 April, 2025",
        image: "https://randomuser.me/api/portraits/women/24.jpg",
        review:
            "The counselors genuinely cared about my future and guided me at every stage of my Germany study abroad journey. Their support gave me confidence.",
        score: "Dream University",
        country: "Germany",
    },
];

export function TestimonialSection() {
    return (
        <section className="bg-[#F36D45] py-16 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-center text-white text-3xl sm:text-4xl font-medium mb-16">
                    Student Testimonials
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
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={"https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="}
                                            alt={testimonial.name}
                                            className="w-14 h-14 rounded-full overflow-hidden object-cover"
                                        />

                                        <div>
                                            <h3 className="text-lg font-semibold text-black line-clamp-1">
                                                {testimonial.name}
                                            </h3>
                                            <p className="text-gray-500 text-sm">
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
                    <Link href="/consultant/contact-form" className="border-2 rounded-full hover:bg-[#bb1f34] text-white px-6 py-2.5 text-base font-semibold shadow-xl transition-all duration-300 hover:scale-103">
                        Connect with Experts to Choose the Right Course
                    </Link>
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
    const router = useRouter();


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
                type: "germany-landing",
                phone: currentForm.phone,
                destination: "Germany",
                subject: "Study Abroad Enquiry",
                source: "website",
                city: currentForm.city || "",
                description: `Course Interest: ${currentForm.course}`,
            };
            await axiosInstance.post("/contactus", payload);
            toast.success("Form submitted successfully");
            router.push("/thank-you");
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
        {
            q: "Are Bachelor's programs available in English in Germany?",
            a: "Yes, many German public and private universities offer Bachelor's and Master's programs fully taught in English, especially in engineering, business, IT, and management.",
        },

        {
            q: "Are scholarships available for Indian students in Germany?",
            a: "Yes, students can apply for DAAD scholarships, university-specific grants, and other funding opportunities that help reduce tuition and living expenses.",
        },

        {
            q: "Can I study in Germany without IELTS?",
            a: "Some German universities accept alternatives like MOI (Medium of Instruction) certificates or English-medium education proof instead of IELTS.",
        },
        {
            q: "What is APS certification for Germany?",
            a: "APS certification is a mandatory academic verification process for Indian students applying for German universities and student visas.",
        },

        {
            q: "Can international students work while studying in Germany?",
            a: "Yes, international students can work part-time for up to 20 hours per week during studies, helping them manage living expenses and gain experience.",
        },

        {
            q: "Is Germany a good option for MBA studies?",
            a: "Absolutely. Germany offers globally recognized MBA and management programs with strong industry exposure and excellent career opportunities.",
        },
        {
            q: "Can students stay in Germany after graduation?",
            a: "Yes, graduates can apply for a post-study work permit and stay in Germany to search for full-time job opportunities after completing their studies.",
        },
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
            image: "/lan/munich.webp",
            logo: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Logo_of_the_Technical_University_of_Munich.svg",
            address: "Arcisstraße 21, 80333 Munich, Bavaria, Germany",
            description:
                "The Technical University of Munich is a public research university in Munich, Bavaria, Germany. It specializes in engineering, technology, medicine, and applied and natural sciences.",
        },
        {
            id: 2,
            name: "Free University of Berlin",
            image: "/lan/berlin.webp",
            logo: "https://www.standyou.com/uploads/20220507124025_file_Free-University-of-Berlin.png",
            address: "Kaiserswerther Str. 16–18, 14195 Berlin, Germany",
            description:
                "The Free University of Berlin is a public research university founded in West Berlin in 1948 during the early Cold War period.",
        },
        {
            id: 3,
            name: "Ludwig Maximilian University of Munich",
            image: "/lan/lmi.webp",
            logo: "https://d2lk14jtvqry1q.cloudfront.net/media/small_Ludwig_Maximilian_University_of_Munich_04e35b6553_534996274e_c70ef7f15c.png",
            address: "Geschwister-Scholl-Platz 1, 80539 Munich, Germany",
            description:
                "The Ludwig Maximilian University of Munich is a public research university in Munich, Bavaria, Germany, and one of Germany's oldest universities.",
        },
        {
            id: 4,
            name: "University of Hamburg",
            image: "/lan/hamburg.webp",
            logo: "https://www.erneuerbare-energien-hamburg.de/assets/images/c/Universit%C3%A4t%20Hamburg-3e2b0ea9.png",
            address: "Mittelweg 177, 20148 Hamburg, Germany",
            description:
                "The University of Hamburg is a public research university founded in 1919 and is one of Germany’s largest universities.",
        },
        {
            id: 5,
            name: "Humboldt University of Berlin",
            image: "/lan/Humboldt.webp",
            logo: "https://erudera.com/media/images/Huberlin-logo.svg.original.png",
            address: "Unter den Linden 6, 10099 Berlin, Germany",
            description:
                "The Humboldt University of Berlin was established in 1810 and is one of Berlin’s oldest and most prestigious universities.",
        },
        {
            id: 6,
            name: "Karlsruhe Institute of Technology",
            image: "/lan/kit.webp",
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
                                loading="lazy"
                            />
                        </Link>
                    </div>

                    <a href="tel:+919875863347">
                        <button
                            className="inline-flex justify-center items-center gap-2 bg-[#f46c44] hover:bg-[#ea6c46] text-white font-semibold px-5 py-2.5 rounded shadow-[-4px_0px_4px_0px_rgba(0,0,0,0.25)] transition-all"
                        >
                            📞 <span>+91 9875863347</span>
                        </button>
                    </a>
                </div>
            </header>

            {/* HERO SECTION WITH BACKGROUND IMAGE + FORM */}
            <section id="home" className="relative overflow-hidden">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 bg-fit bg-bottom bg-flip bg-no-repeat"
                    style={{
                        backgroundImage: `url('https://yesgermany.com/wp-content/uploads/2024/10/WhatsApp-Image-2024-10-15-at-14.41.53.jpeg')`,
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/20 to-black/30" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 py-12 lg:py-12 grid grid-cols-1 lg:grid-cols-3 gap-3 items-center">
                    {/* Left Content */}
                    <div className="lg:col-span-2 text-black">

                        <h1 className="mt-5 text-3xl sm:text-5xl font-bold leading-tight">
                            <span className="text-black">Make Your Study In <span className="text-[#F46C44]">Germany</span> <br /> Dream Into A Reality</span>
                        </h1>

                        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-1 gap-1.5 text-black font-medium">
                            {[
                                "Assured Admission in Germany's Top Universities",
                                "Get Up to 100% Scholarships",
                                "100% Visa Assistance",
                                "English Taught Programs Available"
                            ].map((b) => (
                                <li key={b} className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold">✓</span>
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
                                            src={university.image}
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
                                        <div onClick={() => router.push("/consultant/contact-form")} className="flex pb-2 items-center justify-between mt-3 group cursor-pointer">
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
                        <button onClick={() => router.push("/consultant/contact-form")} type="button" className="bg-[#f46c44] hover:bg-[#e45c36] text-white px-6 py-2.5 rounded-full text-base font-semibold shadow-[0_12px_35px_rgba(244,108,68,0.35)] hover:shadow-[0_16px_45px_rgba(244,108,68,0.45)] hover:scale-101 transition-all duration-300">
                            Connect with Experts to Choose the Right Course →
                        </button>
                    </div>
                </div>
            </section>

            <TestimonialSection />

            <section className="bg-[#f7f7f7] py-10 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-14 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-semibold leading-tight text-black max-w-2xl">
                                Most Trusted <span className="text-[#F46C44]">Germany Education Consultant</span>
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
                                    onClick={() => router.push("/consultant/contact-form")}
                                    className="bg-[#F36D45] hover:bg-[#c1182a] text-white px-6 py-2.5 rounded-full text-base font-semibold shadow-xl hover:scale-102 transition-all duration-300"
                                >
                                    Connect with Experts to Choose the Right Course
                                </button>
                            </div>

                        </div>

                        {/* RIGHT IMAGES */}
                        <div className="relative flex justify-center lg:justify-end items-center">

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
                                    src="/a.png"
                                    alt="Students"
                                    className="w-full object-cover"
                                />
                            </div>

                            {/* Paper Plane */}
                            <div className="absolute -bottom-10 -left-10 z-30">
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
                                <button onClick={() => router.push("/consultant/contact-form")} type="button" className="bg-[#f46c44] hover:bg-[#e15d37] text-white px-6 py-2.5 rounded-full font-semibold shadow-[0_12px_35px_rgba(244,108,68,0.35)] hover:shadow-[0_18px_45px_rgba(244,108,68,0.45)] hover:scale-101 transition-all duration-300">
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
                    className="absolute inset-0 bg-cover bg-center opacity-30"
                    style={{
                        backgroundImage:
                            "url('/faq.jpeg')",
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

                                <button onClick={() => router.push("/consultant/contact-form")} type="button" className="bg-[#f46c44] hover:bg-[#e15d37] text-white px-6 py-3 rounded-full text-lg font-semibold shadow-[0_12px_35px_rgba(244,108,68,0.35)] hover:shadow-[0_18px_45px_rgba(244,108,68,0.45)] hover:scale-105 transition-all duration-300">
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
                    <h2 className="text-2xl md:text-3xl font-semibold text-white leading-tight max-w-5xl mx-auto">
                        Want Guaranteed Admissions at Top German Universities for
                        MBA, Masters & Bachelor in Upcoming Intake?
                    </h2>

                    {/* Text */}
                    <div className="mt-6 space-y-2 text-white text-base md:text-lg">
                        <p>BOOK NOW for a FREE Counselling Session !!</p>
                        <p>Register Now to Get Free Profile Evaluation</p>
                        <p>Choose from 100+ German Public & Private Universities</p>
                        <p>Get Guidance for APS, SOP, Visa & Blocked Account</p>
                        <p>Hurry Up! Admissions Open for Upcoming Intake.</p>
                    </div>

                    {/* Button */}
                    <div className="mt-10">
                        <button
                            onClick={() => router.push("/consultant/contact-form")}
                            type="button"
                            className="bg-white hover:bg-gray-200 hover:scale-105 text-[#000000] font-semibold text-xl px-8 py-3 rounded-full shadow-lg transition-all duration-300"
                        >
                            Book Your Seat Now
                        </button>
                    </div>
                </div>
            </footer>

            {popupOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-4 bg-black/60 backdrop-blur-[1px]"
                    onClick={closePopup}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-h-[95vh] overflow-y-auto scrollbar-hide max-w-lg p-1.5 bg-[#f46c44]"
                    >

                        {/* Form Card */}
                        <div className="relative bg-white shadow-2xl overflow-hidden">
                            {/* Close Button */}
                            <button
                                onClick={closePopup}
                                aria-label="Close"
                                className="absolute top-4 bg-gray-100 right-4 z-20 w-9 h-9 rounded-full shadow-md hover:bg-[#f46c44] hover:text-white text-[#0b2545] flex items-center justify-center transition-all"
                            >
                                ✕
                            </button>


                            <div className="absolute rounded-br-3xl top-0 left-0 bg-gradient-to-r from-[#EA6C46] to-[#EA6C46]/80 px-4 py-2">
                                <h3 className="text-white text-base font-medium">
                                    Book Your Free Consultation
                                </h3>
                            </div>

                            {/* Stats */}
                            <div className="flex mt-10 items-center justify-center gap-8 py-3 border-b border-gray-200 text-[#0b2545] font-semibold text-sm">
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