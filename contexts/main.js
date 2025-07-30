"use client";

import { createContext, useState } from "react";

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
  breadcrumb: [
  ],
};

export const SelectedPanel = createContext(null);

const initialPanels = [
  { id: "search", isOpened: false, isClosed: false },
  { id: "setting", isOpened: false, isClosed: false },
  { id: "menubar", isOpened: true, isClosed: false },
  { id: "info", isOpened: false, isClosed: false },
];

export const PageContext = createContext(null);

export function DataProviders({ children }) {
  const [panels, setPanels] = useState(initialPanels);
  const [bookData, setBookData] = useState(initBookData);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  return (
      <BookData.Provider value={{ bookData, setBookData }}>
        <SelectedPanel.Provider value={{ panels, setPanels }}>
          <PageContext.Provider
            value={{
              currentPage,
              setCurrentPage,
              zoom,
              setZoom,
            }}
          >
            {children}
          </PageContext.Provider>
        </SelectedPanel.Provider>
      </BookData.Provider>
  );
}