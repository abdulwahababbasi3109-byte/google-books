export function Pagination({
  page,
  hasMore,
  disabled,
  onChange,
}: {
  page: number;
  hasMore: boolean;
  disabled: boolean;
  onChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={disabled || page <= 1}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
      >
        Previous
      </button>
      <span className="text-sm text-gray-500">Page {page}</span>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={disabled || !hasMore}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
      >
        Next
      </button>
    </div>
  );
}
