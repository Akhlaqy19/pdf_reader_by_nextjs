// components/ProgressBar.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "./nprogress.css"; // یا import "./nprogress.css";

NProgress.configure({ showSpinner: false });

export default function ProgressBar() {
    const pathname = usePathname();

    useEffect(() => {
        NProgress.start();
        NProgress.done();
    }, [pathname]);

    return null;
}
