"use client";

import { useRouter } from "next/navigation";
import { useRequireOnboarding } from "@/hooks/useGuard";
import { useUserStore, type SettingsToggles } from "@/store/useAppStore";
import BackButton from "@/components/ui/BackButton";
import Toggle from "@/components/ui/Toggle";

const TOGGLE_META: { key: keyof SettingsToggles; label: string; sub: string }[] = [
  { key: "rappels", label: "Rappels de progression", sub: "Un point sur votre parcours, une fois par semaine." },
  { key: "conseils", label: "Conseil du jour", sub: "Une notification le matin." },
  { key: "motion", label: "Réduire les animations", sub: "Transitions simplifiées dans le questionnaire." },
  { key: "stats", label: "Personnaliser ma sélection", sub: "Utiliser mes réponses pour affiner les recommandations." },
];

const LINKS = ["Transparence commerciale", "Informations réglementaires", "Nous contacter"];

export default function SettingsPage() {
  useRequireOnboarding();
  const router = useRouter();
  const toggles = useUserStore((s) => s.toggles);
  const toggleSetting = useUserStore((s) => s.toggleSetting);
  const deleteAccount = useUserStore((s) => s.deleteAccount);
  const userName = useUserStore((s) => s.userName);
  const answers = useUserStore((s) => s.answers);
  const journal = useUserStore((s) => s.journal);

  const exportData = () => {
    const payload = { userName, answers, journal, toggles, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "switch-mes-donnees.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="absolute inset-0 flex flex-col anim-scIn">
      <div className="flex-1 overflow-y-auto px-[22px] pt-[62px] pb-10">
        <BackButton />
        <h1 className="mt-[18px] px-1 text-[25px] font-bold">Paramètres</h1>

        <div className="mt-5 border border-border rounded-[18px] bg-surface overflow-hidden divide-y divide-border">
          {TOGGLE_META.map((t) => (
            <div
              key={t.key}
              onClick={() => toggleSetting(t.key)}
              className="w-full flex items-center gap-3.5 text-left px-[18px] py-4 cursor-pointer"
            >
              <div className="flex-1">
                <div className="text-[15px] font-semibold">{t.label}</div>
                <div className="mt-0.5 text-[12.5px] leading-snug text-ink-tertiary">{t.sub}</div>
              </div>
              <Toggle checked={toggles[t.key]} onChange={() => toggleSetting(t.key)} />
            </div>
          ))}
        </div>

        <div className="mt-[18px] border border-border rounded-[18px] bg-surface overflow-hidden divide-y divide-border">
          <button
            onClick={exportData}
            className="w-full flex items-center gap-3.5 px-[18px] py-4 text-[14.5px] font-semibold text-left"
          >
            <div className="flex-1">
              <div>Exporter mes données</div>
              <div className="mt-0.5 text-[12.5px] font-normal text-ink-tertiary">
                Télécharge un fichier JSON de vos réponses et de votre journal.
              </div>
            </div>
            <span className="text-ink-quaternary text-[17px]">›</span>
          </button>
          {LINKS.map((l) => (
            <div key={l} className="flex items-center gap-3.5 px-[18px] py-4 text-[14.5px] font-semibold">
              <div className="flex-1">{l}</div>
              <span className="text-ink-quaternary text-[17px]">›</span>
            </div>
          ))}
        </div>

        <div className="mt-[18px] border border-red-200 rounded-[18px] bg-white overflow-hidden">
          <button
            onClick={() => {
              if (confirm("Supprimer votre compte ? Toutes vos données locales (réponses, journal) seront effacées.")) {
                deleteAccount();
                router.push("/");
              }
            }}
            className="w-full text-left px-[18px] py-4 text-[14.5px] font-semibold text-red-600"
          >
            Supprimer mon compte
          </button>
        </div>
        <p className="mt-2.5 text-[12px] leading-relaxed text-ink-faint text-pretty">
          Aucun compte serveur n&apos;existe encore : vos données vivent uniquement sur cet
          appareil. Cette action les efface définitivement de ce navigateur.
        </p>

        <div className="mt-[18px] text-[12px] leading-relaxed text-ink-faint">
          Switch v1.0 · Application réservée aux personnes majeures.
        </div>
      </div>
    </div>
  );
}
