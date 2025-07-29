"use client"
import React, { useState } from 'react'
import Link from 'next/link';

export default function BookPartLink({ i, text }) {
  const [selectedPartIndex, setSelectedPartIndex] = useState(1);

  return (
    <>
      <li
        className={`flex items-center justify-between pr-4.5 pl-7 h-12 ${
          selectedPartIndex === i + 1 ? "bg-light-blue" : "bg-white"
        }`}
        onClick={() => setSelectedPartIndex(i + 1)}
      >
        <Link href="#" className="font-light text-lg">
          {text}
        </Link>
        <span>{i + 1}</span>
      </li>
    </>
  );
}
