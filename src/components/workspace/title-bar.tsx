"use client";

import { Menu, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectIsSidebarOpen, sidebarToggled } from "@/store/workspace-slice";
import { profile } from "@/data/profile";

const trafficLights = [
  { id: "close", className: "bg-[#ff5f57]" },
  { id: "minimize", className: "bg-[#febc2e]" },
  { id: "maximize", className: "bg-[#28c840]" },
] as const;

/** The window chrome, plus the explorer toggle on small screens. */
export function TitleBar() {
  const dispatch = useAppDispatch();
  const isSidebarOpen = useAppSelector(selectIsSidebarOpen);

  return (
    <header className="border-line bg-surface-raised flex shrink-0 items-center gap-3 border-b px-3 py-2.5">
      <button
        type="button"
        onClick={() => dispatch(sidebarToggled())}
        aria-expanded={isSidebarOpen}
        aria-controls="file-explorer"
        aria-label={isSidebarOpen ? "Close file explorer" : "Open file explorer"}
        className="text-ink-muted hover:text-ink rounded p-1 transition-colors md:hidden"
      >
        {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      <div aria-hidden="true" className="hidden gap-2 md:flex">
        {trafficLights.map((light) => (
          <span key={light.id} className={`size-2.5 rounded-full ${light.className}`} />
        ))}
      </div>

      <p className="text-ink-muted flex-1 truncate text-center text-xs">
        {profile.name.toLowerCase().replace(" ", "-")} — portfolio.code-workspace
      </p>

      <div aria-hidden="true" className="hidden w-16 md:block" />
    </header>
  );
}
