import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

const statusVariants = cva("flex items-center", {
  variants: {
    status: {
      true: "text-success",
      false: "text-destructive",
      loading: "text-muted-foreground",
    },
  },
  defaultVariants: {
    status: false,
  },
});

export interface StatusIndicatorProps
  extends VariantProps<typeof statusVariants> {
  label?: string | null;
  loading?: boolean;
  className?: string;
}

export default function StatusIndicator({
  status,
  label,
  loading = false,
  className,
}: StatusIndicatorProps) {
  // Determine status indicator text
  const statusText = () => {
    if (loading) return "Checking...";
    if (label) return label;
    return status ? "Connected" : "Disconnected";
  };

  return (
    <div className={cn(statusVariants({ status: loading ? "loading" : status }), className)}>
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <span 
          className={cn(
            "h-2 w-2 rounded-full mr-2",
            status ? "bg-success" : "bg-destructive"
          )} 
        />
      )}
      <span className="text-sm">{statusText()}</span>
    </div>
  );
}
