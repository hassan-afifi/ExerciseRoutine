export function Pagination({ meta, onPageChange }) {
    if (!meta || meta.last_page <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                type="button"
                className="btn btn-sm btn-outline"
                disabled={meta.current_page <= 1}
                onClick={() => onPageChange(meta.current_page - 1)}
            >
                Previous
            </button>
            <span className="text-sm">
                Page {meta.current_page} of {meta.last_page}
            </span>
            <button
                type="button"
                className="btn btn-sm btn-outline"
                disabled={meta.current_page >= meta.last_page}
                onClick={() => onPageChange(meta.current_page + 1)}
            >
                Next
            </button>
        </div>
    );
}
