"use client";

import {
  Landmark,
  BadgeDollarSign,
  GraduationCap,
  BookOpen,
  BriefcaseBusiness,
} from "lucide-react";

const features = [
  {
    title: "Globally Recognized\nUniversities",
    description:
      "Home to world-renowned universities like University of Bologna and Politecnico di Milano.",
    icon: Landmark,
    iconBg: "bg-blue-100",
    iconColor: "text-[#233E8B]",
  },
  {
    title: "Affordable\nEducation",
    description:
      "Tuition fees at public universities range from €900 to €4000 per year for international students.",
    icon: BadgeDollarSign,
    iconBg: "bg-orange-100",
    iconColor: "text-[#F46C44]",
  },
  {
    title: "Generous\nScholarships",
    description:
      "Need and merit-based scholarships covering tuition, accommodation, health insurance & stipends.",
    icon: GraduationCap,
    iconBg: "bg-blue-100",
    iconColor: "text-[#233E8B]",
  },
  {
    title: "English-Taught\nPrograms",
    description:
      "Wide range of courses available in English for international students.",
    icon: BookOpen,
    iconBg: "bg-orange-100",
    iconColor: "text-[#F46C44]",
  }
];

export default function WhyChooseItaly() {
  return (
    <section className="py-4">
      <div className="">
        {/* Heading */}
        <div className="text-left mb-8">
          <h2 className="text-2xl font-bold text-[#1C2E5A]">
            Why Choose Italy for Higher Education?
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="
                  group
                  bg-white
                  rounded-2xl
                  border
                  border-gray-200
                  hover:-translate-y-2
                  transition-all
                  duration-300
                  p-4
                  text-center
                "
              >
                {/* Icon */}
                <div
                  className={`
                    w-10
                    h-10
                    mx-auto
                    rounded-full
                    ${item.iconBg}
                    flex
                    items-center
                    justify-center
                    mb-5
                    transition-all
                    duration-300
                    group-hover:scale-110
                  `}
                >
                  <Icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#1C2E5A] whitespace-pre-line leading-7">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mt-4 text-[15px] text-gray-500 leading-7">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}