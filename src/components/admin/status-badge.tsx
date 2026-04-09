import { cn } from "../../lib/utils/format";
import {
  ORDER_STATUS_CONFIG,
  REFUND_STATUS_CONFIG,
} from "../../lib/constants";

interface StatusBadgeProps {
  status: string;
  type?: "order" | "refund" | "custom";
  className?: string;
}

export function StatusBadge({ status, type = "order", className }: StatusBadgeProps) {
  let config;

  if (type === "order") {
    config = ORDER_STATUS_CONFIG[status];
  } else if (type === "refund") {
    config = REFUND_STATUS_CONFIG[status];
  }

  if (!config) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          "bg-slate-100 text-slate-800",
          className
        )}
      >
        {status}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
