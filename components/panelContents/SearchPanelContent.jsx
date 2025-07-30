"use client"

import React, {useContext, useState, useEffect, useMemo} from "react";
import { useParams } from 'next/navigation';
import FlexSearch from "flexsearch";
import CloseIcon from "@/public/icons/panel-controler-icons/close.svg";
import Forward from "@/public/icons/setting-tools-icons/forward.svg";
import Backward from "@/public/icons/setting-tools-icons/backward.svg";
import SearchIcon from "@/public/icons/tools-icons/search.svg";
import {BookData, SelectedPanel, PageContext} from "@/contexts/main";
import { getBookPages } from '@/actions/api';

export default function SearchPanelContent() {

    const {panels, setPanels} = useContext(SelectedPanel);
    const {bookData, setBookData} = useContext(BookData);
    const {currentPage, setCurrentPage} = useContext(PageContext);
    const params = useParams();
    const title = bookData?.title || "";
    
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [currentResultIndex, setCurrentResultIndex] = useState(0);
    const [bookContent, setBookContent] = useState([]);
    
    useEffect(() => {
        const fetchBookContent = async () => {
            if (!params.id) return;
            try {
                const response = await getBookPages(params.id);
                const content = response?.data?.map((page) => {
                    const cleanText = page.page_data?.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() || '';
                    return {
                        id: page.page_number,
                        page: page.page_number,
                        text: cleanText
                    };
                }) || [];
                setBookContent(content);
            } catch (error) {
                console.error('خطا در دریافت محتوای کتاب:', error);
            }
        };
        
        fetchBookContent();
    }, [params.id]);
    
    const searchIndex = useMemo(() => {
        if (!bookContent.length) return null;
        const index = new FlexSearch.Index({
            tokenize: "forward",
            resolution: 9
        });
        bookContent.forEach(item => {
            index.add(item.id, item.text);
        });
        return index;
    }, [bookContent]);

    const closePanel = () => {
        setPanels((prevPanels) =>
            prevPanels.map((panel) =>
                panel.id === "search" ? {...panel, isOpened: false} : panel
            )
        );
    };
    return (
        <>
            <div className="space-y-5.5">
                <div className="flex items-center justify-between pl-8 pr-6 h-7">
                    <h3 className="pr-4.5 text-xl font-bold leading-8 text-gray-900 dark:text-white">البحث</h3>
                    <div className="cursor-pointer text-gray-600 dark:text-gray-300" onClick={closePanel}>
                        <CloseIcon/>
                    </div>
                </div>
                <div className="pl-7 pr-6">
                    <div className="space-y-4 p-4 bg-[#FAFAFA] dark:bg-gray-800 rounded-xxl">
                        <div className="flex items-center h-7 text-gray-700 dark:text-gray-300">
                            <span>البحث فی&nbsp;</span>
                            <h2 className="font-semibold">{title}</h2>
                        </div>

                       <div className="flex items-center py-2.5 px-5 bg-white dark:bg-gray-700 xs:max-w-84 xs:h-12 rounded-xlg divide-x-2 divide-x-inherit">
                           <div className="relative flex items-center gap-x-1.5 pl-4.5 max-w-55">
                               <input 
                                   type="text" 
                                   value={searchQuery}
                                   onChange={(e) => {
                                       const query = e.target.value;
                                       setSearchQuery(query);
                                       if (query.trim() && searchIndex) {
                                           const results = searchIndex.search(query);
                                           const matchedContent = results.map(id => 
                                               bookContent.find(item => item.id === id)
                                           ).filter(Boolean);
                                           setSearchResults(matchedContent);
                                           setCurrentResultIndex(0);
                                       } else {
                                           setSearchResults([]);
                                       }
                                   }}
                                   className="overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] text-right bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none" 
                                   placeholder="جستجو در کتاب..."
                               />
                               <SearchIcon className="absolute left-5"/>
                           </div>
                           <div className="flex items-center gap-x-6 pr-5.5">
                               <Backward 
                                   className="-rotate-90 cursor-pointer hover:text-blue-500" 
                                   onClick={() => setCurrentResultIndex(prev => 
                                       prev > 0 ? prev - 1 : searchResults.length - 1
                                   )}
                               />
                               <Forward 
                                   className="-rotate-90 cursor-pointer hover:text-blue-500" 
                                   onClick={() => setCurrentResultIndex(prev => 
                                       prev < searchResults.length - 1 ? prev + 1 : 0
                                   )}
                               />
                           </div>
                       </div>
                        
                        {searchResults.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {searchResults.length} نتیجه یافت شد - نتیجه {currentResultIndex + 1}
                                </div>
                                <div className="max-h-60 overflow-y-auto space-y-2">
                                    {searchResults.map((result, index) => (
                                        <div 
                                            key={result.id}
                                            className={`p-3 rounded-lg cursor-pointer ${
                                                index === currentResultIndex 
                                                    ? 'bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700' 
                                                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                                            }`}
                                            onClick={() => {
                                                setCurrentResultIndex(index);
                                                setCurrentPage(result.page);
                                            }}
                                        >
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                صفحه {result.page}
                                            </div>
                                            <div className="text-sm text-gray-800 dark:text-gray-200">
                                                {result.text.length > 100 ? result.text.substring(0, 100) + '...' : result.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
