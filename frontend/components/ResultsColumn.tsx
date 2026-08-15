import { CatalogCard, CatalogCardSkeleton, type CatalogEntry } from "./CatalogCard";

export function ResultsColumn({
  label,
  countLabel,
  badgeClass,
  entries,
  loading,
  unavailable,
  skeletonCount,
}: {
  label: string;
  countLabel: string | null;
  badgeClass: string;
  entries: CatalogEntry[];
  loading: boolean;
  unavailable: boolean;
  skeletonCount: number;
}) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-gray-900">{label}</h2>
        {countLabel && <span className="text-sm text-gray-500">{countLabel}</span>}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: skeletonCount }).map((item, index) => (
            <CatalogCardSkeleton key={index} />
          ))}
        </div>
      ) : unavailable ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-6 text-center text-sm text-amber-700">
          This source didn&apos;t respond. Showing results from the other one.
        </p>
      ) : entries.length === 0 ? (
        <p className="rounded-lg border border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-500">
          No results from this source.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {entries.map((entry) => (
            <CatalogCard key={entry.id} entry={entry} badgeClass={badgeClass} />
          ))}
        </div>
      )}
    </div>
  );
}
