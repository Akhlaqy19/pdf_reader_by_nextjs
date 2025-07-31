"use client"
import React, {useEffect, useState} from "react";
import CenterLoadingBar from "@/components/CenterLoadingBar";

export default function PageLoading() {

    // const [percent, setPercent] = useState(0);
    //
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setPercent(prev => (prev < 100 ? prev + 1 : 100));
    //     }, 30);
    //
    //     return () => clearInterval(interval);
    // }, []);

    return (
        <>
            <div className="flex justify-center items-center inset-0 w-screen h-screen bg-gray-700">
                <div className="relative p-8 w-60 h-60 bg-white rounded-xl">
                    <h2 className="text-dark dark:text-white text-center text-xl font-semibold">الرجاء الانتظار</h2>
                    {/*<progress>*/}
                    {/*<CenterLoadingBar/>*/}
                    {/*</progress>*/}

                    {/*<div className="fixed flex items-center justify-center bg-white">*/}
                    {/*    <div className="w-2/3 sm:w-1/2 md:w-1/3 h-3 bg-gray-200 rounded">*/}
                    {/*        <div*/}
                    {/*            className="h-full bg-blue-500 rounded transition-all duration-100"*/}
                    {/*            style={{ width: `${percent}%` }}*/}
                    {/*        />*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </div>
        </>
    )
}