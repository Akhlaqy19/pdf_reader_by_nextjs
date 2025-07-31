"use client";
import React, { useContext, useEffect, useState, useId } from 'react';
import PageContent from "@/components/PageContent";
import { useParams } from 'next/navigation';
import { PageContext } from '@/contexts/main';
import { getBookPages } from '@/actions/api';
import CenterLoadingBar from "@/components/CenterLoadingBar";

export default function PageWrapper() {
    const {
        currentPage,
        setCurrentPage,
        zoom,
        isOnePage,
        isInputFocused,
        pagesCache,
        setPagesCache
    } = useContext(PageContext);

    const params = useParams();
    const [allPages, setAllPages] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPages = async (startPage, limitPage) => {
        if (!params.id) return;
        console.log('Fetching pages:', {bookId: params.id, startPage, limitPage, isInputFocused});
        setLoading(true);
        try {
            const response = await getBookPages(params.id, startPage, limitPage);
            console.log('API Response:', response);
            const pages = response?.data || [];
            // ذخیره در cache
            const newCache = {...pagesCache};
            pages.forEach(page => {
                newCache[page.page_number] = page;
            });
            setPagesCache(newCache);
            setAllPages(pages);
        } catch (error) {
            console.error('خطا در بارگذاری کتاب:', error);
            setAllPages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('useEffect triggered:', {currentPage, isInputFocused, bookId: params.id});
        // اگر صفحه فعلی در cache هست و input focus نیست، فقط از cache استفاده کن
        if (!isInputFocused && pagesCache[currentPage]) {
            console.log('Using cached page:', currentPage);
            setAllPages([pagesCache[currentPage]]);
            return;
        }
        if (isInputFocused) {
            // فقط صفحه فعلی
            fetchPages(currentPage, 1);
        } else {
            // 20 تا صفحه براساس pagination
            const startPage = Math.floor((currentPage - 1) / 20) * 20 + 1;
            const limitPage = 20;
            fetchPages(startPage, limitPage);
        }
    }, [params.id, currentPage, isInputFocused, pagesCache]);

    const cleanPageData = (rawData) => {
        return rawData
            .replace(/<!DOCTYPE[^>]*>/gi, '')
            .replace(/<\/?(html|body)[^>]*>/gi, '')
            .trim();
    };

    const goToNextPage = () => {
        if (currentPage < 1000) { // حد ماکزیمم فرضی
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const pageId = useId();

    if (loading) {
        return (
            <span className="absolute top-24 right-30 text-bold text-xl text-gray-900 dark:text-gray-400">
                در حال بارگذاری...
            </span>
        );
    }

    console.log('Render PageWrapper:', {allPages: allPages.length, currentPage, isOnePage, loading});

    const ShowData = () => {
        // ابتدا از cache بگیر، اگر نبود از allPages
        const currentPageData = pagesCache[currentPage] || allPages.find(page => page.page_number === currentPage);
        const content = cleanPageData(currentPageData?.page_data || '');
        console.log('Single page mode - Current page:', currentPage, 'From cache:', !!pagesCache[currentPage], 'Content length:', content.length);
        return <PageContent content={content} />;
    };

    return (
        <div className="relative">
            {isOnePage ? (
                <ShowData />
            ) : (
                <div className="h-auto flex flex-col items-center py-8" style={{gap: '40px'}}>
                    {allPages.map((page) => {
                        const content = cleanPageData(page.page_data || '');
                        console.log('All pages mode - Page:', page.page_number, 'Content length:', content.length);
                        return (
                            <div
                                key={`${pageId}-${page.page_number}`}
                                className="absolute xs:right-9 xs:top-20 flex justify-center"
                            >
                                <PageContent content={content} />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}