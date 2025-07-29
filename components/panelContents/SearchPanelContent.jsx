"use client"

import React, { useContext } from "react";
import CloseIcon from "@/public/icons/panel-controler-icons/close.svg";
import Forward from "@/public/icons/setting-tools-icons/forward.svg";
import Backward from "@/public/icons/setting-tools-icons/backward.svg";
import SearchIcon from "@/public/icons/tools-icons/search.svg";
import { BookData, SelectedPanel } from "@/contexts/main";

export default function SearchPanelContent() {

  const { panels, setPanels } = useContext(SelectedPanel);
  const { bookData, setBookData } = useContext(BookData);
  const title = bookData?.title || "";

  const closePanel = () => {
    setPanels((prevPanels) =>
      prevPanels.map((panel) =>
        panel.id === "search" ? { ...panel, isOpened: false } : panel
      )
    );
  };
  return (
    <>
      <div className="space-y-5.5">
        <div className="flex items-center justify-between pl-8 pr-6 h-7">
          <h3 className="pr-4.5 text-xl font-bold leading-8">البحث</h3>
          <div className="" onClick={closePanel}>
            <CloseIcon />
          </div>
        </div>
        <div className="pl-7 pr-6">
          <div className="space-y-4 py-4 pl-5 pr-4 bg-[#FAFAFA] dark:bg-gray-800 rounded-xxl">
            <div className="flex items-center h-7">
              <span>البحث فی&nbsp;</span>
              <h2>{title}</h2>
            </div>

            <div className="flex justify-end items-center gap-x-5.5 py-2.5 pl-5.5  w-full h-12 bg-white dark:bg-gray-700 text-[#939393] rounded-xlg">
              <input type="text" className="flex-1 h-full indent-5" />
              <div className="pl-5 border-l-2 border-inherit">
                <SearchIcon />
                {/* <span className="w-7.5 h-0 "></span> */}
              </div>
              <div className="flex items-center gap-x-6">
                <Backward className="-rotate-90" />
                <Forward className="-rotate-90" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
