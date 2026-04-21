const buildPageItems = (currentPage, lastPage) => {
  if (lastPage <= 7) {
    return Array.from({ length: lastPage }, (_, index) => index + 1);
  }

  const items = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(lastPage - 1, currentPage + 1);

  if (start > 2) {
    items.push('start-ellipsis');
  }

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  if (end < lastPage - 1) {
    items.push('end-ellipsis');
  }

  items.push(lastPage);

  return items;
};

const clampPage = (page, lastPage) =>
  Math.min(Math.max(Number(page) || 1, 1), Math.max(lastPage, 1));

function AppPagination({
  currentPage = 1,
  lastPage = 1,
  onPageChange,
  summary,
  disabled = false,
  className = '',
}) {
  if (lastPage <= 1) return null;

  const safeCurrentPage = clampPage(currentPage, lastPage);
  const pages = buildPageItems(safeCurrentPage, lastPage);

  const handlePageChange = (page) => {
    if (disabled) return;
    const nextPage = clampPage(page, lastPage);
    if (nextPage === safeCurrentPage) return;
    onPageChange?.(nextPage);
  };

  return (
    <div
      className={`d-flex gap-2 justify-content-between align-items-center flex-sm-row flex-column ${className}`.trim()}
    >
      {summary ? (
        <p className='text-secondary text-truncate mb-0'>{summary}</p>
      ) : (
        <span />
      )}

      <ul className='pagination app-pagination mb-0'>
        <li
          className={`page-item ${
            disabled || safeCurrentPage === 1
              ? 'bg-light-secondary disabled'
              : ''
          }`}
        >
          <button
            type='button'
            className='page-link b-r-left'
            onClick={() => handlePageChange(safeCurrentPage - 1)}
            disabled={disabled || safeCurrentPage === 1}
          >
            Previous
          </button>
        </li>

        {pages.map((page) => {
          if (typeof page !== 'number') {
            return (
              <li
                key={page}
                className='page-item bg-light-secondary disabled'
              >
                <span className='page-link'>...</span>
              </li>
            );
          }

          return (
            <li
              key={page}
              className={`page-item ${
                page === safeCurrentPage ? 'active' : ''
              }`}
              aria-current={page === safeCurrentPage ? 'page' : undefined}
            >
              <button
                type='button'
                className='page-link'
                onClick={() => handlePageChange(page)}
                disabled={disabled}
              >
                {page}
              </button>
            </li>
          );
        })}

        <li
          className={`page-item page-next ${
            disabled || safeCurrentPage === lastPage
              ? 'bg-light-secondary disabled'
              : ''
          }`}
        >
          <button
            type='button'
            className='page-link'
            onClick={() => handlePageChange(safeCurrentPage + 1)}
            disabled={disabled || safeCurrentPage === lastPage}
          >
            Next
          </button>
        </li>
      </ul>
    </div>
  );
}

export default AppPagination;
