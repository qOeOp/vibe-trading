import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { transition } from "../../animations";
import type { TEventColor } from "../../types";

const eventBulletVariants = cva("size-2 rounded-full", {
  variants: {
    color: {
      blue: "bg-blue-600",
      green: "bg-green-600",
      red: "bg-red-600",
      yellow: "bg-yellow-600",
      purple: "bg-purple-600",
      orange: "bg-orange-600",
      gray: "bg-gray-600",
    },
  },
  defaultVariants: {
    color: "blue",
  },
});

export function EventBullet({
  color,
  className,
}: {
  color: TEventColor;
  className?: string;
}) {
  return (
    <motion.div
      className={cn(eventBulletVariants({ color, className }))}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.2 }}
      transition={transition}
    />
  );
}
