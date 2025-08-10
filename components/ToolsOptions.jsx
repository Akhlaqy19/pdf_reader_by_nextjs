"use client";

import React, { useContext, useEffect } from "react";
import Menubar from "@/public/icons/tools-icons/menubar.svg";
import SearchIcon from "@/public/icons/tools-icons/search.svg";
import SettingIcon from "@/public/icons/tools-icons/setting.svg";
import { SelectedPanel } from "@/contexts/main";

export default function ToolsOptions() {
  // const [selectedItem, setSelectedItem] = useState("");
  const { panels, setPanels } = useContext(SelectedPanel);
  let selectedItemId;

  // پنل با بالاترین zIndex را انتخاب میکنیم
  const topPanel = panels.filter(p => p.isOpened).sort((a, b) => b.zIndex - a.zIndex)[0];
  selectedItemId = topPanel ? topPanel.id : 'menubar';

  const handleTogglePanel = (panelIdToToggle) => {
    setPanels((prevPanels) => {
      const maxZIndex = Math.max(...prevPanels.map(p => p.zIndex));
      const targetPanel = prevPanels.find(p => p.id === panelIdToToggle);
      
      return prevPanels.map((panel) => {
        if (panel.id === panelIdToToggle) {
          // اگر پنل Menu است
          if (panel.isPermanent) {
            return { ...panel, zIndex: maxZIndex + 1 };
          }
          
          // اگر پنل باز است و بالاترین zIndex را دارد، آن را ببند
          if (panel.isOpened && panel.zIndex === maxZIndex) {
            return { ...panel, isOpened: false, zIndex: 0 };
          }
          
          // در غیر این صورت پنل را باز کن و بالاترین zIndex بده
          return { ...panel, isOpened: true, zIndex: maxZIndex + 1 };
        }
        return panel;
      });
    });
  };

  return (
    <>
      {/* Tool options */}
      <div className="md:flex max-md:hidden items-center justify-between gap-x-29">
        <div
          className={`flex justify-center items-center w-11.5 h-11.5 ${
            selectedItemId === "menubar" && "bg-light-blue dark:bg-gray-900 rounded-xl"
          }`}
          onClick={() => {
            handleTogglePanel("menubar");
            selectedItemId = "menubar";
          }}
        >
          <Menubar className="text-black dark:text-white" />
        </div>
        <div
          className={`
            flex justify-center items-center w-11.5 h-11.5
            ${selectedItemId === "search" && "bg-light-blue dark:bg-gray-900 rounded-xl"}`}
          onClick={() => {
            handleTogglePanel("search");
            selectedItemId = "search";
          }}
        >
          <SearchIcon className="text-black dark:text-white" />
        </div>
        <div
          className={`
            flex justify-center items-center w-11.5 h-11.5
            ${selectedItemId === "setting" && "bg-light-blue dark:bg-gray-900 rounded-xl"}`}
          onClick={() => {
            handleTogglePanel("setting");
            selectedItemId = "setting";
          }}
        >
          <SettingIcon className="text-black dark:text-white" />
        </div>
      </div>
    </>
  );
}
