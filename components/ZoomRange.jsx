"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import ZoomOutIcon from "@/public/icons/setting-tools-icons/zoom-out.svg";
import ZoomInIcon from "@/public/icons/setting-tools-icons/zoom-in.svg";

export default function ZoomRange() {
  const MIN = 50;
  const MAX = 200;

  // The order of marks doesn't strictly matter for label="",
  // but keeping it consistent with min/max helps readability.
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

  const [val, setVal] = useState(100); // Initial value set to 100%

  const handleChange = (_, newValue) => {
    setVal(newValue);
  };

  const handleZoomIn = () => {
    setVal(prev => Math.min(prev + 10, MAX));
  };

  const handleZoomOut = () => {
    setVal(prev => Math.max(prev - 10, MIN));
  };

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
              // variant="body2"
              onClick={() => setVal(MAX)}
              sx={{ cursor: "pointer", fontSize: 16, color: "#9CA3AF" }}
            >
              %{MAX}
            </Typography>

            {/* Typography for the current value (visually on the center) */}
            <Typography
                sx={{ cursor: "pointer", fontSize: 16, color: "#9CA3AF" }}
            >
              %{val}
            </Typography>

            {/* Typography for the "min" value (visually on the right in RTL) */}
            <Typography
              // variant="body2"
              onClick={() => setVal(MIN)}
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
