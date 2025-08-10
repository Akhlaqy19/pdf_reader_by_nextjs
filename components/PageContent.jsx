"use client"

import React, { useState, useRef, useEffect, useContext } from "react";
import Image from "next/image";
import clsx from "clsx";
import { PageContext } from "@/contexts/main";
import { GrDocumentText } from "react-icons/gr";
import ConvertToImgIcon from "@/public/icons/convert-to-img.svg";


export default function PageContent({ image, content }) {
    const [loading, setLoading] = useState(false);
    const contentRef = useRef(null);
    const [pdfMode, setPdfMode] = useState("text");
    const { searchHighlight } = useContext(PageContext);

    const highlightContent = (content, query) => {
        if (!query.trim()) return content;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return content.replace(regex, '<mark style="background-color: #fef08a; padding: 1px 2px;">$1</mark>');
    };

    const specialStyles = clsx(
        { "xs:left-0 rounded-r-xxl": pdfMode === "text" },
        { "xs:right-0 rounded-l-xxl": pdfMode === "image" }
    );

    console.log('Image exists:', image);

    const hasContent = content && content.trim() !== '' &&
        !content.match(/<div\s+class=("|')pgcontent("|')\s*>\s*(<span>\s*<\/span>\s*)?<\/div>/gi) &&
        content.replace(/<[^>]*>/g, '').trim().length > 0;

    return (
        <div className="relative w-full mx-0" >
            <div className="zoom-wrapper flex justify-center items-center">
                <div
                    className={`page-content book_page mb-20 ${pdfMode === "text" ? "pb-16" : ""} w-full xs:min-h-max xs:max-h-374 lg:w-[55rem] text-justify bg-white text-dark dark:bg-gray-900 dark:text-[#f9faf8] shadow-[0px_0px_20px_#e9e9e9] dark:shadow-[0px_0px_20px_#181818] border dark:border-gray-600 border-gray-200 relative flex justify-center items-center`}
                >
                    {/* آیکون تبدیل حالت - همیشه نمایش داده میشود */}
                    <div
                        className={`flex justify-center items-center xs:w-15 xs:h-11 absolute top-21.5 bg-light-blue dark:bg-gray-700 cursor-pointer ${specialStyles} z-10`}
                        onClick={() => {
                            setPdfMode(pdfMode === "text" ? "image" : "text");
                            console.log('Clicked to change PDF mode:', pdfMode)
                        }}
                    >
                        {pdfMode === "text" ? <ConvertToImgIcon className="dark:invert" /> :
                            <GrDocumentText size={30} className="text-black dark:text-white" />
                        }
                    </div>

                    {pdfMode === "text" ? (
                        <div className="book-page size-full text-2xl leading-[50px] p-6 flex flex-col">
                            {loading ? (
                                <div className="flex justify-center items-center h-32">
                                    <span className="text-gray-600 dark:text-gray-400">در حال بارگذاری...</span>
                                </div>
                            ) : (
                                <>
                                    {hasContent ? (
                                        <div
                                            ref={contentRef}
                                            className="flex flex-col flex-1 h-full justify-between"
                                            dangerouslySetInnerHTML={{ __html: highlightContent(content, searchHighlight) }}
                                        />
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center text-center text-2xl leading-[50px] dark:text-white">هذه الصفحة في الكتاب لا تحتوي على نص</div>
                                    )}
                                </>
                            )}
                        </div>
                    ) : (
                        image ? (
                            <div className="w-full h-full flex justify-center items-center">
                                <Image 
                                    src={image} 
                                    width={0} 
                                    height={0} 
                                    sizes="100vw"
                                    alt="Page content" 
                                    className="w-full h-full object-contain" 
                                    unoptimized
                                />
                            </div>
                        ) : (
                            <div className="flex justify-center items-center h-full">
                                <span className="text-gray-600 dark:text-gray-400">تصویر موجود نیست</span>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}