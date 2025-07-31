// components/CenterLoadingBar.tsx
"use client";

import { useEffect, useState } from "react";

export default function CenterLoadingBar() {
    const [percent, setPercent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setPercent(prev => (prev < 100 ? prev + 1 : 100));
        }, 30);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="w-2/3 sm:w-1/2 md:w-1/3 h-3 bg-gray-200 rounded">
                <div
                    className="h-full bg-blue-500 rounded transition-all duration-100"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}
