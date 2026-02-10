"use client";

import { Search, Plus } from "lucide-react";

interface FilterBarProps {
  category: string;
  onCategoryChange: (v: string) => void;
  stockPool: string;
  onStockPoolChange: (v: string) => void;
  timePeriod: string;
  onTimePeriodChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
}

const CATEGORIES = ["全部", "价值", "质量", "动量", "情绪", "波动", "流动性", "规模"];
const STOCK_POOLS = ["全A", "沪深300", "中证500", "中证1000"];
const TIME_PERIODS = ["近1年", "近3年", "近5年", "全部"];
const STATUSES = ["全部", "强有效", "有效", "弱", "反向"];

function SelectFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-mine-muted whitespace-nowrap">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm text-mine-text bg-white border border-mine-border rounded-lg px-2.5 py-1.5 outline-none focus:border-mine-nav-active transition-colors cursor-pointer"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FilterBar({
  category,
  onCategoryChange,
  stockPool,
  onStockPoolChange,
  timePeriod,
  onTimePeriodChange,
  status,
  onStatusChange,
  search,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <SelectFilter
        label="类别"
        value={category}
        options={CATEGORIES}
        onChange={onCategoryChange}
      />
      <SelectFilter
        label="股票池"
        value={stockPool}
        options={STOCK_POOLS}
        onChange={onStockPoolChange}
      />
      <SelectFilter
        label="时段"
        value={timePeriod}
        options={TIME_PERIODS}
        onChange={onTimePeriodChange}
      />
      <SelectFilter
        label="状态"
        value={status}
        options={STATUSES}
        onChange={onStatusChange}
      />

      <div className="flex-1" />

      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-mine-muted" />
        <input
          type="text"
          placeholder="搜索因子..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="text-sm text-mine-text bg-white border border-mine-border rounded-lg pl-8 pr-3 py-1.5 w-[180px] outline-none focus:border-mine-nav-active transition-colors placeholder:text-mine-muted"
        />
      </div>

      <button type="button" className="flex items-center gap-1.5 bg-market-up-medium text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-market-up-medium/90 transition-colors">
        <Plus className="w-3.5 h-3.5" />
        新建因子
      </button>
    </div>
  );
}
