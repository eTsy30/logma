export function calculateStrength(password: string): {
  level: number;
  label: string;
} {
  let score = 0;
  if (password.length > 6) score++;
  if (password.length > 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: 'Очень слабый' },
    { label: 'Слабый' },
    { label: 'Средний' },
    { label: 'Хороший' },
    { label: 'Сильный' },
  ];

  const level = Math.min(score, 4);
  return { level, label: levels[level]!.label };
}
