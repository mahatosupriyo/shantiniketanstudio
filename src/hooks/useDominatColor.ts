'use client';

import { useState, useEffect } from 'react';
import { FastAverageColor } from 'fast-average-color';
// ^ named export in fast-average-color v9+.
//   If your installed version is <v9, use: import FastAverageColor from 'fast-average-color';

/** Extracts the dominant color of an image and returns a faded rgba string. */
export function useDominantColor(src?: string, opacity = 0.1): string {
  const [color, setColor] = useState('rgba(255,255,255,0)');

  useEffect(() => {
    if (!src) return;

    const fac = new FastAverageColor();
    const img = document.createElement('img');
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      try {
        const { value } = fac.getColor(img);
        setColor(`rgba(${value[0]}, ${value[1]}, ${value[2]}, ${opacity})`);
      } catch {
        setColor('rgba(255,255,255,0)');
      }
    };

    return () => fac.destroy();
  }, [src, opacity]);

  return color;
}