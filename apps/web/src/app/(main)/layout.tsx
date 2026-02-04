"use client";

import { TopNavBar } from "@/components/layout/top-nav-bar";
import { LeftIconSidebar } from "@/components/layout/left-icon-sidebar";
import { UserCapsule } from "@/components/layout/user-capsule";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen min-w-[1440px] bg-mine-page-bg flex">
      {/* 左侧：头像 + sidebar 垂直排列 */}
      <div className="flex flex-col items-center pt-3 pb-4 px-3 gap-3 shrink-0">
        <UserCapsule />
        <LeftIconSidebar />
      </div>

      {/* 右侧主区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航栏 */}
        <TopNavBar />

        {/* 主内容区 */}
        <div className="flex-1 flex gap-4 pr-4 pb-4 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
