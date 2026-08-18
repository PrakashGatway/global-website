"use client";
import { useState } from "react";
import { Tagging } from "./tag";
import InnerContent from "./dom/DomParser";
import { CalendarDays } from "lucide-react";

export default function EligibilitySection({ pageData, tag = 2,openPopup }: any) {

  const [open, setOpen] = useState(0);



  return (
    <section className={`w-full px-4 py-8 bg-white ${pageData?.sections?.eligibilityCriteria?.isHidden === "yes" ? "hidden" : "block"}`}>
      <div className="max-w-7xl [text-shadow:0_0px_0px_rgba(0,0,0,0.9)] mx-auto grid lg:grid-cols-2 gap-12 items-start">

        {/* LEFT CONTENT */}
        <div>
          <Tagging data={tag} css="relative inline-block mb-4 sm:mb-6 block text-lg sm:text-2xl md:text-3xl lg:text-4xl leading-snug mb-2">
            <span className="text-[#F46C44] text-lg sm:text-4xl block lg:text-4xl font-semibold">{pageData?.sections?.eligibilityCriteria?.title.split("||")[0]}</span>
            <span className="text-[#123b73] font-bold"> {pageData?.sections?.eligibilityCriteria?.title.split("||")[1]}</span>
          </Tagging>
          <InnerContent cleanedHtml={ pageData?.sections?.eligibilityCriteria?.subtitle || ""} />
             <button
             onClick={openPopup}
             
              className="
                        inline-flex
                        h-10
                        items-center
                        justify-center
                        gap-2
                        whitespace-nowrap
                        rounded-lg
                        bg-[#f6673c]
                        px-5
                        text-sm
                        font-semibold
                        text-white
                        shadow-[0_5px_15px_rgba(246,103,60,0.22)]
                        transition-all
                        duration-200
                        hover:bg-[#e9572d]
                        hover:shadow-[0_7px_20px_rgba(246,103,60,0.28)]
                        active:scale-[0.98]
                        mt-4
                    "
            >
              <CalendarDays className="h-4 w-4" />

            Book a Free Consultation
            </button>
          {/* <span
            className="text-base text-gray-700 mb-4"
            dangerouslySetInnerHTML={{
              __html: pageData?.sections?.eligibilityCriteria?.subtitle || "",
            }}
          ></span> */}




        </div>

        {/* RIGHT ACCORDION */}
        <div className="space-y-2">
          {pageData?.sections?.eligibilityCriteria?.eligibilityItem && pageData?.sections?.eligibilityCriteria?.eligibilityItem?.map((item, i) => (
            <div
              key={i}
              className={`border transition-all duration-300 overflow-hidden
        ${open === i
                  ? "border-orange-400 rounded-xl"
                  : "border-gray-300 rounded-xl"
                }`}
            >
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex justify-between items-center px-4 py-3 lg:px-6 lg:py-2 text-left"
              >
                <span className="text-lg font-semibold text-gray-800">
                  {item?.itemname}
                </span>

                <span className="text-orange-500 text-lg lg:text-xl">
                  {open === i ? "▴" : "▾"}
                </span>
              </button>

              {open === i && (
                <div className="px-4 pb-4 lg:px-6  text-sm lg:text-base text-gray-700">
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