"use client";

import { useEffect, useState } from "react";
import { useRequireOnboarding } from "@/hooks/useGuard";
import { useUserStore } from "@/store/useAppStore";
import { contentService } from "@/services";
import type { NotificationItem } from "@/types";
import BackButton from "@/components/ui/BackButton";

export default function NotificationsPage() {
  useRequireOnboarding();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const markNotificationsRead = useUserStore((s) => s.markNotificationsRead);

  useEffect(() => {
    let alive = true;
    contentService.notifications().then((n) => alive && setItems(n));
    markNotificationsRead();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col anim-scIn">
      <div className="flex-1 overflow-y-auto px-[22px] pt-[62px] pb-10">
        <BackButton />
        <h1 className="mt-[18px] px-1 text-[25px] font-bold">Notifications</h1>
        <div className="mt-5 flex flex-col gap-2">
          {items.map((n) => (
            <div
              key={n.id}
              className={`flex gap-3.5 p-4 rounded-[18px] border border-border ${n.unread ? "bg-surface" : "bg-[#FAFAF8]"}`}
            >
              <span
                className="flex-none w-2 h-2 rounded-full mt-1.5"
                style={{ background: n.unread ? "var(--primary)" : "#D2D8DE" }}
              />
              <div className="flex-1">
                <div className="text-[14.5px] font-bold">{n.title}</div>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink-secondary text-pretty">{n.text}</p>
                <div className="mt-1.5 text-[11.5px] text-ink-quaternary">{n.when}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
