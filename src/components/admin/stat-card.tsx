import { cn } from "../../lib/utils/format";
import { formatCurrency, formatNumber, formatPercentage } from "../../lib/utils/format";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
  format?: "number" | "currency" | "percentage";
  change?: number;
  changeLabel?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  color = "bg-blue-50 text-blue-500",
  format = "number",
  change,
  changeLabel,
  className,
}: StatCardProps) {
  const formattedValue = () => {
    switch (format) {
      case "currency":
        return formatCurrency(value);
      case "percentage":
        return formatPercentage(Number(value));
      default:
        return formatNumber(Number(value));
    }
  };

  const getTrendIcon = () => {
    if (change === undefined || change === 0) {
      return <Minus className="h-4 w-4" />;
    }
    return change > 0 ? (
      <TrendingUp className="h-4 w-4" />
    ) : (
      <TrendingDown className="h-4 w-4" />
    );
  };

  const getTrendColor = () => {
    if (change === undefined || change === 0) {
      return "text-slate-500";
    }
    return change > 0 ? "text-green-500" : "text-red-500";
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-6 shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {formattedValue()}
          </p>
          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              <span className={cn("flex items-center gap-0.5 text-sm font-medium", getTrendColor())}>
                {getTrendIcon()}
                {change > 0 ? "+" : ""}
                {change}%
              </span>
              {changeLabel && (
                <span className="text-sm text-slate-500">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-lg", color)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
