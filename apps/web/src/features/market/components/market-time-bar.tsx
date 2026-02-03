"use client";

const SESSIONS = [
  { label: "集合竞价", start: 0, end: 6, color: "bg-[#d4d4d4]/50" },
  { label: "连续竞价", start: 6, end: 46, color: "bg-[#4a7c59]/20" },
  { label: "午休", start: 46, end: 56, color: "bg-[#d4d4d4]/30" },
  { label: "连续竞价", start: 56, end: 96, color: "bg-[#4a7c59]/20" },
  { label: "已收盘", start: 96, end: 100, color: "bg-[#d4d4d4]/20" },
];

const TIME_MARKS = [
  { label: "9:15", pos: 0 },
  { label: "9:30", pos: 6 },
  { label: "10:00", pos: 18 },
  { label: "10:30", pos: 30 },
  { label: "11:00", pos: 38 },
  { label: "11:30", pos: 46 },
  { label: "13:00", pos: 56 },
  { label: "13:30", pos: 66 },
  { label: "14:00", pos: 76 },
  { label: "14:30", pos: 86 },
  { label: "15:00", pos: 96 },
];

function getCurrentPosition(): number {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const time = h * 60 + m;

  // Before market
  if (time < 555) return 0; // 9:15
  // Pre-market auction 9:15-9:30
  if (time < 570) return ((time - 555) / 15) * 6;
  // Morning session 9:30-11:30
  if (time < 690) return 6 + ((time - 570) / 120) * 40;
  // Lunch break 11:30-13:00
  if (time < 780) return 46 + ((time - 690) / 90) * 10;
  // Afternoon session 13:00-15:00
  if (time < 900) return 56 + ((time - 780) / 120) * 40;
  // After market
  return 98;
}

export function MarketTimeBar() {
  const pos = getCurrentPosition();

  return (
    <div className="relative px-4 py-1.5 mx-4">
      <div className="relative h-5 rounded-full overflow-hidden bg-white/40">
        {SESSIONS.map((s) => (
          <div
            key={s.label + s.start}
            className={`absolute top-0 bottom-0 ${s.color}`}
            style={{
              left: `${s.start}%`,
              width: `${s.end - s.start}%`,
            }}
          />
        ))}
        {/* Current time indicator */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-mine-nav-active z-10"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-mine-nav-active" />
        </div>
      </div>
      {/* Time marks */}
      <div className="relative h-4 mt-0.5">
        {TIME_MARKS.map((t) => (
          <span
            key={t.label}
            className="absolute text-[10px] text-mine-muted -translate-x-1/2 tabular-nums"
            style={{ left: `${t.pos}%` }}
          >
            {t.label}
          </span>
        ))}
      </div>
    </div>
  );
}
