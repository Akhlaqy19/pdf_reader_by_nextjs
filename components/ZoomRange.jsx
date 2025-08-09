"use client";

import React, { useState, useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import ZoomOutIcon from "@/public/icons/setting-tools-icons/zoom-out.svg";
import ZoomInIcon from "@/public/icons/setting-tools-icons/zoom-in.svg";
import { PageContext } from "@/contexts/main";

export default function ZoomRange() {
  const MIN = 50;
  const MAX = 200;
  const { zoom, setZoom } = useContext(PageContext);
  const val = zoom || 100;

  const marks = [
    {
      value: MIN,
      label: "",
    },
    {
      value: MAX,
      label: "",
    },
  ];

  const zoomSteps = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];

  const handleChange = (_, newValue) => {
    setZoom(newValue);
  };

  const handleZoomIn = () => {
    const currentIndex = zoomSteps.indexOf(val);
    if (currentIndex < zoomSteps.length - 1) {
      setZoom(zoomSteps[currentIndex + 1]);
    }
  };

  const handleZoomOut = () => {
    const currentIndex = zoomSteps.indexOf(val);
    if (currentIndex > 0) {
      setZoom(zoomSteps[currentIndex - 1]);
    }
  };

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -1 : 1;
      const currentIndex = zoomSteps.indexOf(val);
      const newIndex = Math.max(0, Math.min(zoomSteps.length - 1, currentIndex + delta));
      setZoom(zoomSteps[newIndex]);
    }
  };

  useEffect(() => {
    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => document.removeEventListener('wheel', handleWheel);
  }, [val]);

    // const handleZoomChange = (e) => {
    //   const englishValue = convertArabicToEnglish(e.target.value);
    //   const zoomValue = parseInt(englishValue);

    //   if (e.target.value === "") {
    //     setZoom(50);
    //   } else if (zoomValue > 0 && zoomValue <= 200) {
    //     // محدودیت برای جلوگیری از زوم بیش از حد (سازگار با react-pdf)
    //     setZoom(zoomValue);
    //     console.log(
    //       "Zoom updated to:",
    //       zoomValue,
    //       "Scale for react-pdf:",
    //       zoomValue / 100
    //     );
    //   }
    // };

  return (
    <>
      <div className="flex items-center gap-x-4 mx-auto p-4">
        <div onClick={handleZoomIn}>
          <ZoomInIcon className="flex-1 w-6 h-6 cursor-pointer" />
        </div>
        <Box
          sx={{
            width: 250,
            marginX: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            {/* Typography for the "max" value (visually on the left in RTL) */}
            <Typography
              onClick={() => setZoom(MAX)}
              sx={{ cursor: "pointer", fontSize: 16, color: "#9CA3AF" }}
            >
              %{MAX}
            </Typography>

            <Typography
                sx={{ cursor: "pointer", fontSize: 16, color: "#9CA3AF" }}
            >
              %{val}
            </Typography>

            <Typography
              onClick={() => setZoom(MIN)}
              sx={{ cursor: "pointer", fontSize: 16, color: "#9CA3AF" }}
            >
              %{MIN}
            </Typography>
          </Box>
          <Slider
            marks={marks}
            step={10}
            value={val}
            valueLabelDisplay="auto"
            min={MIN}
            max={MAX}
            sx={{
              "& .MuiSlider-thumb": {
                width: 24,
                height: 24,
                // backgroundColor: "#007cff",
                "&:hover": {
                  // boxShadow: "0 0 0 8px rgba(0, 124, 255, 0.16)",
                  cursor: "grab"
                },
              },
              "& .MuiSlider-track": {
                backgroundColor: "#007cf1",
                height: 4,
                cursor: "pointer"
              },
              "& .MuiSlider-rail": {
                backgroundColor: "#f3f4f6",
                height: 4,
              },
            }}
            onChange={handleChange}
          />
        </Box>
        <div onClick={handleZoomOut}>
          <ZoomOutIcon className="flex-1 w-6 h-6 cursor-pointer" />
        </div>
      </div>
    </>
  );
}
