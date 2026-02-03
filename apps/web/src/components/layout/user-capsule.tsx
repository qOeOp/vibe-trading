"use client";

import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserCapsule() {
  return (
    <div className="flex items-center gap-1 pl-0.5 pr-1.5 py-0.5 bg-mine-nav-active rounded-full">
      <Avatar className="w-7 h-7 ring-2 ring-white/20">
        <AvatarImage src="/avatar.jpg" alt="VX" />
        <AvatarFallback className="bg-orange-100 text-[10px] font-semibold text-orange-700">
          VX
        </AvatarFallback>
      </Avatar>

      <button className="flex items-center justify-center text-white/70 hover:text-white transition-colors">
        <Menu className="w-3.5 h-3.5" strokeWidth={2} />
      </button>
    </div>
  );
}
