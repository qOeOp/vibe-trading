"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  DayPicker as ReactDayPicker,
  getDefaultClassNames,
} from "react-day-picker";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DayPickerProps = React.ComponentProps<typeof ReactDayPicker>;

function DayPicker({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: DayPickerProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <ReactDayPicker
      data-slot="day-picker"
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months,
        ),
        month: cn("flex flex-col gap-4", defaultClassNames.month),

        month_caption: cn(
          "relative flex h-7 items-center justify-center",
          defaultClassNames.month_caption,
        ),
        caption_label: cn(
          "text-sm font-medium",
          defaultClassNames.caption_label,
        ),

        nav: cn(
          "absolute inset-x-0 top-0 flex w-full justify-between z-10",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          defaultClassNames.button_next,
        ),

        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-mine-muted w-9 font-normal text-[0.8rem]",
          defaultClassNames.weekday,
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),

        day: cn(
          "h-9 w-9 text-center text-sm p-0 relative",
          "[&:has([aria-selected].day-range-end)]:rounded-r-md",
          "[&:has([aria-selected].day-outside)]:bg-mine-bg/50",
          "[&:has([aria-selected])]:bg-mine-bg",
          "first:[&:has([aria-selected])]:rounded-l-md",
          "last:[&:has([aria-selected])]:rounded-r-md",
          "focus-within:relative focus-within:z-20",
          defaultClassNames.day,
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md",
          defaultClassNames.day_button,
        ),

        range_end: "day-range-end",
        selected:
          "bg-mine-nav-active text-white hover:bg-mine-nav-active hover:text-white focus:bg-mine-nav-active focus:text-white rounded-md",
        today: "text-red-600 font-bold",
        outside:
          "day-outside text-mine-muted opacity-50 aria-selected:bg-mine-bg/50 aria-selected:text-mine-muted aria-selected:opacity-30",
        disabled: "text-mine-muted opacity-50",
        range_middle:
          "aria-selected:bg-mine-bg aria-selected:text-mine-text",
        hidden: "invisible",

        chevron: cn("fill-mine-muted", defaultClassNames.chevron),

        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return <ChevronLeft className="h-4 w-4" />;
          }
          return <ChevronRight className="h-4 w-4" />;
        },
      }}
      {...props}
    />
  );
}
DayPicker.displayName = "DayPicker";

export { DayPicker };
export type { DayPickerProps };
