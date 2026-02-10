"use client";

import { useEffect, useRef, memo } from "react";

interface TradingViewChartProps {
  symbol?: string;
}

// TradingView widget always uses dark theme (inverted from the app's light visual theme)
const WIDGET_CONFIG = {
  theme: "dark",
  backgroundColor: "#1a1a1a",
  gridColor: "rgba(255, 255, 255, 0.06)",
  containerBg: "bg-[#1a1a1a]",
} as const;

function TradingViewChartComponent({ symbol = "NASDAQ:AAPL" }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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
      symbol,
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
      theme: WIDGET_CONFIG.theme,
      timezone: "Asia/Shanghai",
      backgroundColor: WIDGET_CONFIG.backgroundColor,
      gridColor: WIDGET_CONFIG.gridColor,
      watchlist: [],
      withdateranges: true,
      range: "3M",
      compareSymbols: [],
      studies: ["STD;SMA"],
      autosize: true,
    });
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [symbol]);

  return (
    <div
      ref={containerRef}
      className={`tradingview-widget-container flex-1 rounded-xl overflow-hidden ${WIDGET_CONFIG.containerBg}`}
      style={{ height: "100%", width: "100%" }}
    />
  );
}

export const TradingViewChart = memo(TradingViewChartComponent);
