"use client";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookData, PageContext, SelectedPanel } from "@/contexts/main";
import { convertEnglishToArabic } from "@/utils/numberConverter";

import Forward from "@/public/icons/setting-tools-icons/forward.svg";
import Backward from "@/public/icons/setting-tools-icons/backward.svg";
import Plus from "@/public/icons/setting-tools-icons/plus.svg";
import Minus from "@/public/icons/setting-tools-icons/minus.svg";

import { HiDotsVertical } from "react-icons/hi";
import Menubar from "@/public/icons/tools-icons/menubar.svg";
import SearchIcon from "@/public/icons/tools-icons/search.svg";
import SettingIcon from "@/public/icons/tools-icons/setting.svg";

export default function BottomTool() {
  const router = useRouter();
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
  const [selectedItem, setSelectedItem] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { panels, setPanels } = useContext(SelectedPanel);

  useEffect(() => {
    setInputValue(convertEnglishToArabic(currentPage));
  }, [currentPage]);

  useEffect(() => {
    if (zoom) {
      applyZoom();
    }
  }, [zoom, applyZoom]);

  const convertArabicToEnglish = (arabicNumber) => {
    const englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return String(arabicNumber).replace(/[٠-٩]/g, (digit) => englishNumbers[arabicNumbers.indexOf(digit)]);
  };

  const handlePageChange = (e) => {
    if (e.key === "Enter") {
      handlePageBlur();
    }
    setInputValue(e.target.value);
  };

  const handlePageBlur = () => {
    const englishValue = convertArabicToEnglish(inputValue);
    const page = parseInt(englishValue, 10);

    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setInputValue(convertEnglishToArabic(currentPage));
    }
    setIsInputFocused(false);
  };

  const handleZoomChange = (e) => {
    const englishValue = convertArabicToEnglish(e.target.value.replace("%", ""));
    const zoomValue = parseInt(englishValue, 10);

    if (e.target.value === "") {
      setZoom(50);
    } else if (zoomValue > 0 && zoomValue <= 200) {
      setZoom(zoomValue);
    }
  };

  const zoomSteps = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];

  const handleTogglePanel = (panelIdToToggle) => {
    setPanels((prevPanels) =>
      prevPanels.map((panel) => {
        if (panel.id === panelIdToToggle) {
          return { ...panel, isOpened: !panel.isOpened };
        } else {
          return { ...panel, isOpened: false };
        }
      })
    );
  };

  const applySelect = (which) => {
    setSelectedItem(which);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* MOBILE bottom tool: use fixed so it always sticks to viewport bottom */}
      <div
        // md:hidden to hide on desktop, fixed so it's relative to viewport, safe-area handled via style
        className="md:hidden fixed left-1/2 -translate-x-1/2 w-[calc(100vw-10px)] h-16.25 flex justify-center items-center bg-white dark:bg-gray-800 rounded-t-xxl z-50"
        style={{
          // Put it just above the safe area on devices with notch/gesture area.
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)",
          // add shadow to separate from content
          boxShadow: "0 -6px 20px rgba(0,0,0,0.08)",
        }}
      >
        {/* popup icons container (positioned above the bar) */}
        <div
          className={`
            absolute bottom-full left-2.5 mb-3 flex flex-col items-center gap-y-3
            transition-all duration-300 ease-in-out
            ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}
          `}
        >
          <div
            className={`flex items-center justify-center size-11.25 rounded-xl bg-light-blue text-dark dark:text-white dark:bg-blue-600/70 shadow-md ${selectedItem === "setting" ? "border-2 border-dark-stroke dark:border-gray-100" : ""
              }`}
            onClick={() => {
              applySelect("setting");
              handleTogglePanel("setting");
            }}
          >
            <SettingIcon className="min-w-5 min-h-5 text-black dark:text-white" />
          </div>

          <div
            className={`flex items-center justify-center size-11.25 rounded-xl bg-light-blue text-dark dark:text-white dark:bg-blue-600/70 shadow-md ${selectedItem === "search" ? "border-2 border-dark-stroke dark:border-gray-100" : ""
              }`}
            onClick={() => {
              applySelect("search");
              handleTogglePanel("search");
            }}
          >
            <SearchIcon className="min-w-5 min-h-5 text-black dark:text-white" />
          </div>

          <div
            className={`flex items-center justify-center size-11.25 rounded-xl bg-light-blue text-dark dark:text-white dark:bg-blue-600/70 shadow-md ${selectedItem === "menu" ? "border-2 border-dark-stroke dark:border-gray-100" : ""
              }`}
            onClick={() => {
              applySelect("menu");
              handleTogglePanel("menubar");
            }}
          >
            <Menubar className="min-w-5 min-h-5 text-black dark:text-white" />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center divide-x-2 divide-secondary-gray">
          <div className="flex items-center pl-6 divide-x-2 divide-secondary-gray">
            <div className="flex items-center gap-x-4.5 pl-1.5">
              <div onClick={() => setCurrentPage((p) => (p < totalPages ? p + 1 : p))}>
                <Forward className="cursor-pointer text-black dark:text-white" />
              </div>
              <span className="text-xl font-irancell font-semibold text-black dark:text-white">
                {convertEnglishToArabic(totalPages)}
              </span>
            </div>

            <div className="flex items-center gap-x-3 pr-1.5">
              <input
                type="text"
                className="w-11 h-7.5 text-center rounded-lg inset-shadow-input text-black dark:text-white bg-transparent"
                value={inputValue}
                onChange={handlePageChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handlePageBlur();
                }}
                onFocus={() => setIsInputFocused(true)}
                onBlur={handlePageBlur}
              />
              <div onClick={() => setCurrentPage((p) => (p > 1 ? p - 1 : p))}>
                <Backward className="cursor-pointer text-black dark:text-white" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-x-3 pr-6">
            <div
              onClick={() =>
                setZoom((z) => {
                  const i = zoomSteps.indexOf(z);
                  return i < zoomSteps.length - 1 ? zoomSteps[i + 1] : z;
                })
              }
            >
              <Plus className="cursor-pointer text-black dark:text-white" />
            </div>

            <input
              type="text"
              onChange={handleZoomChange}
              value={convertEnglishToArabic(zoom ?? "") + "%"}
              className="w-13.5 h-7.5 text-center font-bold rounded-lg inset-shadow-input text-black dark:text-white bg-transparent"
            />

            <div
              onClick={() =>
                setZoom((z) => {
                  const i = zoomSteps.indexOf(z);
                  return i > 0 ? zoomSteps[i - 1] : z;
                })
              }
            >
              <Minus className="cursor-pointer text-black dark:text-white" />
            </div>
          </div>
        </div>

        <div
          className={`absolute left-2.5 flex items-center justify-center min-w-11.5 min-h-11.5 rounded-xl cursor-pointer dark:bg-blue-600/70 ${isMenuOpen || selectedItem === "bar" ? "bg-light-blue" : ""
            }`}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <HiDotsVertical className="min-w-1.5 min-h-5 text-black dark:text-white" />
        </div>
      </div>
    </>
  );
}
