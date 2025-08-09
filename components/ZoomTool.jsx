"use client";
import React, { useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { BookData, PageContext } from "@/contexts/main";
import { convertEnglishToArabic } from "@/utils/numberConverter";

import Forward from "@/public/icons/setting-tools-icons/forward.svg";
import Backward from "@/public/icons/setting-tools-icons/backward.svg";

import Plus from "@/public/icons/setting-tools-icons/plus.svg";
import Minus from "@/public/icons/setting-tools-icons/minus.svg";

export default function ZoomTool() {
  const router = useRouter();

  const { currentPage, setCurrentPage, zoom, setZoom, setIsInputFocused, applyZoom } =
      useContext(PageContext);
  const { bookData, setBookData } = useContext(BookData);
  const totalPages = bookData?.pages;
  const [inputValue, setInputValue] = useState("");

  // ✅ با هر تغییر currentPage، مسیر URL رو آپدیت کن
  useEffect(() => {
    setInputValue(convertEnglishToArabic(currentPage));
    if (typeof currentPage === "number" && !isNaN(currentPage)) {
      // router.replace(`/book/${bookData?.id}/page/${currentPage}`, undefined, {shallow: true});
      // const newUrl = `/book/${bookData?.id}/page/${currentPage}`;
      // window.history.replaceState(null, "", newUrl);
    }
  }, [currentPage]);

  // ✅ اجرای applyZoom فقط وقتی کاربر zoom را تغییر میدهد
  const prevZoomRef = useRef(zoom);
  useEffect(() => {
    if (zoom && zoom !== prevZoomRef.current) {
      applyZoom();
      prevZoomRef.current = zoom;
    }
  }, [zoom, applyZoom]);




  const convertArabicToEnglish = (arabicNumber) => {
    const englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return String(arabicNumber).replace(
        /[٠-٩]/g,
        (digit) => englishNumbers[arabicNumbers.indexOf(digit)]
    );
  };

  const handlePageChange = (e) => {
    if (e.key === "Enter") {
      // عملکرد فعلی حفظ شده
    }

    setInputValue(e.target.value);
  };

  const handlePageBlur = () => {
    const englishValue = convertArabicToEnglish(inputValue);
    const page = parseInt(englishValue);

    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setInputValue(convertEnglishToArabic(currentPage));
    }
    setIsInputFocused(false);
  };

  const handleZoomChange = (e) => {
    const englishValue = convertArabicToEnglish(e.target.value);
    const zoomValue = parseInt(englishValue);

    if (e.target.value === "") {
      setZoom(50);
    } else if (zoomValue > 0 && zoomValue <= 200) {
      setZoom(zoomValue);
    }
  };

  const zoomSteps = [
    50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200
  ];

  // function syncSetZoom (type) {
  //     if (type === "zoom in") {

  //     }
  //     else if (type === "zoom out") {
        
  //     }
  // }

  return (
      <>
        {/* Pagination and Zooming */}
        <div className="md:flex max-md:hidden flex-1 items-center divide-x-2 divide-secondary-gray **:text-black **:dark:text-white">
          <div className="flex items-center pl-6 divide-x-2 divide-secondary-gray">
            <div className="flex items-center gap-x-4.5 pl-1.5">
              <div
                  className=""
                  onClick={() => {
                    setIsInputFocused(false);
                    setCurrentPage((previousPage) => {
                      return previousPage < totalPages
                          ? previousPage + 1
                          : previousPage;
                    });
                  }}
              >
                <div className="text-black dark:text-white">
                  <Forward className="text-black dark:text-white" />
                </div>
              </div>
              <div className="">
              <span className="text-xl font-irancell font-semibold text-black dark:text-white">
                {convertEnglishToArabic(totalPages)}
              </span>
              </div>
            </div>
            <div className="flex items-center gap-x-3 pr-1.5">
              {/*  */}
              <input
                  type="text"
                  className="w-11 h-7.5 text-center rounded-lg inset-shadow-input text-black dark:text-white"
                  value={inputValue}
                  onChange={handlePageChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsInputFocused(false);
                      console.log("Input is Enter a value ");
                      handlePageBlur(); // جدید: وقتی Enter زده می‌شه، بلافاصله blur رو شبیه‌سازی کن
                    }
                  }}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={handlePageBlur}
                  max={totalPages}
              />
              <div
                  className=""
                  onClick={() => {
                    setIsInputFocused(false);
                    setCurrentPage((previousPage) => {
                      return previousPage > 1 ? previousPage - 1 : previousPage;
                    });
                  }}
              >
                <div className="text-black dark:text-white">
                  <Backward />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-x-3 pr-6">
            <div
                className=""
                onClick={() => {
                  setZoom((previousZoom) => {
                    const nextIndex = zoomSteps.indexOf(previousZoom) + 1;
                    return nextIndex < zoomSteps.length
                        ? zoomSteps[nextIndex]
                        : previousZoom;
                  });
                }}
            >
              <div className="text-black dark:text-white">
                <Plus />
              </div>
            </div>
            <input
                type="text"
                onChange={handleZoomChange}
                value={convertEnglishToArabic(zoom ?? "")+"%"}
                className="w-13.5 h-7.5 text-center font-bold rounded-lg inset-shadow-input text-black dark:text-white"
            />
            <div
                className=""
                onClick={() => {
                  setZoom((previousZoom) => {
                    const prevIndex = zoomSteps.indexOf(previousZoom) - 1;
                    return prevIndex >= 0 ? zoomSteps[prevIndex] : previousZoom;
                  });
                }}
            >
              <div className="text-black dark:text-white">
                <Minus />
              </div>
            </div>
          </div>
        </div>
      </>
  );
}

// 
// مشکل اینجاست که در useEffect اول، هر بار که currentPage تغییر میکند، applyZoom() اجرا میشود که باعث ریست شدن zoom میشود.بیایید PageWrapper را بررسی کنم: