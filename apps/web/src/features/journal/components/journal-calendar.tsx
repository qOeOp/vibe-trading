'use client';

import { CalendarProvider } from '../calendar/contexts/calendar-context';
import { DndProvider } from '../calendar/contexts/dnd-context';
import { CalendarHeader } from '../calendar/header/calendar-header';
import { CalendarBody } from '../calendar/calendar-body';
import { CALENDAR_ITEMS_MOCK, USERS_MOCK } from '../calendar/mocks';
import { Card } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';

export function JournalCalendar() {
  return (
    <CalendarProvider
      events={CALENDAR_ITEMS_MOCK}
      users={USERS_MOCK}
      view="month"
    >
      <DndProvider>
        <Card data-slot="journal-calendar" className="h-full w-full">
          <CalendarHeader />
          <CalendarBody />
        </Card>
        <Toaster />
      </DndProvider>
    </CalendarProvider>
  );
}
