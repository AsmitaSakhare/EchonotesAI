"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mic, Home, NotebookTabs, Settings, Info, ChevronLeft, ChevronRight, Search } from "lucide-react";
import clsx from "clsx";

type Item = { title: string; href: string; icon: React.ElementType };
const items: Item[] = [
  { title: "Home", href: "/", icon: Home },
  { title: "Meeting Notes", href: "/notes", icon: NotebookTabs },
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "About", href: "/about", icon: Info },
];

export default function Sidebar({
  open,
  onToggle,
  className,
}: {
  open: boolean;
  onToggle: () => void;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <div
      className={clsx(
        "relative h-full rounded-xl border border-neutral-800 bg-neutral-900/50 transition-[width] duration-200",
        open ? "w-64" : "w-16",
        className
      )}
    >
      {/* Toggle chevron */}
      <button
        aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        onClick={onToggle}
        className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/90 shadow"
      >
        {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      {/* Brand */}
      <div className={clsx("flex items-center", open ? "px-4 pt-4 pb-3" : "justify-center pt-4 pb-3")}>
        <div className={clsx("font-semibold tracking-wide", open ? "text-base" : "text-xs")}>EchoNotes</div>
      </div>

      {/* Optional search when open */}
      {open && (
        <div className="px-3 pb-3">
          <div className="flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-300">
            <Search className="h-4 w-4" />
            <input
              placeholder="Search meeting content…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500"
            />
          </div>
        </div>
      )}

      <div className="h-px bg-neutral-800 mx-3" />

      {/* Nav */}
      <nav className="mt-2 space-y-1 px-2">
        {items.map(({ title, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "group flex items-center gap-3 rounded-md px-3 py-2 transition",
                active
                  ? "bg-neutral-800 text-neutral-100"
                  : "text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100"
              )}
              title={!open ? title : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className={clsx("truncate", open ? "block" : "hidden")}>{title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="h-px bg-neutral-800 mx-3 mb-3" />
        <div className={clsx("px-3 pb-3", open ? "" : "flex justify-center")}>
          {open ? (
            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-white shadow hover:bg-red-500"
              onClick={() =>
                document
                  .getElementById("echonotes-record-btn")
                  ?.dispatchEvent(new Event("click", { bubbles: true }))
              }
            >
              <Mic className="h-4 w-4" />
              <span>Start Recording</span>
            </button>
          ) : (
            <button
              className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow hover:bg-red-500"
              onClick={() =>
                document
                  .getElementById("echonotes-record-btn")
                  ?.dispatchEvent(new Event("click", { bubbles: true }))
              }
              title="Start Recording"
            >
              <Mic className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
