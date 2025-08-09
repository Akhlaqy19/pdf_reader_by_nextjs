"use client"
import React from "react"

export default function ErrorRootPage () {
    return (
        <>
            <div className="fixed inset-0 w-full h-full bg-white w-100 h-100">
                <h1 className={"bg-red text-xl font-bold rounded-lg"}>Oops! Error in Application running !!!</h1>
            </div>
        </>
    )
}