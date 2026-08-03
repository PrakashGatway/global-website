"use client";
import { useState } from "react";
import { Tagging } from "./tag";

export default function EligibilitySection({ pageData,tag = 2 } : any) {

  const [open, setOpen] = useState(0);



  return (
    <section className={`w-full py-10 bg-white ${pageData?.sections?.eligibilityCriteria?.isHidden === "yes" ? "hidden" : "block"}`}>
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-start">

        {/* LEFT CONTENT */}
        <div>
            <Tagging data={tag} css="relative inline-block mb-4 sm:mb-6 block text-lg sm:text-2xl md:text-3xl lg:text-4xl leading-snug mb-2">
           <span className="text-[#123b73] text-lg sm:text-4xl lg:text-4xl font-bold">{pageData?.sections?.eligibilityCriteria?.title.split("||")[0]}</span>
            <span className="text-[#F46C44] font-semibold"> {pageData?.sections?.eligibilityCriteria?.title.split("||")[1]}</span>
            </Tagging>




          <span
            className="text-sm lg:text-base text-gray-600 mb-4"
            dangerouslySetInnerHTML={{
              __html: pageData?.sections?.eligibilityCriteria?.subtitle || "",
            }}
          ></span>


        </div>

        {/* RIGHT ACCORDION */}
        <div className="space-y-4">
          {pageData?.sections?.eligibilityCriteria?.eligibilityItem && pageData?.sections?.eligibilityCriteria?.eligibilityItem?.map((item, i) => (
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
                className="w-full flex justify-between items-center px-4 py-3 lg:px-6 lg:py-2 text-left"
              >
                <span className="text-base lg:text-base font-bold text-gray-800">
                  {item?.itemname}
                </span>

                <span className="text-orange-500 text-lg lg:text-xl">
                  {open === i ? "▴" : "▾"}
                </span>
              </button>

              {/* Content */}
              {open === i && (
                <div className="px-4 pb-4 lg:px-6  text-sm lg:text-base text-black">
                  <ul className="list-disc pl-5 space-y-1">
                    {item?.subItems?.split("|").map((sub, idx) => (
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