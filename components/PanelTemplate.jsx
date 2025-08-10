"use client";
import React, { useContext, useEffect, useState } from "react";
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



  // پنل Menu همیشه باز است
  const hasOpenPanel = true;

  return (
    <>
      <aside
        className="xs:[grid-area:sidebar] fixed left-0 top-16 bg-white dark:bg-gray-900 w-84 md:w-[var(--aside-width)] translate-x-0"
        style={{
          height: 'calc(100vh - 64px)'
        }}
      >
        {children}
        
        {/* همه پنلها - با z-index مدیریت میشوند */}
        {panels.map((panel) => (
          <div
            key={panel.id}
            className={`absolute top-0 left-0 w-full h-full bg-white dark:bg-gray-900 ${
              panel.isOpened 
                ? 'opacity-100 pointer-events-auto' 
                : 'opacity-0 pointer-events-none'
            }`}
            style={{ zIndex: panel.zIndex }}
          >
            {panel.id === "menubar" && (
              <div className="h-full overflow-hidden pt-11">
                <MenuPanelContent />
              </div>
            )}
            {panel.id === "info" && (
              <div className="h-full overflow-y-auto scrollbar-thin px-7 pb-4 pt-8">
                <InfoPanelContent bookData={bookData} />
              </div>
            )}
            {panel.id === "search" && (
              <div className="h-full overflow-y-auto scrollbar-thin px-0 pt-12">
                <SearchPanelContent />
              </div>
            )}
            {panel.id === "setting" && (
              <div className="h-full overflow-y-auto scrollbar-thin p-4">
                <SettingPanelContent />
              </div>
            )}
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
