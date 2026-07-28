import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

/**
 * Pagination — reusable page navigation with optional limit selector.
 *
 * Props:
 *  - currentPage  {number}   1-based current page
 *  - totalPages   {number}   total number of pages
 *  - onPageChange {(page) => void}
 *  - [limit]      {number}   current items-per-page
 *  - [onLimitChange] {(limit) => void}
 *  - [limitOptions]  {number[]} defaults [10,20,50,100]
 *  - [label]      {string}   aria-label for the nav
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
  limitOptions = [10, 20, 50, 100],
  label,
}) {
  const { t } = useTranslation();
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label={label || t('common.next')}>
      {onLimitChange && (
        <div className="pagination-limit">
          <span>{t('common.show')}</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            aria-label={t('common.itemsPerPage')}
          >
            {limitOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        type="button"
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label={t('common.previous')}
      >
        <ChevronLeft size={16} style={{ marginRight: '6px' }} />
        {t('common.previous')}
      </button>

      <span className="pagination-info">
        {t('common.pageOf', { current: currentPage, total: totalPages })}
      </span>

      <button
        type="button"
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label={t('common.next')}
      >
        {t('common.next')}
        <ChevronRight size={16} style={{ marginLeft: '6px' }} />
      </button>
    </nav>
  );
}
