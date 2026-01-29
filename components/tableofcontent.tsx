"use client"

import { useState } from "react"

export default function TableOfContents({ toc }: any) {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="font-bold text-xl mb-6 border-b pb-3">
                Table Of Contents
            </h3>

            <ul className="space-y-4">
                {toc.map((item: any, index: number) => (
                    <li key={index}>
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={() =>
                                setOpenIndex(openIndex === index ? null : index)
                            }
                        >
                            <span className="mr-3 text-blue-600">•</span>

                            <a
                                href={`#${item.id}`}
                                className="font-medium text-gray-700 hover:text-orange-600"
                            >
                                {item.title}
                            </a>

                            {item.children.length > 0 && (
                                <span className="ml-auto text-orange-600 font-bold text-lg">
                                    {openIndex === index ? "−" : "+"}
                                </span>
                            )}

                        </div>

                        {openIndex === index && item.children.length > 0 && (
                            <ul className="ml-6 mt-3 space-y-2">
                                {item.children.map((child: any, i: number) => (
                                    <li key={i}>
                                        <a
                                            href={`#${child.id}`}
                                            className="text-sm text-gray-600 hover:text-orange-600"
                                        >
                                            • {child.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}
