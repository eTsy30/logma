export const formatRating = (rating?: number) =>
  rating ? rating.toFixed(1) : '—';

export const getAgeBadge = (age?: number) => (age ? `${age}+` : '0+');

export const formatDate = (date?: string) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const truncate = (text?: string, max = 120) => {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + '…';
};
