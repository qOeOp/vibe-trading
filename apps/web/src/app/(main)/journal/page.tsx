import type { Metadata } from "next";
import { JournalCalendar } from "@/features/journal";

export const metadata: Metadata = {
  title: "Daily - Journal - Vibe Trading",
};

export default function JournalDailyPage() {
  return (
    <div className="flex-1 p-4">
      <JournalCalendar />
    </div>
  );
}
