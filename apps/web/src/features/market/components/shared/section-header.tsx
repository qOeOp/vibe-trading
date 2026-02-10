"use client";

import { memo } from "react";
import type { ReactNode } from "react";

export interface SectionHeaderProps {
  /** 标题文字 */
  title: string;
  /** 右侧附加内容 */
  suffix?: ReactNode;
  /** 是否显示"更多"链接 */
  showMore?: boolean;
  /** 自定义链接文字，默认为"更多" */
  moreText?: string;
  /** 点击"更多"的回调 */
  onMoreClick?: () => void;
}

/**
 * 通用分区标题组件
 * 用于详情面板中各个分区的标题行
 */
export const SectionHeader = memo(function SectionHeader({
  title,
  suffix,
  showMore,
  moreText = "更多",
  onMoreClick,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-mine-muted uppercase tracking-wide">
        {title}
      </span>
      {suffix && <span className="text-[10px] text-mine-muted">{suffix}</span>}
      {showMore && (
        <button
          onClick={onMoreClick}
          aria-label={`查看${title}${moreText}`}
          className="text-[10px] text-mine-accent-teal cursor-pointer hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-mine-accent-teal/50 rounded px-0.5"
        >
          {moreText} &gt;
        </button>
      )}
    </div>
  );
});
