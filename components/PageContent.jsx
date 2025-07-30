"use client"
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import { PageContext } from '@/contexts/main';
import { getBookPages } from '@/actions/api';

export default function PageContent() {
  const { currentPage, zoom } = useContext(PageContext);
  const params = useParams();
  const [allPages, setAllPages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookContent = async () => {
      if (!params.id) return;

      setLoading(true);
      try {
        const response = await getBookPages(params.id);
        setAllPages(response?.data || []);
      } catch (error) {
        console.error('خطا در بارگذاری کتاب:', error);
        setAllPages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookContent();
  }, [params.id]);

  useEffect(() => {
    console.log('Current page:', currentPage, 'All pages:', allPages.length);
  }, [currentPage, allPages]);

  const rawPageData = allPages.find(page => page.page_number === currentPage)?.page_data || '';
  // console.log(rawPageData);

  const cleanedPageContent = rawPageData
      .replace(/<!DOCTYPE[^>]*>/gi, '')
      .replace(/<\/?(html|body)[^>]*>/gi, '')
      .trim();

  console.log(cleanedPageContent);


  return (
    <div className="page-content book_page pb-16 w-full
     xs:h-274 lg:w-[55rem] text-justify bg-white text-dark dark:bg-dark dark:text-gray-50  shadow-[0px_0px_20px_#e9e9e9] dark:shadow-[0px_0px_20px_#181818] border dark:border-gray-600 border-r-gray-200 my-5  animation-iteration-count-1 absolute xs:w-235 xs:top-21 xs:right-8 xs:bottom-0 overflow-y-auto">
      <div
        className="leading-relaxed book-page w-full h-full text-2xl leading-[50px]"
      >
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <span className="text-gray-600 dark:text-gray-400">در حال بارگذاری...</span>
          </div>
        ) : (
          <div className="flex flex-col justify-between h-full" dangerouslySetInnerHTML={{ __html: cleanedPageContent }} />
        )}
      </div>
    </div>
  );
}
