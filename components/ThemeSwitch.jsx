"use client"

import React, {useState, useEffect} from "react";
import {useTheme} from "next-themes";
import Image from "next/image";
import {FiSun, FiMoon} from "react-icons/fi";

import {styled} from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";


const StyledSwitch = styled(Switch)(({theme}) => {
// آدرس آیکون‌ها (مطمئن شو که در مسیر public یا یک مسیر قابل دسترس باشن)
    const sunIcon = "/icons/theme/sun-icon.svg";
    const moonIcon = "/icons/theme/moon-icon.svg";
    const thumbSize = 20;
    const trackWidth = 48;
    const trackHeight = 28;
    const travelDistance = trackWidth - thumbSize - 8; // 4px padding از هر طرف
    // theme.

    return {
        width: trackWidth,
        height: trackHeight,
        padding: 0,

        "& .MuiSwitch-switchBase": {
            padding: 4, // padding برای thumb
            transitionDuration: "300ms",

            "&.Mui-checked": {
                transform: `translateX(${travelDistance}px)`,

                "& + .MuiSwitch-track": {
                    backgroundColor: "#007cff",
                    opacity: 1,
                },

                "& .MuiSwitch-thumb": {
                    backgroundColor: "#fff",
                    maskImage: `url(${moonIcon})`,
                    WebkitMaskImage: `url(${moonIcon})`,
                },
            },
        },

        "& .MuiSwitch-thumb": {
            backgroundColor: "#fff",
            width: thumbSize,
            height: thumbSize,
            maskImage: `url(${sunIcon})`,
            WebkitMaskImage: `url(${sunIcon})`,
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
                duration: 300,
            }),
        },
    };
});

export default function ThemeSwitch() {
    // const [themeChecked, setChecked] = useState(false);

    const [mounted, setMounted] = useState(false);
    const {theme, setTheme, resolvedTheme} = useTheme();

    useEffect(() => setMounted(true), [])
    if (!mounted) return (
        <Image
            src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
            width={36}
            height={36}
            sizes="36x36"
            alt="Loading Light/Dark Toggle"
            priority={false}
            title="Loading Light/Dark Toggle"
        />
    )

    const playToggleSound = () => {
        // ایجاد صدای کوتاه و ریز
        const audioContext = new window.AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(500, audioContext.currentTime); // فرکانس بالا برای صدای ریز
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime); // صدای آرام
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.1
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1); // مدت زمان کوتاه
    };

    const handleChange = (event) => {

        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
        const newTheme = event.target.checked ? "dark" : "light";
        console.log('Switching theme to:', newTheme);

        playToggleSound();
    };

    return (
        <>
            <FormGroup>
                <FormControlLabel
                    control={
                        <StyledSwitch
                            onChange={handleChange}
                        />
                    }
                    label=""
                />
            </FormGroup>
        </>
    )
}