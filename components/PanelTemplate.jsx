"use client";
import React, { useContext, useEffect } from "react";
import clsx from "clsx";
import { BookData, SelectedPanel } from "@/contexts/main";
import InfoPanelContent from "./panelContents/InfoPanelContent";
import SearchPanelContent from "./panelContents/SearchPanelContent";
import SettingPanelContent from "./panelContents/SettingPanelContent";
import MenuPanelContent from "./panelContents/MenuPanelContent";


export default function PanelTemplate({ bookData: bookDataProp, children }) {
  
  const { bookData, setBookData } = useContext(BookData); 
  useEffect(() => {
    setBookData(bookDataProp); // setBookData only called when bookDataProp changes
  }, [bookDataProp]); // Dependency array: only run effect when bookDataProp changes

  const { panels, setPanels } = useContext(SelectedPanel);

  const selectedPanel = panels.find((item) => item.isOpened);
  const selectedItemId = selectedPanel ? selectedPanel.id : null;

  const specialClesses = clsx({
    "px-7 pb-43 pt-8": selectedItemId === "info",
    "px-0 pt-12": selectedItemId === "search",
    "p-4": selectedItemId === "setting",
    "pt-11": selectedItemId === "menubar",
  });

  const hasOpenPanel = panels.some((panel) => panel.isOpened);

  return (
    <>
      <aside
        className={`absolute left-0 top-16 h-screen bg-white dark:bg-gray-900 w-84 xs:w-104.5 overflow-y-auto transition-transform duration-300 ${
          hasOpenPanel ? "translate-x-0" : "-translate-x-full"
        } ${specialClesses}`}
      >
        {children}
        {panels.map((panel, i) => (
          <div
            key={panel.id}
            className={`transition-all duration-300 ease-in-out ${
              panel.isOpened 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-2 pointer-events-none absolute top-0 left-0 w-full"
            }`}
          >
            {panel.id === "info" && <InfoPanelContent bookData={bookData} />}
            {panel.id === "search" && <SearchPanelContent />}
            {panel.id === "setting" && <SettingPanelContent />}
            {panel.id === "menubar" && <MenuPanelContent />}
          </div>
        ))}
      </aside>
    </>
  );
}

/*
${
 isOpened ? "left-0 translate-x-0" : "left-0 -translate-x-full"
}
*/
