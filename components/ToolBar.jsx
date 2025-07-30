"use client"

import React, { useContext } from "react";
import { Inter } from "next/font/google";
import ZoomTool from "./ZoomTool";
import ToolsOptions from "./ToolsOptions";

import { BookData, SelectedPanel } from "@/contexts/main";

import Logo from "@/public/icons/logo.svg";
import Info from "@/public/icons/tools-icons/info.svg";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "400", "600", "700"],
  style: ["normal"],
  variable: "--font-inter",
  display: "swap",
});

export default function ToolBar({ }) {
  const { panels, setPanels } = useContext(SelectedPanel);
  const {bookData, setBookData} = useContext(BookData);
  const title = bookData.title || "";

  const handleTogglePanel = (panelIdToToggle) => {
    setPanels((prevPanels) =>
      prevPanels.map((panel) => {
        if (panel.id === panelIdToToggle) {
          // If this is the panel we want to toggle, reverse its isOpened status
          return { ...panel, isOpened: !panel.isOpened };
        } else {
          // For other panels, ensure they are closed
          return { ...panel, isOpened: false };
        }
      })
    );
  };

  return (
    <>
      <nav className="z-50 fixed top-0 left-0 flex items-center justify-between w-full bg-white dark:bg-gray-800 min-h-13 max-h-16 px-8.5 py-3 border-b border-[#E9E9E9] dark:border-gray-700">
        {/* Logo and Book name */}
        {/*  */}
        <div className="flex flex-1 items-center gap-3.5 w-48.5 xs:w-65">
          {/* Logo Image */}
          <div className="">
            <Logo className="w-10 fill-[#484C52] dark:fill-gray-50" />
          </div>

          {/* Book Name */}
          <div className="">
            <h1 className="font-inter font-bold tracking-widest xs:max-w-100 truncate text-gray-900 dark:text-white">
              {title}
            </h1>
          </div>

          <div
            onClick={() => handleTogglePanel("info")}
            className="text-black dark:text-white"
          >
            <Info className="" />
          </div>
        </div>

        <ZoomTool />
        <ToolsOptions />
      </nav>
    </>
  );
}
