"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme-context";

const HEX_CHARS = "0123456789abcdef";
const CELL_SIZE = 22;
const MAX_ALPHA = 0.1;

export function AsciiBackground({ src }: { src: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const sampleCanvas = document.createElement("canvas");
    const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });

    let cols = 0;
    let rows = 0;
    let sourceData: Uint8ClampedArray | null = null;
    let chars: string[] = [];

    const randomChar = () => HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];

    const image = new window.Image();
    image.src = src;

    const sampleImage = () => {
      if (!sampleCtx || !image.complete || image.naturalWidth === 0) return;

      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      cols = Math.ceil(width / CELL_SIZE);
      rows = Math.ceil(height / CELL_SIZE);
      sampleCanvas.width = cols;
      sampleCanvas.height = rows;

      // Cover-fit crop of the photo into one pixel per grid cell.
      const imgRatio = image.naturalWidth / image.naturalHeight;
      const targetRatio = cols / rows;
      let sx = 0;
      let sy = 0;
      let sw = image.naturalWidth;
      let sh = image.naturalHeight;
      if (imgRatio > targetRatio) {
        sw = image.naturalHeight * targetRatio;
        sx = (image.naturalWidth - sw) / 2;
      } else {
        sh = image.naturalWidth / targetRatio;
        sy = (image.naturalHeight - sh) / 2;
      }
      sampleCtx.drawImage(image, sx, sy, sw, sh, 0, 0, cols, rows);
      sourceData = sampleCtx.getImageData(0, 0, cols, rows).data;
      chars = Array.from({ length: cols * rows }, randomChar);
    };

    let raf = 0;
    let cancelled = false;
    const start = performance.now();

    const draw = (now: number) => {
      if (cancelled) return;
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const t = (now - start) / 1000;

      if (sourceData) {
        const glyphRgb = theme === "dark" ? "52, 211, 153" : "5, 150, 105";
        const fontSize = CELL_SIZE * 0.8;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);
        ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const cellIndex = row * cols + col;
            const idx = cellIndex * 4;
            const luminance =
              (0.2126 * sourceData[idx] + 0.7152 * sourceData[idx + 1] + 0.0722 * sourceData[idx + 2]) / 255;

            const phase = t * 0.9 + (col * 0.3 + row * 0.5);
            const pulse = 0.5 + 0.5 * Math.sin(phase);
            const alpha = Math.min(MAX_ALPHA, (0.25 + luminance * 0.35) * pulse * MAX_ALPHA * 2);
            if (alpha < 0.015) continue;

            // Occasionally reroll a cell's glyph so flat-luminance areas don't freeze on one character.
            if (Math.random() < 0.01) chars[cellIndex] = randomChar();

            ctx.fillStyle = `rgba(${glyphRgb}, ${alpha})`;
            ctx.fillText(chars[cellIndex], (col + 0.5) * CELL_SIZE, (row + 0.5) * CELL_SIZE);
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    image.onload = () => {
      sampleImage();
    };
    if (image.complete) sampleImage();

    const handleResize = () => sampleImage();
    window.addEventListener("resize", handleResize);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
    };
  }, [src, theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[-1]"
    />
  );
}
