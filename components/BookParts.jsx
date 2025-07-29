"use client"
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { convertEnglishToArabic } from "@/utils/numberConverter";

import ticedBookPart from "@/public/images/tic_book_part_img.webp";
// import TicBookIcon from "@/public/icons/tic_book_img.svg";
// import bookPart from "@/public/images/part.webp";

export default function BookParts({ partsCount, isAuthorized = false }) {
  const [partSelected, setPartSelected] = useState(-1);

  const handleVisualSelection = (index) => {
    if (!isAuthorized) {
      console.warn('Unauthorized access attempt');
      return;
    }
    setPartSelected(index);
  };
  return (
    <>
      {/* Parts Segment */}
      <div className="flex flex-row flex-nowrap items-center gap-x-2 w-full overflow-x-auto mx-auto mt-15 mb-8 scrollbar scrollbar-thin">
        {Array.from({ length: partsCount }).map((_, index) => {
          return (
            <React.Fragment key={index + 1}>
              <div
                key={index + 1}
                className={`relative w-10 h-auto shrink-0 ${
                  partSelected === index ? "mb-6" : ""
                }`}
              >
                <Image
                  key={index + 1}
                  src={ticedBookPart}
                  alt="book part cover image"
                  // className="relative w-10"
                />
                <Link
                  title={`الجزء ${convertEnglishToArabic(index + 1)}`}
                  className="absolute -left-6.5 top-9 flex flex-wrap items-center justify-center ps-4 font-extrabold dark:text-gray-800 w-24 h-4 text-right lg:h-10 overflow-hidden -rotate-90"
                  href={isAuthorized ? `#` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!isAuthorized) {
                      e.preventDefault();
                      return;
                    }
                    handleVisualSelection(index);
                  }}
                >
                  الجزء
                  {convertEnglishToArabic(index + 1)}
                </Link>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
}
