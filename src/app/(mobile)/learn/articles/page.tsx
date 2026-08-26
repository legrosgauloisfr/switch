"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRequireOnboarding } from "@/hooks/useGuard";
import { articleService } from "@/services";
import type { Article } from "@/types";
import BackButton from "@/components/ui/BackButton";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";

export default function ArticlesPage() {
  useRequireOnboarding();
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    let alive = true;
    articleService.list().then((a) => alive && setArticles(a));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col anim-scIn">
      <div className="flex-1 overflow-y-auto px-[22px] pt-[62px] pb-10">
        <BackButton />
        <h1 className="mt-[18px] px-1 text-[25px] font-bold">Articles</h1>
        <div className="mt-5 flex flex-col gap-2.5">
          {articles.map((a) => (
            <Link
              key={a.id}
              href={`/learn/articles/${a.id}`}
              className="flex gap-3.5 items-center p-3.5 rounded-[18px] bg-surface border border-border hover:border-primary/35 transition-colors"
            >
              <div className="flex-none w-14 h-14">
                <PhotoPlaceholder src={a.image} radius={12} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold tracking-wide text-primary">{a.category.toUpperCase()}</div>
                <div className="mt-1 text-[15px] font-bold leading-snug">{a.title}</div>
                <p className="mt-1 text-[12.5px] leading-snug text-ink-secondary line-clamp-2">{a.excerpt}</p>
              </div>
            </Link>
          ))}
          {articles.length === 0 && <div className="text-[13.5px] text-ink-tertiary">Aucun article pour l&apos;instant.</div>}
        </div>
      </div>
    </div>
  );
}
