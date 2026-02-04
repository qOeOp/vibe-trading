"use client";

import { useEffect, useRef, memo } from "react";
import { useTheme } from "next-themes";

interface TradingViewChartProps {
  symbol?: string;
}

// Theme-specific configurations for TradingView widget
const THEME_CONFIG = {
  dark: {
    theme: "dark",
    backgroundColor: "#1a1a1a",
    gridColor: "rgba(255, 255, 255, 0.06)",
    containerBg: "bg-[#1a1a1a]",
  },
  light: {
    theme: "light",
    backgroundColor: "#ffffff",
    gridColor: "rgba(0, 0, 0, 0.06)",
    containerBg: "bg-white",
  },
} as const;

function TradingViewChartComponent({ symbol = "NASDAQ:AAPL" }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  // Default to dark theme during SSR/hydration
  const currentTheme = resolvedTheme === "light" ? "light" : "dark";
  const config = THEME_CONFIG[currentTheme];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous widget
    container.innerHTML = "";

    // Create widget container
    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container__widget";
    widgetContainer.style.height = "100%";
    widgetContainer.style.width = "100%";
    container.appendChild(widgetContainer);

    // Create and append script
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      allow_symbol_change: true,
      calendar: false,
      details: false,
      hide_side_toolbar: false,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_volume: false,
      hotlist: false,
      interval: "D",
      locale: "en",
      save_image: true,
      style: "1",
      theme: config.theme,
      timezone: "Asia/Shanghai",
      backgroundColor: config.backgroundColor,
      gridColor: config.gridColor,
      watchlist: [],
      withdateranges: true,
      range: "3M",
      compareSymbols: [],
      studies: ["STD;SMA"],
      autosize: true,
    });
    container.appendChild(script);

    return () => {
      // Cleanup on unmount
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [symbol, config]);

  return (
    <div
      ref={containerRef}
      className={`tradingview-widget-container flex-1 rounded-xl overflow-hidden ${config.containerBg}`}
      style={{ height: "100%", width: "100%" }}
    />
  );
}

export const TradingViewChart = memo(TradingViewChartComponent);
