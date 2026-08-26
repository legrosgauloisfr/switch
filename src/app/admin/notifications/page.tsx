"use client";

import { useState } from "react";
import { useCatalogStore } from "@/store/useCatalogStore";
import { contentService } from "@/services";
import { genId } from "@/store/useCatalogStore";
import { Card, PageHeader, PrimaryButton, SecondaryButton, StatusPill, TextArea, TextInput } from "@/components/admin/AdminUi";
import Toggle from "@/components/ui/Toggle";
import type { NotificationItem } from "@/types";

export default function AdminNotificationsPage() {
  const notifications = [...useCatalogStore((s) => s.notifications)].sort((a, b) => b.createdAt - a.createdAt);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const add = async () => {
    if (!title.trim() || !text.trim()) return;
    const n: NotificationItem = {
      id: genId("notif"),
      title: title.trim(),
      text: text.trim(),
      when: "À l'instant",
      unread: true,
      published: true,
      createdAt: Date.now(),
    };
    await contentService.saveNotification(n);
    setTitle("");
    setText("");
  };

  return (
    <div>
      <PageHeader title="Notifications" subtitle="Affichées dans Compte → Notifications." />
      <Card className="flex flex-col gap-2.5 mb-4">
        <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre" />
        <TextArea value={text} onChange={(e) => setText(e.target.value)} placeholder="Texte" />
        <PrimaryButton onClick={add} disabled={!title.trim() || !text.trim()} className="self-start">
          Ajouter
        </PrimaryButton>
      </Card>
      <div className="flex flex-col gap-2.5">
        {notifications.map((n) => (
          <Card key={n.id}>
            <div className="flex items-start gap-3">
              <div className="flex-1 flex flex-col gap-2">
                <TextInput
                  defaultValue={n.title}
                  onBlur={(e) => e.target.value.trim() && contentService.saveNotification({ ...n, title: e.target.value.trim() })}
                  className="font-semibold"
                />
                <TextArea
                  defaultValue={n.text}
                  onBlur={(e) => e.target.value.trim() && contentService.saveNotification({ ...n, text: e.target.value.trim() })}
                />
                <div className="text-[11.5px] text-ink-quaternary">{n.when}</div>
              </div>
              <div className="flex-none flex flex-col items-end gap-2">
                <StatusPill active={n.published} />
                <Toggle checked={n.published} onChange={() => contentService.saveNotification({ ...n, published: !n.published })} />
                <SecondaryButton
                  onClick={() => confirm("Supprimer cette notification ?") && contentService.removeNotification(n.id)}
                  className="!border-red-200 !text-red-600"
                >
                  Supprimer
                </SecondaryButton>
              </div>
            </div>
          </Card>
        ))}
        {notifications.length === 0 && <Card className="text-center text-ink-tertiary text-[14px]">Aucune notification.</Card>}
      </div>
    </div>
  );
}
