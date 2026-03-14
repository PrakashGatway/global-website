"use client";
import { useState } from "react";

export default function EligibilitySection({pageData}) {

  const [open, setOpen] = useState(0);

  const items = [
    {
      title: "Academic Credentials",
      content: (
        <ul className="list-disc pl-5 text-gray-600 text-xs lg:text-sm">
          <li>
            <b>UG:</b> A recognized secondary school leaving certificate, like a diploma or A-Levels.
          </li>
          <li>
            <b>PG:</b> A recognized bachelor’s degree in a relevant field from an accredited institution.
          </li>
        </ul>
      )
    },
    {
      title: "Language Proficiency",
      content: "Students must demonstrate English or German language proficiency through IELTS, TOEFL, or TestDaF."
    },
    {
      title: "Standardized Tests",
      content: "Some universities may require GRE, GMAT, or other entrance exams depending on the course."
    },
    {
      title: "Visa Requirements",
      content: "Students must obtain a valid German student visa and provide necessary documents."
    },
    {
      title: "Financial Capability",
      content: "Proof of financial resources to support living expenses in Germany is required."
    }
  ];

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-start">

        {/* LEFT CONTENT */}
        <div>
          <h2 className="text-lg lg:text-3xl font-semibold text-gray-900 mb-4">
            {pageData.sections.eligibilityCriteria.title}
          </h2>

          <div className="w-16 h-[3px] bg-orange-500 mb-6"></div>

          <p className=" text-sm lg:text-base text-gray-600 mb-4">
            {pageData.sections.eligibilityCriteria.subtitle}
            
          </p>

       
        </div>

        {/* RIGHT ACCORDION */}
       <div className="space-y-4">
  {pageData.sections.eligibilityCriteria.eligibilityItem.map((item, i) => (
    <div
      key={i}
      className={`border transition-all duration-300 overflow-hidden
        ${open === i 
          ? "border-orange-400 rounded-xl" 
          : "border-gray-300 rounded-xl"
        }`}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(open === i ? -1 : i)}
        className="w-full flex justify-between items-center px-4 py-3 lg:px-6 lg:py-4 text-left"
      >
        <span className="text-sm lg:text-base font-medium text-gray-800">
          {item.itemname}
        </span>

        <span className="text-orange-500 text-lg lg:text-xl">
          {open === i ? "▴" : "▾"}
        </span>
      </button>

     {/* Content */}
{open === i && (
  <div className="px-4 pb-4 lg:px-6 lg:pb-6 text-xs lg:text-sm text-gray-600">
    <ul className="list-disc pl-5 space-y-1">
      {item.subItems.split(",").map((sub, idx) => (
        <li key={idx}>{sub.trim()}</li>
      ))}
    </ul>
  </div>
)}
    </div>
  ))}
</div>
      </div>
    </section>
  );
}