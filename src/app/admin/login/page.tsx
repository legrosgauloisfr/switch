"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PrimaryButton, SecondaryButton, TextInput } from "@/components/admin/AdminUi";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    errorParam === "not_admin"
      ? "Ce compte n'a pas les droits d'administration."
      : errorParam === "auth_callback_failed"
      ? "La connexion a échoué. Réessayez."
      : null
  );
  const [notice, setNotice] = useState<string | null>(null);

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#F4F5F7] px-6">
        <div className="max-w-md bg-white rounded-2xl border border-border p-6 text-center">
          <div className="text-[17px] font-bold">Supabase non configuré</div>
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-secondary">
            Aucun projet Supabase n&apos;est branché — renseignez <code>NEXT_PUBLIC_SUPABASE_URL</code> et{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> dans <code>.env.local</code>. En attendant, le
            back-office reste ouvert sans authentification.
          </p>
        </div>
      </div>
    );
  }

  const supabase = createClient();

  const withOAuth = async (provider: "google") => {
    if (!supabase) return;
    setError(null);
    setLoading(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/admin` },
    });
    if (error) {
      setError(error.message);
      setLoading(null);
    }
  };

  const submitEmail = async () => {
    if (!supabase) return;
    setError(null);
    setNotice(null);
    setLoading("email");
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(null);
      if (error) {
        setError(error.message);
        return;
      }
      router.push("/admin");
      router.refresh();
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin` },
      });
      setLoading(null);
      if (error) {
        setError(error.message);
        return;
      }
      setNotice(
        "Compte créé. Vérifiez votre boîte mail pour confirmer l'adresse, puis un administrateur devra vous accorder les droits."
      );
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-[#F4F5F7] px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-border p-6">
        <div className="flex items-center gap-2.5">
          <Image src="/images/switch-logo.png" alt="" width={26} height={26} className="object-contain" />
          <div className="font-extrabold tracking-wide text-[15px]">SWITCH — ADMIN</div>
        </div>
        <h1 className="mt-4 text-[19px] font-bold">
          {mode === "signin" ? "Connexion" : "Créer un compte"}
        </h1>

        {error && (
          <div className="mt-3.5 px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-[12.5px] text-red-700">
            {error}
          </div>
        )}
        {notice && (
          <div className="mt-3.5 px-3.5 py-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[12.5px] text-emerald-800">
            {notice}
          </div>
        )}

        <div className="mt-4 flex flex-col gap-2.5">
          <SecondaryButton type="button" onClick={() => withOAuth("google")} disabled={!!loading} className="w-full">
            {loading === "google" ? "…" : "Continuer avec Google"}
          </SecondaryButton>
        </div>

        <div className="my-4 flex items-center gap-3 text-[11.5px] text-ink-quaternary">
          <div className="flex-1 h-px bg-border" />
          ou
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="flex flex-col gap-2.5">
          <TextInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextInput
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitEmail()}
          />
          <PrimaryButton type="button" onClick={submitEmail} disabled={!!loading || !email || !password} className="w-full">
            {loading === "email" ? "…" : mode === "signin" ? "Se connecter" : "Créer le compte"}
          </PrimaryButton>
        </div>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setNotice(null);
          }}
          className="mt-4 w-full text-center text-[12.5px] font-semibold text-primary"
        >
          {mode === "signin" ? "Pas de compte ? Créez-en un" : "Déjà un compte ? Connectez-vous"}
        </button>
      </div>
    </div>
  );
}
