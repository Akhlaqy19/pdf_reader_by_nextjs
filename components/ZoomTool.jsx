"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { PageContext, BookData } from "@/contexts/main";
import { convertEnglishToArabic } from "@/utils/numberConverter";

import Forward from "@/public/icons/setting-tools-icons/forward.svg";
import Backward from "@/public/icons/setting-tools-icons/backward.svg";
import Plus from "@/public/icons/setting-tools-icons/plus.svg";
import Minus from "@/public/icons/setting-tools-icons/minus.svg";

export default function ZoomTool() {
  const {
    currentPage,
    setCurrentPage,
    zoom,
    setZoom,
    setIsInputFocused,
    applyZoom,
  } = useContext(PageContext);
  const { bookData } = useContext(BookData);
  const totalPages = bookData?.pages || 1;

  const [inputValue, setInputValue] = useState("");

  // sync input with currentPage
  useEffect(() => {
    setInputValue(convertEnglishToArabic(currentPage));
  }, [currentPage]);

  // apply zoom when changes
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
    return String(arabicNumber).replace(/[٠-٩]/g, digit => englishNumbers[arabicNumbers.indexOf(digit)]);
  };

  // robust manual change: call window.pdfNavigator.goTo if present (PageWrapper exposed it)
  const manualGoTo = async (page) => {
    const p = Math.max(1, Math.min(totalPages, Number(page) || 1));
    if (window.pdfNavigator && typeof window.pdfNavigator.goTo === "function") {
      try {
        await window.pdfNavigator.goTo(p);
      } catch (e) {
        // fallback
        setCurrentPage(p);
        if (window.location.pathname) {
          const id = bookData?.id;
          if (id) window.history.replaceState(null, "", `/book/${id}?page=${p}`);
        }
      }
    } else {
      // fallback if API not present
      setCurrentPage(p);
      const id = bookData?.id;
      if (id) window.history.replaceState(null, "", `/book/${id}?page=${p}`);
    }
  };

  const handleInputChange = (e) => setInputValue(e.target.value);
  const handleInputCommit = () => {
    const english = convertArabicToEnglish(inputValue);
    const page = parseInt(english, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      manualGoTo(page);
    } else {
      setInputValue(convertEnglishToArabic(currentPage));
    }
    setIsInputFocused(false);
  };

  const zoomSteps = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];

  return (
    <div className="md:flex max-md:hidden flex-1 items-center divide-x-2 divide-secondary-gray text-black dark:text-white">
      <div className="flex items-center pl-6 divide-x-2 divide-secondary-gray">
        <div className="flex items-center gap-x-4.5 pl-1.5">
          <div className="cursor-pointer" onClick={() => manualGoTo(Math.min(currentPage + 1, totalPages))}>
            <Forward />
          </div>
          <div>
            <span className="text-xl font-irancell font-semibold">{convertEnglishToArabic(totalPages)}</span>
          </div>
        </div>

        <div className="flex items-center gap-x-3 pr-1.5">
          <input
            type="text"
            className="w-11 h-7.5 text-center rounded-lg inset-shadow-input text-black dark:text-white"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => { if (e.key === "Enter") handleInputCommit(); }}
            onBlur={handleInputCommit}
            onFocus={() => setIsInputFocused(true)}
            max={totalPages}
          />
          <div className="cursor-pointer" onClick={() => manualGoTo(Math.max(currentPage - 1, 1))}>
            <Backward />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-3 pr-6">
        <div className="cursor-pointer" onClick={() => setZoom((prev) => {
          const next = zoomSteps.indexOf(prev) + 1;
          return next < zoomSteps.length ? zoomSteps[next] : prev;
        })}>
          <Plus />
        </div>

        <input
          type="text"
          onChange={(e) => {
            const english = convertArabicToEnglish(e.target.value.replace("%", ""));
            const z = parseInt(english, 10);
            if (e.target.value === "") setZoom(50);
            else if (!Number.isNaN(z) && z > 0 && z <= 200) setZoom(z);
          }}
          value={convertEnglishToArabic(zoom ?? "") + "%"}
          className="w-13.5 h-7.5 text-center font-bold rounded-lg inset-shadow-input text-black dark:text-white"
        />

        <div className="cursor-pointer" onClick={() => setZoom((prev) => {
          const prevIndex = zoomSteps.indexOf(prev) - 1;
          return prevIndex >= 0 ? zoomSteps[prevIndex] : prev;
        })}>
          <Minus />
        </div>
      </div>
    </div>
  );
}
