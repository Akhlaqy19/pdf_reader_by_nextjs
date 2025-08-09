"use client"
import React, {useContext, useState, useEffect, useMemo} from "react";
import {useParams} from 'next/navigation';
import FlexSearch from "flexsearch";
import CloseIcon from "@/public/icons/panel-controler-icons/close.svg";
import Forward from "@/public/icons/setting-tools-icons/forward.svg";
import Backward from "@/public/icons/setting-tools-icons/backward.svg";
import SearchIcon from "@/public/icons/tools-icons/search.svg";
import {BookData, SelectedPanel, PageContext} from "@/contexts/main";
import {getBookPages} from '@/actions/api';

export default function SearchPanelContent() {

    const {panels, setPanels} = useContext(SelectedPanel);
    const {bookData, setBookData} = useContext(BookData);
    const {currentPage, setCurrentPage, setSearchHighlight, fullBookContent, setFullBookContent} = useContext(PageContext);
    const params = useParams();
    const title = bookData?.title || "";

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (searchQuery.trim()) {
            setSearchHighlight(searchQuery);
        } else {
            setSearchHighlight('');
        }
    }, [searchQuery, setSearchHighlight]);
    const [searchResults, setSearchResults] = useState([]);
    const [currentResultIndex, setCurrentResultIndex] = useState(0);
    const bookContent = fullBookContent;
    const [isShowSearchResults, setIsShowSearchResults] = useState(true);

    const highlightText = (text, query) => {
        if (!query.trim()) return text;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark style="background-color: #fef08a; padding: 1px 2px;">$1</mark>');
    };

    useEffect(() => {
        const fetchBookContent = async () => {
            if (!params.id) return;
            try {
                const response = await getBookPages(params.id, 1, 9999);
                const content = response?.data?.map((page) => {
                    const cleanText = page.page_data?.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() || '';
                    return {
                        id: page.page_number,
                        page: page.page_number,
                        text: cleanText
                    };
                }) || [];
                setFullBookContent(content);
            } catch (error) {
                console.error('خطا در دریافت محتوای کتاب:', error);
            }
        };

        if (fullBookContent.length === 0) {
            fetchBookContent();
        }
    }, [params.id, fullBookContent.length]);

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

                        <div
                            className="flex md:flex-row max-md:flex-col items-center py-2.5 px-5 bg-white dark:bg-gray-700 md:max-w-84 max-md:min-h-max rounded-xlg divide-x-2 max-md:divide-transparent md:divide-x-inherit">
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
                                            );
                                            setSearchResults(matchedContent);
                                            setCurrentResultIndex(0);
                                        } else {
                                            setSearchResults([]);
                                        }
                                    }}
                                    className="overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] text-right bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none"
                                    placeholder="جستجو در کتاب..."
                                />
                                <SearchIcon className="max-md:hidden md:absolute left-5"/>
                            </div>
                            <div className="flex items-center gap-x-6 pr-5.5">
                                <SearchIcon className="max-md:block md:hidden" />

                                <Backward
                                    className="-rotate-90 cursor-pointer hover:text-blue-500"
                                    onClick={() => setCurrentResultIndex(prev =>
                                        prev < searchResults.length - 1 ? prev + 1 : 0

                                    )}
                                />
                                <Forward
                                    className="-rotate-90 cursor-pointer hover:text-blue-500"
                                    onClick={() => setCurrentResultIndex(prev =>
                                        prev > 0 ? prev - 1 : searchResults.length - 1
                                    )}
                                />
                            </div>
                        </div>

                        {searchResults.length > 0 && (
                            <div className="mt-4 space-y-2 overflow-y-auto max-h-screen">
                                <button className="w-full text-center text-blue-400 text-md">
                                    <span onClick={() => setIsShowSearchResults(prevState => !prevState)}>
                                {isShowSearchResults ? "إخفاء النتائج" : "عرض النتائج"}

                                </span>
                                </button>
                                {isShowSearchResults && (
                                    <>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {searchResults.length} نتیجه یافت شد - نتیجه {currentResultIndex + 1}
                                        </div>
                                        <div className="flex flex-col gap-y-2 overflow-y-auto">
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
                                                    <div 
                                                        className="text-sm text-gray-800 dark:text-gray-200"
                                                        dangerouslySetInnerHTML={{
                                                            __html: highlightText(
                                                                result.text.length > 100 ? result.text.substring(0, 100) + '...' : result.text,
                                                                searchQuery
                                                            )
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}


                                )
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
