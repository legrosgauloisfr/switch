"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRequireOnboarding } from "@/hooks/useGuard";
import { articleService } from "@/services";
import type { Article } from "@/types";
import BackButton from "@/components/ui/BackButton";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";

export default function ArticleDetailPage() {
  useRequireOnboarding();
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    articleService.get(id).then((a) => alive && setArticle(a ?? null));
    return () => {
      alive = false;
    };
  }, [id]);

  if (article === undefined) return null;
  if (article === null) {
    return <div className="flex-1 flex items-center justify-center text-ink-tertiary">Article introuvable.</div>;
  }

  const paragraphs = article.body.split(/\n{2,}/).filter(Boolean);

  return (
    <div className="absolute inset-0 flex flex-col anim-scIn">
      <div className="flex-1 overflow-y-auto pb-10">
        {article.image ? (
          <div className="relative h-[200px]">
            <PhotoPlaceholder src={article.image} radius={0} />
            <BackButton className="absolute top-[62px] left-[22px] !bg-white/92" />
          </div>
        ) : (
          <div className="pt-[62px] px-[22px]">
            <BackButton />
          </div>
        )}
        <div className="px-[26px] pt-[22px]">
          <div className="text-[11px] font-bold tracking-[0.14em] text-ink-tertiary">{article.category.toUpperCase()}</div>
          <h1 className="mt-3 text-[25px] font-bold leading-tight text-pretty">{article.title}</h1>
          <div className="mt-5 flex flex-col gap-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-[15px] leading-relaxed text-[#43494F] text-pretty">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
