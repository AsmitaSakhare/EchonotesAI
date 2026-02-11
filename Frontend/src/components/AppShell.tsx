"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex-1">
      <div className="mx-auto w-full max-w-6xl px-6 py-6">
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: open ? "256px 1fr" : "64px 1fr" }}
        >
          <Sidebar open={open} onToggle={() => setOpen((v) => !v)} />
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
