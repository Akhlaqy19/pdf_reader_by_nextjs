"use client";

import React, {useContext, useEffect, useState} from "react";
import {styled} from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import InfoBox from "@/components/InfoBox";
import ZoomRange from "@/components/ZoomRange";
import {useTheme} from "next-themes";
import ThemeSwitch from "@/components/ThemeSwitch";
import {PageContext, SelectedPanel} from "@/contexts/main";
import CloseIcon from "@/public/icons/panel-controler-icons/close.svg";

// const { theme, toggleTheme, setTheme, mounted } = useThemeToggle();

const StyledSwitch = styled(Switch)(({theme}) => {
    const onePageIcon = "/icons/pdf-mode/one-page.svg";
    const allPagesIcon = "/icons/pdf-mode/all-pages.svg";
    const thumbSize = 20;
    const trackWidth = 48;
    const trackHeight = 28;
    const travelDistance = trackWidth - thumbSize - 8; // 4px padding از هر طرف
    // theme.

    return {
        width: trackWidth, height: trackHeight, padding: 0,

        "& .MuiSwitch-switchBase": {
            padding: 4, // padding برای thumb
            transitionDuration: "150ms",

            "&.Mui-checked": {
                transform: `translateX(${travelDistance}px)`,

                "& + .MuiSwitch-track": {
                    backgroundColor: "#007cff", opacity: 1,
                },

                "& .MuiSwitch-thumb": {
                    backgroundColor: "#fff", maskImage: `url(${onePageIcon})`, WebkitMaskImage: `url(${onePageIcon})`,
                },
            },
        },

        "& .MuiSwitch-thumb": {
            backgroundColor: "#fff",
            width: thumbSize,
            height: thumbSize,
            maskImage: `url(${allPagesIcon})`,
            WebkitMaskImage: `url(${allPagesIcon})`,
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            maskSize: "90%",
            WebkitMaskSize: "90%",
        },

        "& .MuiSwitch-track": {
            borderRadius: trackHeight / 2,
            backgroundColor: "#007cff",
            opacity: 1,
            height: trackHeight,
            transition: theme.transitions.create(["background-color"], {
                duration: 150,
            }),
        },
    };
});

export default function SettingPanelContent() {

    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);
    const {isShowAllPages, setIsShowAllPages} = useContext(PageContext);
    const {panels, setPanels} = useContext(SelectedPanel);
    
    console.log('SettingPanelContent - isShowAllPages:', isShowAllPages);
    
    const closePanel = () => {
        setPanels((prevPanels) =>
            prevPanels.map((panel) =>
                panel.id === "setting" ? {...panel, isOpened: false, zIndex: 0} : panel
            )
        );
    };

    const playToggleSound = () => {
        // ایجاد صدای کوتاه و ریز
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(500, audioContext.currentTime); // فرکانس بالا برای صدای ریز
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime); // صدای آرام
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1); // مدت زمان کوتاه
    };


    return (<>
            {/* Header با آیکون بستن */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">تنظیمات</h3>
                <div className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={closePanel}>
                    <CloseIcon className="min-w-5 min-h-5" />
                </div>
            </div>
            
            <div className="flex flex-col gap-y-3">
                <h3 className="mt-6 text-gray-500 dark:text-gray-300 text-lg font-normal ps-5">
                    إضاءة الخلفية
                </h3>
                <InfoBox>
                    <div className="w-full h-full flex items-center justify-between">
                        <h3 className="text-lg font-normal text-gray-900 dark:text-white">
                            إضاءة الخلفية
                        </h3>
                        <ThemeSwitch/>
                    </div>
                </InfoBox>
            </div>

            <div className="flex flex-col gap-y-3">
                <h3 className="mt-6 text-gray-500 dark:text-gray-300 text-lg font-normal ps-5">
                    حجم الخط
                </h3>

                {/* <InfoBox> */}
                <div className="book_info-box p-1 w-full text-sm bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <ZoomRange/>
                </div>
                {/* </InfoBox> */}
            </div>

            <div className="flex flex-col gap-y-3">
                <h3 className="mt-6 text-gray-500 dark:text-gray-300 text-lg font-normal ps-5">
                    عرض الکتاب
                </h3>

                {/* <InfoBox> */}
                <div
                    className="book_info-box flex items-center justify-between p-4 w-full text-sm bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <span className="text-xs text-[#111827] dark:text-white">
                        {isShowAllPages ? "(جميع الکتاب)" : "(صفحة واحدة)"}
                    </span>
                    <FormGroup>
                        <FormControlLabel
                            control={<StyledSwitch
                                sx={{m: 1}}
                                checked={isShowAllPages}
                                onChange={(event) => {
                                    console.log('Switch clicked, new value:', event.target.checked);
                                    setIsShowAllPages(event.target.checked);
                                    playToggleSound();
                                    console.log(event.target.checked ? "all pages mode" : "one page mode");
                                }}
                            />}
                            label=""
                        />
                    </FormGroup>
                </div>
                {/* </InfoBox> */}
            </div>
        </>);
}
