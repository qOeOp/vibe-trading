import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { differenceInMinutes, parseISO } from "date-fns";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { useCalendar } from "../../contexts/calendar-context";
import { EventDetailsDialog } from "../../dialogs/event-details-dialog";
import { DraggableEvent } from "../../dnd/draggable-event";
import { ResizableEvent } from "../../dnd/resizable-event";
import { formatTime } from "../../helpers";
import type { IEvent } from "../../interfaces";

const calendarWeekEventCardVariants = cva(
  "flex select-none flex-col gap-0.5 truncate whitespace-nowrap rounded-md border px-2 py-1.5 text-xs focus-visible:outline-offset-2",
  {
    variants: {
      color: {
        // Colored variants
        blue: "border-blue-200 bg-blue-100/50 text-blue-700 hover:bg-blue-100",
        green: "border-green-200 bg-green-100/50 text-green-700 hover:bg-green-100",
        red: "border-red-200 bg-red-100/50 text-red-700 hover:bg-red-100",
        yellow: "border-yellow-200 bg-yellow-100/50 text-yellow-700 hover:bg-yellow-100",
        purple: "border-purple-200 bg-purple-100/50 text-purple-700 hover:bg-purple-100",
        orange: "border-orange-200 bg-orange-100/50 text-orange-700 hover:bg-orange-100",

        // Dot variants
        "blue-dot": "border-mine-border bg-white text-mine-text hover:bg-mine-bg [&_svg]:fill-blue-600",
        "green-dot": "border-mine-border bg-white text-mine-text hover:bg-mine-bg [&_svg]:fill-green-600",
        "red-dot": "border-mine-border bg-white text-mine-text hover:bg-mine-bg [&_svg]:fill-red-600",
        "orange-dot": "border-mine-border bg-white text-mine-text hover:bg-mine-bg [&_svg]:fill-orange-600",
        "purple-dot": "border-mine-border bg-white text-mine-text hover:bg-mine-bg [&_svg]:fill-purple-600",
        "yellow-dot": "border-mine-border bg-white text-mine-text hover:bg-mine-bg [&_svg]:fill-yellow-600",
      },
    },
    defaultVariants: {
      color: "blue-dot",
    },
  },
);

interface IProps
  extends
    HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof calendarWeekEventCardVariants>, "color"> {
  event: IEvent;
}

export function EventBlock({ event, className }: IProps) {
  const { badgeVariant, use24HourFormat } = useCalendar();

  const start = parseISO(event.startDate);
  const end = parseISO(event.endDate);
  const durationInMinutes = differenceInMinutes(end, start);
  const heightInPixels = (durationInMinutes / 60) * 96 - 8;

  const color = (
    badgeVariant === "dot" ? `${event.color}-dot` : event.color
  ) as VariantProps<typeof calendarWeekEventCardVariants>["color"];

  const calendarWeekEventCardClasses = cn(
    calendarWeekEventCardVariants({ color, className }),
    durationInMinutes < 35 && "py-0 justify-center",
  );

  return (
    <ResizableEvent event={event}>
      <DraggableEvent event={event}>
        <EventDetailsDialog event={event}>
          <button
            type="button"
            className={calendarWeekEventCardClasses}
            style={{ height: `${heightInPixels}px` }}
          >
            <div className="flex items-center gap-1.5 truncate">
              {badgeVariant === "dot" && (
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                  aria-hidden="true"
                >
                  <circle cx="4" cy="4" r="4" />
                </svg>
              )}

              <p className="truncate font-semibold">{event.title}</p>
            </div>

            {durationInMinutes > 25 && (
              <p>
                {formatTime(start, use24HourFormat)} -{" "}
                {formatTime(end, use24HourFormat)}
              </p>
            )}
          </button>
        </EventDetailsDialog>
      </DraggableEvent>
    </ResizableEvent>
  );
}
