"use client";

import { useState } from "react";

export interface CatalogEntry {
  id: string;
  title: string;
  authors: string[];
  year: string | null;
  coverUrl: string | null;
  sourceUrl: string | null;
  note: string | null;
  source: "Open Library" | "Google Books";
}

export function CatalogCard({
  entry,
  badgeClass,
}: {
  entry: CatalogEntry;
  badgeClass: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showCover = entry.coverUrl && !imageFailed;

  const content = (
    <div className="flex gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      <div className="h-24 w-16 flex-none overflow-hidden rounded bg-gray-100">
        {showCover ? (
          <img
            src={entry.coverUrl as string}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-1 text-center text-[10px] text-gray-400">
            No cover
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
          {entry.title}
        </h3>
        {entry.authors.length > 0 && (
          <p className="mt-0.5 line-clamp-1 text-sm text-gray-500">
            {entry.authors.join(", ")}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-400">
          {[entry.year, entry.note].filter(Boolean).join(" · ")}
        </p>
        <span
          className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${badgeClass}`}
        >
          {entry.source}
        </span>
      </div>
    </div>
  );

  if (!entry.sourceUrl) return content;

  return (
    <a
      href={entry.sourceUrl}
      target="_blank"
      rel="noreferrer"
      className="block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {content}
    </a>
  );
}

export function CatalogCardSkeleton() {
  return (
    <div className="flex animate-pulse gap-3 rounded-lg border border-gray-200 bg-white p-3">
      <div className="h-24 w-16 flex-none rounded bg-gray-200" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3 w-5/6 rounded bg-gray-200" />
        <div className="h-3 w-3/6 rounded bg-gray-200" />
        <div className="h-2 w-2/6 rounded bg-gray-200" />
      </div>
    </div>
  );
}
