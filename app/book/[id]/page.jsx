import React from "react";
import PageWrapper from "@/components/PageWrapper";
import PanelTemplate from "@/components/PanelTemplate";
import ToolBar from "@/components/ToolBar";
import { getBookInfo } from "@/actions/api";
import BottomTool from "@/components/BottomTool";

export default async function BookPage({ params }) {

    try {
        const { id } = await params;
        const bookInfo = await getBookInfo(id);

        return (
            <>
                {/* wrapper */}
                <div className="relative min-w-screen min-h-max">
                    <ToolBar />
                    <main className="absolute top-16 min-h-max min-w-screen grid xs:[grid-template-areas: 'sidebar_main'] xs:grid-cols-[var(--aside-width)_1fr]">
                        <div className="flex items-stretch min-h-max h-full">
                            <PanelTemplate bookData={bookInfo.data}>
                            </PanelTemplate>
                            <PageWrapper />
                        </div>
                        <BottomTool />

                    </main>
                </div>
            </>
        );
    } catch (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">خطا در بارگذاری کتاب</h1>
                    <p className="text-gray-600">لطفاً بعداً تلاش کنید</p>
                </div>
            </div>
        );
    }
}
