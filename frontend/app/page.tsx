"use client";

import { useCallback, useRef, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { ResultsColumn } from "@/components/ResultsColumn";
import { Pagination } from "@/components/Pagination";
import type { CatalogEntry } from "@/components/CatalogCard";

type Status = "idle" | "loading" | "error" | "success";

interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  edition_count?: number;
}

interface GoogleBooksItem {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publishedDate?: string;
    imageLinks?: { thumbnail?: string };
    infoLink?: string;
    pageCount?: number;
  };
}

interface BooksApiResponse {
  openLibraryData: { numFound: number; docs: OpenLibraryDoc[] } | null;
  googleBooksData: { totalItems: number; items?: GoogleBooksItem[] } | null;
}

async function searchBooks(q: string, page: number, limit: number): Promise<BooksApiResponse> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
  const url = new URL("/books", base);
  url.searchParams.set("q", q);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      "The catalog service returned an error. One of the two sources may be temporarily unavailable — try again in a moment.",
    );
  }
  return res.json();
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<BooksApiResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const requestId = useRef(0);

  const runSearch = useCallback((q: string, p: number, l: number) => {
    if (!q) return;
    const id = ++requestId.current;
    setStatus("loading");
    searchBooks(q, p, l)
      .then((result) => {
        if (id !== requestId.current) return;
        setData(result);
        setStatus("success");
      })
      .catch((err) => {
        if (id !== requestId.current) return;
        setErrorMessage(
          err instanceof Error ? err.message : "Something went wrong reaching the catalog service.",
        );
        setStatus("error");
      });
  }, []);

  function handleSearch(q: string, l: number) {
    setQuery(q);
    setLimit(l);
    setPage(1);
    runSearch(q, 1, l);
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    runSearch(query, nextPage, limit);
  }

  function handleRetry() {
    if (query) runSearch(query, page, limit);
  }

  const openLibraryEntries: CatalogEntry[] =
    data?.openLibraryData?.docs?.map((doc) => ({
      id: doc.key,
      title: doc.title,
      authors: doc.author_name ?? [],
      year: doc.first_publish_year ? String(doc.first_publish_year) : null,
      coverUrl: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : null,
      sourceUrl: `https://openlibrary.org${doc.key}`,
      note: doc.edition_count
        ? `${doc.edition_count} edition${doc.edition_count === 1 ? "" : "s"}`
        : null,
      source: "Open Library",
    })) ?? [];

  const googleEntries: CatalogEntry[] =
    data?.googleBooksData?.items?.map((item) => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors ?? [],
      year: item.volumeInfo.publishedDate
        ? item.volumeInfo.publishedDate.slice(0, 4)
        : null,
      coverUrl:
        item.volumeInfo.imageLinks?.thumbnail?.replace("http://", "https://") ??
        null,
      sourceUrl: item.volumeInfo.infoLink ?? null,
      note: item.volumeInfo.pageCount ? `${item.volumeInfo.pageCount} pages` : null,
      source: "Google Books",
    })) ?? [];
  const hasMore =
    openLibraryEntries.length >= limit || googleEntries.length >= limit;
  const isLoading = status === "loading";

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Book Search</h1>
        <p className="mt-1 text-sm text-gray-500">
          Searches Open Library and Google Books at the same time.
        </p>
      </header>

      <SearchBar
        initialQuery={query}
        initialLimit={limit}
        disabled={isLoading}
        onSearch={handleSearch}
      />

      {status === "idle" && (
        <p className="rounded-lg border border-gray-200 bg-white px-6 py-14 text-center text-sm text-gray-500">
          Enter a title, author, or subject to search.
        </p>
      )}

      {status === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-8 text-center">
          <p className="text-sm text-red-700">{errorMessage}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      )}

      {(status === "success" || status === "loading") && query && (
        <>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <ResultsColumn
              label="Open Library"
              countLabel={
                data?.openLibraryData
                  ? `${data.openLibraryData.numFound.toLocaleString()} results`
                  : null
              }
              badgeClass="bg-emerald-100 text-emerald-700"
              entries={openLibraryEntries}
              loading={isLoading}
              unavailable={status === "success" && !data?.openLibraryData}
              skeletonCount={Math.min(limit, 6)}
            />
            <ResultsColumn
              label="Google Books"
              countLabel={
                data?.googleBooksData
                  ? `${data.googleBooksData.totalItems.toLocaleString()} results`
                  : null
              }
              badgeClass="bg-amber-100 text-amber-700"
              entries={googleEntries}
              loading={isLoading}
              unavailable={status === "success" && !data?.googleBooksData}
              skeletonCount={Math.min(limit, 6)}
            />
          </div>

          <Pagination
            page={page}
            hasMore={hasMore}
            disabled={isLoading}
            onChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
