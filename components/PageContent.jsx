"use client"
import React, { useContext, useEffect, useState } from 'react'
import { PageContext } from '@/contexts/main';
import { getBookPages } from '@/actions/api';

export default function PageContent() {
  const { currentPage, zoom } = useContext(PageContext);
  const [pageContent, setPageContent] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchPageContent = async () => {
      setLoading(true);
      try {
        const bookId = 360; // یا از props/params دریافت کنید
        const data = await getBookPages(bookId, currentPage, 1);
        setPageContent(data?.content || 'محتوای صفحه یافت نشد');
      } catch (error) {
        setPageContent('خطا در بارگذاری صفحه');
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, [currentPage]);

  return (
    <div className="absolute xs:w-235 xs:top-21 xs:right-8 xs:bottom-0 bg-white dark:bg-gray-900 overflow-y-auto">
      <div 
        className="p-6 text-justify leading-relaxed text-gray-900 dark:text-gray-100"
        style={{ fontSize: `${zoom}%` }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <span className="text-gray-600 dark:text-gray-400">در حال بارگذاری...</span>
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: pageContent }} />
        )}
      </div>
    </div>
  );
}
