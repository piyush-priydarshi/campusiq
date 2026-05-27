"use client";

import React, { useState, useEffect } from "react";

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatLabel?: (value: number) => string;
}

export function Slider({
  min,
  max,
  step = 10000,
  value,
  onChange,
  formatLabel = (v) => `${(v / 100000).toFixed(1)}L`,
}: SliderProps) {
  const [minValue, setMinValue] = useState(value[0]);
  const [maxValue, setMaxValue] = useState(value[1]);

  useEffect(() => {
    setMinValue(value[0]);
    setMaxValue(value[1]);
  }, [value]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), maxValue - step);
    setMinValue(val);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), minValue + step);
    setMaxValue(val);
  };

  const handleDragEnd = () => {
    onChange([minValue, maxValue]);
  };

  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;

  return (
    <div className="w-full space-y-3.5">
      {/* Formatted Labels */}
      <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-text-secondary">
        <span>MIN: {formatLabel(minValue)}</span>
        <span>MAX: {formatLabel(maxValue)}</span>
      </div>

      {/* Track */}
      <div className="relative w-full h-[3px] bg-surface-200">
        {/* Fill */}
        <div
          className="absolute h-full bg-secondary"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />

        {/* Min Input Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          onMouseUp={handleDragEnd}
          onTouchEnd={handleDragEnd}
          className="absolute w-full h-[3px] appearance-none pointer-events-none bg-transparent focus:outline-none cursor-pointer z-30
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125
            [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-125"
        />

        {/* Max Input Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          onMouseUp={handleDragEnd}
          onTouchEnd={handleDragEnd}
          className="absolute w-full h-[3px] appearance-none pointer-events-none bg-transparent focus:outline-none cursor-pointer z-30
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125
            [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-125"
        />
      </div>
    </div>
  );
}
