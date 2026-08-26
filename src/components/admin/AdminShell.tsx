"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const NAV = [
  { href: "/admin", label: "Tableau de bord", exact: true },
  { href: "/admin/products", label: "Appareils" },
  { href: "/admin/liquids", label: "E-liquides" },
  { href: "/admin/accessories", label: "Accessoires" },
  { href: "/admin/tutorials", label: "Tutoriels" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/advice", label: "Conseils" },
  { href: "/admin/notifications", label: "Notifications" },
  { href: "/admin/brands", label: "Marques" },
  { href: "/admin/categories", label: "Catégories" },
  { href: "/admin/flavors", label: "Saveurs" },
];

function AdminUserBadge() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, [supabase]);

  if (!supabase || !email) return null;

  return (
    <div className="hidden md:flex items-center justify-between px-4 py-3 border-t border-border">
      <span className="text-[12px] text-ink-tertiary truncate">{email}</span>
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/admin/login");
          router.refresh();
        }}
        className="text-[12px] font-semibold text-primary hover:text-primary-hover"
      >
        Déconnexion
      </button>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-dvh bg-[#F4F5F7] text-ink flex flex-col md:flex-row">
      <aside className="md:w-60 md:flex-none md:flex md:flex-col border-b md:border-b-0 md:border-r border-border bg-white">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <Image src="/images/switch-logo.png" alt="" width={26} height={26} className="object-contain" />
          <div className="font-extrabold tracking-wide text-[15px]">SWITCH — ADMIN</div>
        </div>
        <nav className="flex md:flex-col gap-1 px-2.5 pb-3 overflow-x-auto md:overflow-visible md:flex-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-none md:flex-auto px-3.5 py-2.5 rounded-lg text-[14px] font-semibold whitespace-nowrap transition-colors ${
                isActive(item.href, item.exact)
                  ? "bg-primary-tint text-primary-hover"
                  : "text-ink-secondary hover:bg-black/[0.04]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <AdminUserBadge />
        <div className="hidden md:block px-4 py-3">
          <Link href="/" className="text-[13px] font-semibold text-ink-tertiary hover:text-primary">
            ‹ Voir l&apos;application
          </Link>
        </div>
      </aside>
      <main className="flex-1 min-w-0 px-5 py-6 md:px-8 md:py-8">
        {!isSupabaseConfigured() && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-[13px] text-amber-900">
            Aucune authentification n&apos;est branchée — ce back-office est actuellement{" "}
            <strong>accessible sans connexion</strong>. Configurez Supabase (voir{" "}
            <code>.env.example</code>) pour le protéger.
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
