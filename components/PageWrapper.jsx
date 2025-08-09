"use client";
import React, { useContext, useEffect, useState, useId, useRef } from "react";
import PageContent from "@/components/PageContent";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { PageContext } from "@/contexts/main";
import { getBookPages } from "@/actions/api";
import CenterLoadingBar from "@/components/CenterLoadingBar";
import ConvertToTxtIcon from "@/public/icons/convert-to-txt.svg";
import { GrDocumentText } from "react-icons/gr";
import ConvertToImgIcon from "@/public/icons/convert-to-img.svg";

export default function PageWrapper() {
  const {
    currentPage,
    setCurrentPage,
    zoom,
    isShowAllPages,
    isInputFocused,
    pagesCache,
    setPagesCache,
    setApplyZoom,
  } = useContext(PageContext);

  console.log("PageWrapper - isShowAllPages:", isShowAllPages);

  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allPages, setAllPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const isInitialized = useRef(false);

  const effectiveZoom = zoom || 100;
  console.log("Current zoom level:", effectiveZoom);

  useEffect(() => {
    setApplyZoom(() => () => {
      const prevScrollTop = window.scrollY;
      const prevHeight = document.body.scrollHeight;
      const wrapper = document.getElementById("wrapper");
      const currentZoom = zoom || 100;

      if (wrapper) {
        wrapper.style.transform = `scale(${currentZoom / 100})`;
        wrapper.style.transformOrigin = "top";

        requestAnimationFrame(() => {
          const newHeight = document.body.scrollHeight;
          const newScrollTop =
            prevHeight > 0 ? (newHeight * prevScrollTop) / prevHeight : 0;
          window.scrollTo(0, newScrollTop);
        });
      }

      console.log("Zoom applied!");
    });
  }, [setApplyZoom, zoom]);

  // تنظیم اولیه URL و صفحه
  useEffect(() => {
    if (!isInitialized.current && params.id) {
      const pageFromUrl = searchParams.get("page");
      if (pageFromUrl) {
        const pageNum = parseInt(pageFromUrl);
        if (pageNum && pageNum !== currentPage) {
          setCurrentPage(pageNum);
        }
      } else {
        const newUrl = `/book/${params.id}?page=${currentPage}`;
        router.replace(newUrl, { shallow: true });
      }
      isInitialized.current = true;
    }
  }, [params.id, searchParams, currentPage, setCurrentPage, router]);

  // تغییر URL فقط وقتی کاربر صفحه را تغییر دهد
  useEffect(() => {
    if (isInitialized.current && params.id) {
      const currentPageParam = searchParams.get("page");
      if (currentPageParam !== currentPage.toString()) {
        const newUrl = `/book/${params.id}?page=${currentPage}`;
        router.replace(newUrl, { shallow: true });
      }
    }
  }, [currentPage, params.id, router, searchParams]);

  useEffect(() => {
     // پنهان کردن آیکون پیش‌نمایش
    document.querySelectorAll('.nextjs-toast').forEach(icon => {
      icon.style.display = 'none';
    });
  }, [])
  

  const fetchPages = async (startPage, limitPage) => {
    if (!params.id) return;
    console.log("Fetching pages:", {
      bookId: params.id,
      startPage,
      limitPage,
      isInputFocused,
    });
    setLoading(true);
    try {
      const response = await getBookPages(params.id, startPage, limitPage);
      console.log("API Response:", response);
      const pages = response?.data || [];
      // ذخیره در cache
      const newCache = { ...pagesCache };
      pages.forEach((page) => {
        newCache[page.page_number] = page;
        newCache[page.page_image] = page.page_image;
      });
      console.log(newCache);
      setPagesCache(newCache);
      setAllPages(pages);
    } catch (error) {
      console.error("خطا در بارگذاری کتاب:", error);
      setAllPages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered:", {
      currentPage,
      isInputFocused,
      isShowAllPages,
      bookId: params.id,
    });

    if (!isShowAllPages) {
      // حالت تک صفحه - فقط صفحه فعلی
      if (pagesCache[currentPage]) {
        console.log("Using cached page:", currentPage);
        setAllPages([pagesCache[currentPage]]);
      } else {
        fetchPages(currentPage, 1);
      }
    } else {
      // حالت همه صفحات - 20 صفحه از محدوده صفحه فعلی
      const startPage = Math.floor((currentPage - 1) / 20) * 20 + 1;
      const limitPage = 20;
      fetchPages(startPage, limitPage);
    }
  }, [params.id, currentPage, isShowAllPages, isInputFocused]);

  // اعمال zoom بعد از render شدن صفحه جدید
  useEffect(() => {
    if (zoom && zoom !== 100) {
      const timer = setTimeout(() => {
        const wrapper = document.getElementById("wrapper");
        if (wrapper) {
          wrapper.style.transform = `scale(${zoom / 100})`;
          wrapper.style.transformOrigin = "top";
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [allPages]);

  const cleanPageData = (rawData) => {
    return rawData
      .replace(/<!DOCTYPE[^>]*>/gi, "")
      .replace(/<\/?(html|body)[^>]*>/gi, "")
      .trim();
  };

  const pageId = useId();

  if (loading) {
    return (
      <span className="absolute top-24 right-30 text-bold text-xl text-gray-900 dark:text-gray-400">
        در حال بارگذاری...
      </span>
    );
  }

  // console.log('Render PageWrapper:', {allPages: allPages.length, currentPage, isOnePage, loading});

  const pageContentData = () => {
    // ابتدا از cache بگیر، اگر نبود از allPages
    const currentPageData =
      pagesCache[currentPage] ||
      allPages.find((page) => page.page_number === currentPage);
    const content = cleanPageData(currentPageData?.page_data || "");
    const image = currentPageData?.page_image;
    return { image, content }
  }
  console.log(pageContentData());

  return (
    <>

      <div className="-z-1 relative min-h-max min-w-screen mt-10 max-md:p-0 md:pl-[calc(var(--aside-width)+10px)] flex mr-auto">
        <div
          id="wrapper"
          className="min-h-max max-md:w-full md:w-[calc(100vw-var(--aside-width)-10px)]"
        >
          {isShowAllPages ?
            allPages.map((page, i) => {
              const content = cleanPageData(page.page_data || "");
              return (
                <div
                  key={`${pageId}-${page.page_number}`}
                  className="mb-10"
                >
                  <PageContent
                    content={content}
                    image={page.page_image}
                  />
                </div>
              );
            })
            : (
              <div className="flex justify-center">
                <PageContent {...pageContentData()} />
              </div>
            )}
        </div>
      </div>
    </>
  );
}
