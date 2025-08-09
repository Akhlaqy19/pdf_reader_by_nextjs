import React from "react";
import Image from "next/image";
import Link from "next/link";

import bookCover from "@/public/images/book-cover.png";
import Writer from "@/public/icons/book-info-icons/writer.svg";
import Category from "@/public/icons/book-info-icons/category.svg";
import Publisher from "@/public/icons/book-info-icons/publisher.svg";
import Page from "@/public/icons/book-info-icons/page.svg";

import DocWordIcon from "@/public/icons/file-format-icons/doc-word.svg";
import PdfImageIcon from "@/public/icons/file-format-icons/pdf-image.svg";
import PdfTextIcon from "@/public/icons/file-format-icons/pdf-text.svg";

import EmailIcon from "@/public/icons/platforms-icons/email.svg";
import FacebookIcon from "@/public/icons/platforms-icons/facebook.svg";
import TelegramIcon from "@/public/icons/platforms-icons/telegram.svg";
import WhatsappIcon from "@/public/icons/platforms-icons/whatsapp.svg";
import TwitterIcon from "@/public/icons/platforms-icons/x-twitter.svg";

import DefaultBookCover from "@/public/images/default.png";
import BookParts from "../BookParts";


export default function InfoPanelContent({bookData}) {
    const bookId = bookData?.id || 0;
    const partsNumber = bookData?.part || 0;
    const title = bookData?.title || "";
    const image = bookData.image || DefaultBookCover.src;
    const author_title = bookData?.author?.title || "";
    const category_title = bookData?.category?.title || "";
    const publisher_title = bookData?.publisher?.title || "";
    const pagesCount = bookData?.pages || 0;
    const downloadedTypes = bookData?.download_types;

    const baseURL = "https://lib.rafed.net/Books";
    // if (downloadedTypes.doc) {
    //     const book_name = downloadedTypes.doc.slice(0, downloadedTypes.doc.indexOf("/"));
    //
    //     console.log(`${image.splitText(book_name)}`)
    // }
    const currentPage = 3;

    return (
        <>
            {/* wrapper for panel component */}

            {/* book info */}
            <div className="flex items-center gap-x-8">
                <div className="relative overflow-hidden rounded-md drop-shadow-book-cover book-cover-container">
                    <Image
                        src={image}
                        alt="Book Cover Image"
                        fill
                        sizes="(max-width: 394px) 100px, 137px"
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col justify-start gap-3 max-w-48 max-md:h-35.5 md:h-36.5">
                    <h1 className="font-inter font-semibold text-base text-black dark:text-white">{title}</h1>
                    <div className="">
                        <ul className="flex flex-col *:flex *:items-center *:gap-x-2 text-xs *:*:last:text-blue-700 dark:*:*:last:text-blue-400 space-y-3 text-gray-700 dark:text-gray-300">
                            {author_title && (
                                <li>
                                    <Writer className=""/>:<Link href="#">{author_title}</Link>
                                </li>
                            )}

                            {category_title && (
                                <li>
                                    <Category className=""/>:
                                    <Link href="#">{category_title}</Link>
                                </li>
                            )}

                            {publisher_title && (
                                <li>
                                    <Publisher className=""/>:
                                    <Link href="#">{publisher_title}</Link>
                                </li>
                            )}

                            {pagesCount && (
                                <li>
                                    <Page className=""/>:<Link href="#">{pagesCount}</Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            <BookParts partsCount={partsNumber}/>

            <div className="py-10 border-t border-b border-gray-200 dark:border-gray-700">
                <ul className="space-y-3">
                    {downloadedTypes.doc &&
                        <li className="flex items-center justify-between pr-3 w-full h-9 bg-gray-100 dark:bg-gray-800 rounded-tr-xlg rounded-br-xlg rounded-tl-xs rounded-tb-xs">
                            <Link href={`${baseURL}/${downloadedTypes.doc}`} className="text-blue-600 dark:text-blue-400 font-inter">تنزیل علی
                                Word</Link>
                            <DocWordIcon className="w-7.5 h-9"/>
                        </li>
                    }
                    {
                        downloadedTypes.pdfimg &&
                        <li className="flex items-center justify-between pr-3 w-full h-9 bg-gray-100 dark:bg-gray-800 rounded-tr-xlg rounded-br-xlg rounded-tl-xs rounded-tb-xs">
                            <Link href={`${baseURL}/${downloadedTypes.pdfimg}`} className="text-blue-600 dark:text-blue-400 font-inter">تنزیل الصور
                                PDF</Link>
                            <PdfImageIcon className="w-7.5 h-9"/>
                        </li>
                    }
                    {downloadedTypes.pdf &&
                        <li className="flex items-center justify-between pr-3 w-full h-9 bg-gray-100 dark:bg-gray-800 rounded-tr-xlg rounded-br-xlg rounded-tl-xs rounded-tb-xs">
                            <Link href={`${baseURL}/${downloadedTypes.pdf}`} className="text-blue-600 dark:text-blue-400 font-inter">تنزیل الملف
                                PDF</Link>
                            <PdfTextIcon className="w-7.5 h-9"/>
                        </li>
                    }
                </ul>
            </div>

            <div className="flex flex-col gap-y-6 text-gray-600 dark:text-gray-400 pt-8">
                <h4 className="font-inter font-semibold text-gray-900 dark:text-white">الشارک</h4>
                <div className="flex items-center justify-between px-3">
                    <Link
                        href={`https://api.whatsapp.com/send?text=https://books.rafed.net/view/${bookId}/page/${currentPage}`}>
                        <WhatsappIcon/>
                    </Link>
                    {/**/}
                    <Link href={`mailto:?&subject=&body=https://books.rafed.net/view/${bookId}/page/${currentPage}`}>
                        <EmailIcon/>
                    </Link>
                    <Link
                        href={`https://www.facebook.com/sharer/sharer.php?u=https://books.rafed.net/view/${bookId}/page/${currentPage}`}>
                        <FacebookIcon/>
                    </Link>
                    <Link
                        href={`https://t.me/share/url?url=https://books.rafed.net/view/${bookId}/page/${currentPage}`}>
                        <TelegramIcon/>
                    </Link>
                    <Link
                        href={`https://twitter.com/intent/tweet?url=https://books.rafed.net/view/${bookId}/page/${currentPage}`}>
                        <TwitterIcon/>
                    </Link>
                </div>
            </div>
        </>
    );
}
