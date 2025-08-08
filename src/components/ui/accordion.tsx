import * as React from "react";
import { cn } from "@/lib/utils";

export interface AccordionProps {
  type: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string;
  className?: string;
  children: React.ReactNode;
}

export function Accordion({
  type,
  collapsible = false,
  defaultValue,
  className,
  children,
}: AccordionProps) {
  const [open, setOpen] = React.useState<string | "" | string[]>(
    type === "multiple"
      ? defaultValue
        ? [defaultValue]
        : []
      : (defaultValue ?? ""),
  );

  const handleToggle = (idx: number) => {
    if (type === "multiple") {
      setOpen((prev) => {
        const prevArr = Array.isArray(prev) ? prev : [];
        if (prevArr.includes(String(idx))) {
          // remove if already open
          return collapsible
            ? prevArr.filter((v) => v !== String(idx))
            : prevArr;
        } else {
          // add
          return [...prevArr, String(idx)];
        }
      });
    } else {
      setOpen((prev) =>
        prev === String(idx) && collapsible ? "" : String(idx),
      );
    }
  };

  return (
    <div
      className={cn(
        "divide-y divide-gray-200 rounded-xl bg-white shadow-none",
        className,
      )}
    >
      {React.Children.map(children, (child: any, idx) =>
        React.cloneElement(child, {
          open:
            type === "multiple"
              ? Array.isArray(open) && open.includes(String(idx))
              : open === String(idx),
          onToggle: () => handleToggle(idx),
        } as any),
      )}
    </div>
  );
}

interface AccordionItemProps {
  value: string;
  open?: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
}
export function AccordionItem({
  value,
  open,
  onToggle,
  children,
}: AccordionItemProps) {
  return (
    <div>
      {React.Children.map(children, (child: any) => {
        if (
          React.isValidElement(child) &&
          (child.type as any).displayName === "AccordionTrigger"
        ) {
          return React.cloneElement(child, { open, onClick: onToggle } as any);
        }
        if (
          React.isValidElement(child) &&
          (child.type as any).displayName === "AccordionContent"
        ) {
          return open ? child : null;
        }
        return child;
      })}
    </div>
  );
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  onClick?: () => void;
  open?: boolean;
  className?: string;
}
export function AccordionTrigger({
  children,
  onClick,
  open,
  className,
}: AccordionTriggerProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full justify-between items-center py-4 font-semibold outline-none text-left transition-colors focus:bg-gray-50 bg-white",
        className,
      )}
      onClick={onClick}
      aria-expanded={open}
    >
      <span>{children}</span>
      <svg
        className={`ml-2 h-6 w-6 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path d="M9 10l3 3 3-3" stroke="currentColor" strokeWidth="2" />
      </svg>
    </button>
  );
}
AccordionTrigger.displayName = "AccordionTrigger";

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}
export function AccordionContent({
  children,
  className,
}: AccordionContentProps) {
  return <div className={cn("pb-4 pl-1 pr-2", className)}>{children}</div>;
}
AccordionContent.displayName = "AccordionContent";
