"use client";

import { useRef, useState } from "react";
import { fileToDataUrl, isAcceptedImage, uploadToCatalogBucket } from "@/lib/imageUpload";
import { isSupabaseConfigured } from "@/lib/supabase/config";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
  /** Storage folder this image belongs to (e.g. "products", "liquids"). Only matters when
   * Supabase Storage is configured — ignored for the local data-URL fallback. */
  folder?: string;
}

export default function ImageDropzone({ images, onChange, label = "Images", folder = "misc" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ingest = async (files: FileList | File[]) => {
    const list = Array.from(files).filter(isAcceptedImage);
    if (!list.length) return;
    setBusy(true);
    setError(null);
    try {
      const uploaded = isSupabaseConfigured()
        ? await Promise.all(list.map((f) => uploadToCatalogBucket(f, folder)))
        : await Promise.all(list.map((f) => fileToDataUrl(f)));
      onChange([...images, ...uploaded]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l'envoi de l'image.");
    } finally {
      setBusy(false);
    }
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = images.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  const removeAt = (i: number) => onChange(images.filter((_, idx) => idx !== i));

  return (
    <div>
      <label className="block text-[13px] font-semibold text-ink-secondary mb-1.5">{label}</label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) ingest(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center text-[13.5px] transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-border-strong text-ink-tertiary hover:border-primary/50"
        }`}
      >
        {busy ? "Traitement des images…" : "Glissez des images ici, ou cliquez pour parcourir"}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files?.length) ingest(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
      {error && <div className="mt-2 text-[12.5px] text-red-600">{error}</div>}

      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2.5">
          {images.map((src, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden border border-border-strong bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-20 object-cover" />
              {i === 0 && (
                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-primary text-white text-[9px] font-bold">
                  Principale
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/55 px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} className="text-white text-[11px] disabled:opacity-30 px-1">
                  ‹
                </button>
                <button type="button" onClick={() => removeAt(i)} className="text-white text-[11px] px-1 hover:text-red-300">
                  Suppr.
                </button>
                <button type="button" onClick={() => move(i, i + 1)} disabled={i === images.length - 1} className="text-white text-[11px] disabled:opacity-30 px-1">
                  ›
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
