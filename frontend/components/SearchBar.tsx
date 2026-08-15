"use client";

import { useState } from "react";

const LIMIT_OPTIONS = [5, 10, 15, 20];

export function SearchBar({
  initialQuery,
  initialLimit,
  disabled,
  onSearch,
}: {
  initialQuery: string;
  initialLimit: number;
  disabled: boolean;
  onSearch: (query: string, limit: number) => void;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [limit, setLimit] = useState(initialLimit);

  function handleSubmit(e:any) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch(trimmed, limit);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label htmlFor="q" className="block text-sm font-medium text-gray-700">
          Title, author, or subject
        </label>
        <input
          id="q"
          name="q"
          type="text"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a book"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="limit" className="block text-sm font-medium text-gray-700">
          Results per source
        </label>
        <select
          id="limit"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:w-28"
        >
          {LIMIT_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={disabled || !query.trim()}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {disabled ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
