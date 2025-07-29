import React from "react";

export default function InfoBox({ children }) {
  return (
    <>
      <div className="book_info-box flex p-5 w-full text-sm bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        {children}
      </div>
    </>
  );
}
