"use client";
import React, { useContext, useState } from "react";
import Link from "next/link";
import { BookData } from "@/contexts/main";
import BookPartLink from "../BookPartLink";

export default function MenuPanelContent() {
  const [selectedPartIndex, setSelectedPartIndex] = useState(1);
  const { bookData, setBookData } = useContext(BookData);
  const bookTopics = bookData?.indexes || [];

  const bookPartsCount = 30;

  return (
    <>
      <div className="space-y-3">
        <div className="h-8">
          <h2 className="pr-4.5 text-xl font-bold leading-8">قائمه الکتاب</h2>
        </div>

        <div className="w-full">
          <ul className="flex flex-col divide-y-1 divide-gray-700">
            {bookTopics.map((part, i) => (
              <li
                key={i + 1}
                className={`flex items-center justify-between pr-4.5 pl-7 h-12 ${
                  selectedPartIndex === i + 1
                    ? "bg-gray-100 dark:bg-gray-700"
                    : "bg-white dark:bg-gray-800"
                }`}
                onClick={() => setSelectedPartIndex(i + 1)}
              >
                <Link href="#" className="font-light text-lg">
                  {part.title}
                </Link>
                <span>{part.page}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      ّ
    </>
  );
}
