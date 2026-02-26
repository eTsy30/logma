'use client';

import { Search, X, Loader2, ArrowLeft } from 'lucide-react';
import s from './MovieSearch.module.scss';

interface Props {
  query: string;
  isFetching: boolean;
  onChange: (value: string) => void;
  onFocus: () => void;
  onClear: () => void;
  onBack?: () => void;
}

export function SearchInput({
  query,
  isFetching,
  onChange,
  onFocus,
  onClear,
  onBack,
}: Props) {
  return (
    <div className={s.searchWrapper}>
      {onBack && (
        <button className={s.backBtn} onClick={onBack} aria-label="Назад">
          <ArrowLeft size={20} />
        </button>
      )}
      <Search size={20} className={s.searchIcon} />
      <input
        type="text"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder="Найти фильм..."
        className={s.searchInput}
      />
      {isFetching ? (
        <Loader2 size={20} className={s.loader} />
      ) : query ? (
        <button className={s.clearBtn} onClick={onClear}>
          <X size={14} />
        </button>
      ) : null}
    </div>
  );
}
