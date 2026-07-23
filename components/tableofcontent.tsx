"use client"

import { useState } from "react"

export default function TableOfContents({ toc }: any) {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <div className="">
            <p className="font-bold text-gray-800 text-xl mb-4">
                Table Of Contents
            </p>

            <ul className="space-y-1">
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
                                className="font-medium text-blue-900 hover:text-orange-600"
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
                            <ul className="ml-6 mt-1 space-y-1">
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
