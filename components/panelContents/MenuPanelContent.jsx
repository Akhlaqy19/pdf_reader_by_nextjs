"use client";
import React, { useContext, useState } from "react";

import { BookData, PageContext } from "@/contexts/main";
import BookPartLink from "../BookPartLink";
import { useTheme } from "next-themes";

export default function MenuPanelContent() {
    const [selectedPartIndex, setSelectedPartIndex] = useState(1);
    const { bookData, setBookData } = useContext(BookData);
    const { setCurrentPage } = useContext(PageContext);
    const bookTopics = bookData?.indexes || [];
    const { resolvedTheme } = useTheme();

    const id = bookData?.id;

    return (
        <>
            <div className="space-y-3">
                <div className="h-8">
                    <h2 className="pr-4.5 text-xl font-bold leading-8 text-gray-900 dark:text-white">
                        قائمه الکتاب
                    </h2>
                </div>

                <div className="panel-list w-full overflow-y-auto max-h-screen">
                    <ul className="flex flex-col divide-y-1 divide-gray-200 dark:divide-gray-700">
                        {bookTopics.map((part, i) => (
                            <li
                                key={i + 1}
                                className={`flex items-center justify-between pr-4.5 pl-7 h-12 transition-color duration-300 ease-in-out hover:dark:bg-[#1e2533] hover:bg-light-blue ${resolvedTheme === "light"
                                        ? selectedPartIndex === i + 1
                                            ? "bg-light-blue"
                                            : "bg-white"
                                        : selectedPartIndex === i + 1
                                            ? "bg-[#1e2533] "
                                            : "bg-gray-800"
                                    } cursor-pointer`}
                                title={part.title}
                            >
                                <span
                                    className="font-light text-lg text-gray-900 dark:text-white truncate"
                                    onClick={() => {
                                        setSelectedPartIndex(i + 1);
                                        setCurrentPage(parseInt(part.page));
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: part.title,
                                    }}
                                ></span>
                                <span className="text-gray-600 dark:text-gray-400">
                                    {part.page}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            ّ
        </>
    );
}
