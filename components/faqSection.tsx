"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"

const faqItems = [
  {
    question: "Why attend IDP events?",
    answer:
      "IDP events provide you with direct access to university representatives, expert counsellors, and valuable information about study abroad opportunities.",
  },
  {
    question: "Will I be able to afford it?",
    answer:
      "Our counsellors can guide you about scholarships, financial aid, and education loans to make studying abroad affordable.",
  },
  {
    question: "What can I expect when I attend an IDP event?",
    answer:
      "One-on-one counselling sessions, university presentations, visa guidance, and scholarship information.",
  },
  {
    question: "What other services are available at IDP events?",
    answer:
      "IELTS registration assistance, application processing, visa documentation help, and pre-departure briefings.",
  },
  {
    question: "What should I bring if I am ready to apply?",
    answer:
      "Bring your academic transcripts, passport, English test scores, statement of purpose, and letters of recommendation.",
  },
]

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        More information
      </h2>

      <div className="space-y-2">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="border-b border-gray-100 last:border-b-0"
          >
            {/* QUESTION */}
            <button
              onClick={() => toggle(index)}
              className="flex items-center justify-between w-full py-4 text-left pointer"
            >
              <span className="font-medium text-gray-800">
                {item.question}
              </span>

              {openIndex === index ? (
                <Minus className="w-5 h-5 text-orange-500 cursor-pointer" />
              ) : (
                <Plus className="w-5 h-5 text-gray-500 cursor-pointer" />
              )}
            </button>

            {/* ANSWER */}
            {openIndex === index && (
              <div className="pb-4 text-gray-600 leading-relaxed text-sm">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
