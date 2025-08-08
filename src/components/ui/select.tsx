import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  selected: string | undefined;
  setSelected: (val: string) => void;
}

const SelectContext = React.createContext<SelectContextType | null>(null);

export function Select({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string | undefined>(undefined);

  // Close dropdown on outside click
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handle);
    }
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <SelectContext.Provider value={{ open, setOpen, selected, setSelected }}>
      <div ref={ref} className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("SelectTrigger must be used within a Select");
  return (
    <button
      id={id}
      className={cn(
        "flex h-11 w-full items-center justify-between rounded-md border px-3 py-2 text-base font-normal outline-none focus:border-black focus:ring-1 focus:ring-black transition-shadow",
        className
      )}
      type="button"
      onClick={() => ctx.setOpen(!ctx.open)}
      aria-haspopup="listbox"
      aria-expanded={ctx.open}
    >
      {children}
      <svg
        className="h-4 w-4 ml-2 text-gray-400"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M7 8l3 3 3-3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

export function SelectContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("SelectContent must be used within a Select");
  if (!ctx.open) return null;
  return (
    <div
      className={cn(
        "absolute top-full left-0 z-10 mt-2 w-full rounded-md border shadow-lg py-2",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SelectItem({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("SelectItem must be used within a Select");
  return (
    <div
      className={cn(
        "px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white transition-all",
        ctx.selected === value && "bg-gray-100 dark:bg-white/10"
      )}
      tabIndex={0}
      data-value={value}
      role="option"
      onClick={() => {
        ctx.setSelected(value);
        ctx.setOpen(false);
      }}
    >
      {children}
    </div>
  );
}

export function SelectValue({ placeholder }: { placeholder: string }) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("SelectValue must be used within a Select");
  return (
    <span
      className={cn(
        ctx.selected
          ? "text-gray-900 dark:text-white"
          : "text-gray-400 dark:text-white/60"
      )}
    >
      {ctx.selected ?? placeholder}
    </span>
  );
}
