import React from "react";
import PageWrapper from "@/components/PageWrapper";
import PanelTemplate from "@/components/PanelTemplate";
import ToolBar from "@/components/ToolBar";
import {getBookInfo} from "@/actions/api";

export default async function BookPage({params}) {

    const {id} = await params;
    const bookInfo = await getBookInfo(id);

    return (
        <>
            {/* wrapper */}
            <div className="relative grid xs:[grid-template-areas: 'header_header'_'sidebar_main']">
                <ToolBar/>
                <PanelTemplate bookData={bookInfo.data}>
                </PanelTemplate>
                <PageWrapper />
            </div>
        </>
    );
}
