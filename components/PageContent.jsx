"use client"

import React, {useState} from "react"

export default function PageContent({content}) {
    const [loading, setLoading] = useState(false);

    console.log('PageContent received content:', content ? content.substring(0, 100) + '...' : 'NO CONTENT');

    return (
            <div className="page-content book_page mb-20 pb-16 w-full xs:min-h-max lg:w-[55rem] text-justify bg-white text-dark dark:bg-gray-800 dark:text-[#f9faf8] shadow-[0px_0px_20px_#e9e9e9] dark:shadow-[0px_0px_20px_#181818] border dark:border-gray-600 border-gray-200">
                <div className="leading-relaxed book-page w-full h-full text-2xl leading-[50px] p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <span className="text-gray-600 dark:text-gray-400">در حال بارگذاری...</span>
                        </div>
                    ) : content.search(/<div\s+class=("|')pgcontent("|')\s*>\s*(<span>\s*<\/span>\s*)?<\/div>/gi
                    ) ? (
                        <div className="flex flex-col justify-between h-full"
                             dangerouslySetInnerHTML={{__html: content}}/>
                    ) : (
                        <div className="mt-auto mb-auto text-center text-2xl leading-[50px] text-dark dark:text-white">هذه الصفحة في الكتاب لا تحتوي على نص</div>
                    )}
                </div>
            </div>
    )
}