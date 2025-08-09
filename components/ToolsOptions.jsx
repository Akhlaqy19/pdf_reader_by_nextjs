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

  const selectedItemIndex = panels.findIndex((panel) => panel.isOpened === true);
  selectedItemId = selectedItemIndex !== -1 ? panels[selectedItemIndex].id : null;

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
