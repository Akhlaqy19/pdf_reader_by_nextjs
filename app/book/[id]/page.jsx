import React, { useContext } from "react";
import { Providers } from "@/contexts/main";
import PageContent from "@/components/PageContent";
import PanelTemplate from "@/components/PanelTemplate";
import ToolBar from "@/components/ToolBar";
import { getBookInfo } from "@/actions/api";


export default async function BookPage({params}) {

  const { id } = await params;
  const bookInfo = await getBookInfo(id);

  return (
    <>
      {/* <Providers> */}
        {/* wrapper */}
        <div className="relative">
          <ToolBar />
          <PanelTemplate bookData={bookInfo.data}>
            {/* <InfoPanelContent /> */}
          </PanelTemplate>
          <PageContent />
        </div>
      {/* </Providers> */}
    </>
  );
}
