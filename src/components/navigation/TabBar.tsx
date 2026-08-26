"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  {
    href: "/home",
    label: "Accueil",
    icon: (
      <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z" />
    ),
  },
  {
    href: "/recommendations",
    label: "Recommandations",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="m8.5 12.2 2.4 2.4 4.6-5" />
      </>
    ),
  },
  {
    href: "/learn",
    label: "Apprendre",
    icon: (
      <>
        <path d="M4 5.5h6a2 2 0 0 1 2 2V20" />
        <path d="M20 5.5h-6a2 2 0 0 0-2 2V20" />
        <path d="M4 5.5V20h16V5.5" />
      </>
    ),
  },
  {
    href: "/account",
    label: "Compte",
    icon: (
      <>
        <circle cx="12" cy="8.5" r="3.5" />
        <path d="M5.5 20c.6-3.5 3.3-5.5 6.5-5.5s5.9 2 6.5 5.5" />
      </>
    ),
  },
];

export default function TabBar() {
  const pathname = usePathname();
  const isTabRoute = TABS.some((t) => t.href === pathname);
  if (!isTabRoute) return null;

  return (
    <div className="absolute left-0 right-0 bottom-0 h-[86px] pt-2 px-3.5 box-border bg-bg/92 backdrop-blur-md border-t border-border flex z-30">
      {TABS.map((t) => {
        const active = pathname === t.href;
        const color = active ? "var(--primary)" : "var(--ink-quaternary)";
        return (
          <Link
            key={t.href}
            href={t.href}
            className="flex-1 flex flex-col items-center gap-1.5 pt-2"
          >
            <span className="h-[22px] flex items-center justify-center" style={{ color }}>
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {t.icon}
              </svg>
            </span>
            <span className="text-[10.5px] font-bold tracking-tight" style={{ color }}>
              {t.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
