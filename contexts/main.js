"use client";

import {createContext, useState} from "react";

export const BookData = createContext(null);

const initBookData = {
    id: 0,
    title: "",
    link: "",
    slug: "",
    correction: 0,
    year: 0,
    saved: false,
    part: 0,
    single: 0,
    pages: 0,
    hits: 0,
    downloads: 0,
    author: {
        id: 0,
        title: "",
        link: "",
    },
    publisher: {
        id: 0,
        title: "",
        link: "",
    },
    download_types: {
        doc: "",
    },
    category: {
        id: 0,
        title: "",
        link: "",
    },
    created_at: "",
    introduction: null,
    image: "",
    breadcrumb: [],
};

export const SelectedPanel = createContext(null);

const initialPanels = [
    {id: "search", isOpened: false, zIndex: 0},
    {id: "setting", isOpened: false, zIndex: 0},
    {id: "menubar", isOpened: true, isPermanent: true, zIndex: 1}, // همیشه باز
    {id: "info", isOpened: false, zIndex: 0},
];

export const PageContext = createContext(null);

export function DataProviders({children}) {
    const [panels, setPanels] = useState(initialPanels);
    const [bookData, setBookData] = useState(initBookData);
    const [currentPage, setCurrentPage] = useState(1);
    const [zoom, setZoom] = useState(100);
    const [isShowAllPages, setIsShowAllPages] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [pagesCache, setPagesCache] = useState({});
    const [searchHighlight, setSearchHighlight] = useState('');
    const [fullBookContent, setFullBookContent] = useState([]);
    const [applyZoom, setApplyZoom] = useState(() => () => {
    });


    return (
        <BookData.Provider value={{bookData, setBookData}}>
            <SelectedPanel.Provider value={{panels, setPanels}}>
                <PageContext.Provider
                    value={{
                        currentPage,
                        setCurrentPage,
                        zoom,
                        setZoom,
                        isShowAllPages,
                        setIsShowAllPages,
                        isInputFocused,
                        setIsInputFocused,
                        pagesCache,
                        setPagesCache,
                        searchHighlight,
                        setSearchHighlight,
                        fullBookContent,
                        setApplyZoom,
                        applyZoom,
                        setFullBookContent,
                    }}
                >
                    {children}
                </PageContext.Provider>
            </SelectedPanel.Provider>
        </BookData.Provider>
    );
}