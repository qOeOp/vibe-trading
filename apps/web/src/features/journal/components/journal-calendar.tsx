"use client";

import { CalendarProvider } from "../calendar/contexts/calendar-context";
import { DndProvider } from "../calendar/contexts/dnd-context";
import { CalendarHeader } from "../calendar/header/calendar-header";
import { CalendarBody } from "../calendar/calendar-body";
import { CALENDAR_ITEMS_MOCK, USERS_MOCK } from "../calendar/mocks";
import { Toaster } from "@/components/ui/sonner";

export function JournalCalendar() {
  return (
    <CalendarProvider events={CALENDAR_ITEMS_MOCK} users={USERS_MOCK} view="month">
      <DndProvider>
        <div
          data-slot="journal-calendar"
          className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-mine-border bg-white shadow-sm"
        >
          <CalendarHeader />
          <CalendarBody />
        </div>
        <Toaster />
      </DndProvider>
    </CalendarProvider>
  );
}
