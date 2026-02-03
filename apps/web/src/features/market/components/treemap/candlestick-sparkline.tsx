"use client";

import { memo, useEffect, useRef } from "react";

// ============ Types ============

export interface CandleData {
  open: number;
  close: number;
}

interface CandlestickSparklineProps {
  candles: CandleData[];
  width: number;
  height: number;
  className?: string;
}

// ============ Generator ============

export function generateMockCandles(changePercent: number, days: number = 60): CandleData[] {
  const basePrice = 50 + Math.random() * 150;
  const dailyDrift = changePercent / days / 100;
  const volatility = 0.015 + Math.random() * 0.01;
  const candles: CandleData[] = [];
  let price = basePrice;

  for (let i = 0; i < days; i++) {
    const open = price;
    const noise = (Math.random() - 0.5) * 2;
    const dailyReturn = dailyDrift + volatility * noise;
    price = open * (1 + dailyReturn);
    candles.push({ open, close: price });
  }

  // Nudge last close toward target
  const target = basePrice * (1 + changePercent / 100);
  candles[days - 1].close += (target - candles[days - 1].close) * 0.5;

  return candles;
}

// ============ Component ============

export const CandlestickSparkline = memo(function CandlestickSparkline({
  candles,
  width,
  height,
  className = "",
}: CandlestickSparklineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || candles.length < 2 || width <= 0 || height <= 0) {
      return;
    }

    // Find price range across all candles
    let lo = Infinity;
    let hi = -Infinity;
    for (const c of candles) {
      lo = Math.min(lo, c.open, c.close);
      hi = Math.max(hi, c.open, c.close);
    }
    const range = hi - lo || 1;

    // Y mapping with 8% padding
    const padY = height * 0.08;
    const drawH = height - 2 * padY;
    const priceToY = (p: number) => padY + drawH - ((p - lo) / range) * drawH;

    const n = candles.length;
    const barW = width / n;
    const gap = barW * 0.15;
    const bodyW = barW - gap;

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "sparkline-svg");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");
    svg.style.display = "block";
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.overflow = "hidden";

    candles.forEach((c, i) => {
      const yOpen = priceToY(c.open);
      const yClose = priceToY(c.close);
      const yTop = Math.min(yOpen, yClose);
      const barH = Math.max(1, Math.abs(yClose - yOpen));
      const x = i * barW + gap / 2;

      const rect = document.createElementNS(svgNS, "rect");
      rect.setAttribute("x", x.toFixed(1));
      rect.setAttribute("y", yTop.toFixed(1));
      rect.setAttribute("width", bodyW.toFixed(1));
      rect.setAttribute("height", barH.toFixed(1));
      rect.setAttribute("rx", "0.5");

      // White bars, up slightly brighter
      const isUp = c.close >= c.open;
      rect.setAttribute("fill", "#ffffff");
      rect.setAttribute("fill-opacity", isUp ? "0.7" : "0.35");

      // Staggered animation
      rect.style.opacity = "0";
      rect.style.animation = `bar-fade-in 60ms ease-out forwards`;
      rect.style.animationDelay = `${i * 25}ms`;

      svg.appendChild(rect);
    });

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(svg);

    // Trigger visible class after mount
    requestAnimationFrame(() => {
      containerRef.current?.classList.add("visible");
    });

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        containerRef.current.classList.remove("visible");
      }
    };
  }, [candles, width, height]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        opacity: 0,
        transition: "opacity 300ms ease-out",
      }}
    />
  );
});

// ============ CSS (add to globals.css) ============
// @keyframes bar-fade-in {
//   from { opacity: 0; }
//   to   { opacity: 1; }
// }
// .visible { opacity: 1 !important; }
