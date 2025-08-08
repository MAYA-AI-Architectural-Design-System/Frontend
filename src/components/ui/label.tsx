import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        className={cn(
          "block text-sm font-medium leading-6 text-gray-900",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Label.displayName = "Label";
