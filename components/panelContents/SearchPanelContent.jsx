"use client"

import React, {useContext} from "react";
import CloseIcon from "@/public/icons/panel-controler-icons/close.svg";
import Forward from "@/public/icons/setting-tools-icons/forward.svg";
import Backward from "@/public/icons/setting-tools-icons/backward.svg";
import SearchIcon from "@/public/icons/tools-icons/search.svg";
import {BookData, SelectedPanel} from "@/contexts/main";

export default function SearchPanelContent() {

    const {panels, setPanels} = useContext(SelectedPanel);
    const {bookData, setBookData} = useContext(BookData);
    const title = bookData?.title || "";

    const closePanel = () => {
        setPanels((prevPanels) =>
            prevPanels.map((panel) =>
                panel.id === "search" ? {...panel, isOpened: false} : panel
            )
        );
    };
    return (
        <>
            <div className="space-y-5.5">
                <div className="flex items-center justify-between pl-8 pr-6 h-7">
                    <h3 className="pr-4.5 text-xl font-bold leading-8 text-gray-900 dark:text-white">البحث</h3>
                    <div className="cursor-pointer text-gray-600 dark:text-gray-300" onClick={closePanel}>
                        <CloseIcon/>
                    </div>
                </div>
                <div className="pl-7 pr-6">
                    <div className="space-y-4 p-4 bg-[#FAFAFA] dark:bg-gray-800 rounded-xxl">
                        <div className="flex items-center h-7 text-gray-700 dark:text-gray-300">
                            <span>البحث فی&nbsp;</span>
                            <h2 className="font-semibold">{title}</h2>
                        </div>

                       <div className="flex items-center py-2.5 px-5 bg-white dark:bg-gray-700 xs:max-w-84 xs:h-12 rounded-xlg divide-x-2 divide-x-inherit">
                           <div className="relative flex items-center gap-x-1.5 pl-4.5 max-w-55">
                               <input type="text" className="overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] text-right bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none" placeholder="جستجو در کتاب..."/>
                               <SearchIcon className="absolute left-5"/>
                           </div>
                           <div className="flex items-center gap-x-6 pr-5.5">
                               <Backward className="-rotate-90"/>
                               <Forward className="-rotate-90"/>
                           </div>
                       </div>
                    </div>
                </div>
            </div>
        </>
    )
}
