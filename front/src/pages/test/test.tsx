'use client';

import { Button } from 'shared/ui/Button';
import { FormProvider, useForm } from 'react-hook-form';
import s from './test.module.scss';
import { Input, PasswordInput, Textarea } from 'shared/ui/Inputs';

// SVG иконки...
const PlusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const TrashIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// Компонент с формой (обёртка для react-hook-form)
function InputsSection() {
  const methods = useForm({
    defaultValues: {
      email: '',
      search: '',
      username: '',
      disabled: '',
      'ghost-email': '',
      'ghost-password': '',
      'ghost-search': '',
      password: '',
      confirm: '',
      note: '',
      sm: '',
      md: '',
      lg: '',
    },
  });

  return (
    <FormProvider {...methods}>
      <div className={s.page}>
        <div className={s.bgGradient} />
        <div className={s.container}>
          <h1 className={s.title}>Поля ввода</h1>
          <p className={s.subtitle}>Glassmorphism + ваши цвета</p>

          {/* === DEFAULT === */}
          <section className={s.section}>
            <h2 className={s.sectionTitle}>Default — Светлая тема</h2>
            <div className={s.grid}>
              <Input
                name="email"
                type="email"
                label="Email"
                placeholder="mark@mail.com"
                iconLeft={<MailIcon />}
              />
              <Input
                name="search"
                type="search"
                label="Поиск"
                placeholder="Найти фильм..."
              />
              <Input
                name="username"
                label="Имя пользователя"
                placeholder="Введите имя"
                iconLeft={<UserIcon />}
              />
              <Input
                name="disabled"
                label="Disabled"
                placeholder="Недоступно"
                disabled
              />
            </div>
          </section>

          {/* === GHOST === */}
          <section className={s.sectionGhost}>
            <div className={s.ghostBg} />
            <h2 className={s.sectionTitleGhost}>Ghost — На фоне</h2>
            <div className={s.gridGhost}>
              <Input
                name="ghost-email"
                type="email"
                variant="ghost"
                placeholder="User Name"
                iconLeft={<UserIcon />}
              />
              <Input
                name="ghost-password"
                type="password"
                variant="ghost"
                placeholder="Password"
                iconLeft={<LockIcon />}
              />
              <Input
                name="ghost-search"
                type="search"
                variant="ghost"
                placeholder="Поиск..."
              />
            </div>
          </section>

          {/* === PASSWORD === */}
          <section className={s.section}>
            <h2 className={s.sectionTitle}>Password с индикатором</h2>
            <div className={s.grid}>
              <PasswordInput
                name="password"
                label="Пароль"
                placeholder="••••••••"
                showStrength
              />
              <PasswordInput
                name="confirm"
                label="Подтвердите пароль"
                placeholder="••••••••"
              />
            </div>
          </section>

          {/* === TEXTAREA === */}
          <section className={s.section}>
            <h2 className={s.sectionTitle}>Textarea</h2>
            <Textarea
              name="note"
              label="Заметка о фильме"
              placeholder="О чём фильм, что запомнилось..."
              rows={4}
            />
          </section>

          {/* === РАЗМЕРЫ === */}
          <section className={s.section}>
            <h2 className={s.sectionTitle}>Размеры</h2>
            <div className={s.sizesRow}>
              <Input name="sm" size="sm" placeholder="Small" />
              <Input name="md" size="md" placeholder="Medium" />
              <Input name="lg" size="lg" placeholder="Large" />
            </div>
          </section>
        </div>
      </div>
    </FormProvider>
  );
}
// components/Logo/Logo.tsx
export const Logo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 140 40"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <linearGradient id="bulbGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f9e79f" />
        <stop offset="50%" stopColor="#f1d36b" />
        <stop offset="100%" stopColor="#d4a017" />
      </linearGradient>
    </defs>

    {/* L */}
    <text
      x="8"
      y="30"
      fontSize="28"
      fontWeight="700"
      fill="currentColor"
      fontFamily="system-ui, -apple-system, sans-serif"
    >
      L
    </text>

    {/* Лампочка */}
    <g transform="translate(28, 8)" filter="url(#glow)">
      {/* Основная колба */}
      <path
        d="M12 2C6.48 2 2 6.48 2 12c0 3.5 1.8 6.5 4.5 8.3V22c0 .55.45 1 1 1h9c.55 0 1-.45 1-1v-1.7c2.7-1.8 4.5-4.8 4.5-8.3 0-5.52-4.48-10-10-10z"
        fill="url(#bulbGradient)"
      />
      {/* Ниточка накаливания */}
      <path
        d="M8 20h8M9 16l1.5-3M15 16l-1.5-3"
        stroke="#b8860b"
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Блик */}
      <ellipse cx="9" cy="8" rx="3" ry="4" fill="white" opacity="0.4" />
    </g>

    {/* gma */}
    <text
      x="54"
      y="30"
      fontSize="28"
      fontWeight="700"
      fill="currentColor"
      fontFamily="system-ui, -apple-system, sans-serif"
      letterSpacing="-0.02em"
    >
      gma
    </text>
  </svg>
);
export const LogoGeometric = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 140 40"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="bulbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffecd2" />
        <stop offset="100%" stopColor="#fcb69f" />
      </linearGradient>
      <filter id="softGlow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* L - геометрическая */}
    <path d="M8 8h6v20h10v6H8V8z" fill="currentColor" rx="2" />

    {/* Лампочка - стилизованная капля */}
    <g transform="translate(30, 6)" filter="url(#softGlow)">
      <path
        d="M12 0C5.37 0 0 5.37 0 12c0 4.2 2.15 7.9 5.4 10.1L6 26h12l.6-3.9C21.85 19.9 24 16.2 24 12c0-6.63-5.37-12-12-12z"
        fill="url(#bulbGrad)"
      />
      {/* Внутреннее свечение */}
      <circle cx="8" cy="8" r="4" fill="white" opacity="0.5" />
      {/* Основание */}
      <rect x="8" y="24" width="8" height="4" rx="1" fill="#d4a017" />
    </g>

    {/* gma */}
    <text
      x="58"
      y="30"
      fontSize="26"
      fontWeight="600"
      fill="currentColor"
      fontFamily="Inter, system-ui, sans-serif"
    >
      gma
    </text>
  </svg>
);
export const LogoNeon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 140 40"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="neonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fff9c4" />
        <stop offset="50%" stopColor="#ffeb3b" />
        <stop offset="100%" stopColor="#fbc02d" />
      </linearGradient>
      <filter id="neonGlow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feFlood floodColor="#ffeb3b" floodOpacity="0.6" />
        <feComposite in2="blur" operator="in" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* L */}
    <path d="M6 6h8v20h12v8H6V6z" fill="currentColor" />

    {/* Лампочка - неоновая */}
    <g transform="translate(32, 4)" filter="url(#neonGlow)">
      {/* Колба */}
      <path
        d="M12 2C6.48 2 2 6.48 2 12c0 3.5 1.8 6.5 4.5 8.3V22c0 .55.45 1 1 1h9c.55 0 1-.45 1-1v-1.7c2.7-1.8 4.5-4.8 4.5-8.3 0-5.52-4.48-10-10-10z"
        fill="url(#neonGrad)"
        stroke="#ffeb3b"
        strokeWidth="0.5"
      />
      {/* Молния внутри */}
      <path d="M11 8l-3 6h3l-1 6 5-8h-3l2-4h-3z" fill="#f57f17" opacity="0.8" />
    </g>

    {/* gma */}
    <text
      x="60"
      y="30"
      fontSize="26"
      fontWeight="700"
      fill="currentColor"
      fontFamily="Inter, system-ui, sans-serif"
      letterSpacing="-0.01em"
    >
      gma
    </text>
  </svg>
);
export const LogoMinimal = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 120 32"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="lightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fffde7" />
        <stop offset="100%" stopColor="#f1d36b" />
      </linearGradient>
    </defs>

    {/* L */}
    <text
      x="0"
      y="24"
      fontSize="24"
      fontWeight="700"
      fill="currentColor"
      fontFamily="Inter, system-ui, sans-serif"
    >
      L
    </text>

    {/* Лампочка - простая капля */}
    <g transform="translate(20, 4)">
      <path
        d="M10 0C4.48 0 0 4.48 0 10c0 3 1.5 5.5 3.8 7.2L4 20h12l.2-2.8C18.5 15.5 20 13 20 10c0-5.52-4.48-10-10-10z"
        fill="url(#lightGrad)"
      />
      {/* Блик */}
      <circle cx="6" cy="6" r="3" fill="white" opacity="0.6" />
      {/* Цоколь */}
      <rect x="6" y="20" width="8" height="3" rx="1" fill="#d4a017" />
    </g>

    {/* gma */}
    <text
      x="46"
      y="24"
      fontSize="24"
      fontWeight="600"
      fill="currentColor"
      fontFamily="Inter, system-ui, sans-serif"
      letterSpacing="-0.02em"
    >
      gma
    </text>
  </svg>
);
// Главный компонент
export const Test = () => {
  return (
    <div className={s.pageWrapper}>
      <LogoNeon />

      {/* === КНОПКИ === */}
      <div className={s.page}>
        <div className={s.bgGradient} />
        <div className={s.container}>
          <h1 className={s.title}>Кнопки</h1>
          <p className={s.subtitle}>Glassmorphism + ваши цвета</p>

          {/* PRIMARY */}
          <section className={s.section}>
            <h2 className={s.sectionTitle}>Primary</h2>
            <p className={s.sectionDesc}>Основное действие, синий акцент</p>
            <div className={s.row}>
              <div className={s.group}>
                <span className={s.label}>Small</span>
                <Button size="sm" theme="primary">
                  Добавить
                </Button>
              </div>
              <div className={s.group}>
                <span className={s.label}>Medium</span>
                <Button theme="primary">Добавить фильм</Button>
              </div>
              <div className={s.group}>
                <span className={s.label}>Large</span>
                <Button size="lg" theme="primary">
                  Сохранить
                </Button>
              </div>
            </div>
            <div className={s.row}>
              <div className={s.group}>
                <span className={s.label}>С иконкой</span>
                <Button theme="primary" iconLeft={<PlusIcon />}>
                  Добавить
                </Button>
              </div>
              <div className={s.group}>
                <span className={s.label}>Иконка справа</span>
                <Button theme="primary" iconRight={<ArrowRightIcon />}>
                  Далее
                </Button>
              </div>
              <div className={s.group}>
                <span className={s.label}>Full width</span>
                <Button theme="primary" fullWidth>
                  Войти
                </Button>
              </div>
            </div>
            <div className={s.row}>
              <div className={s.group}>
                <span className={s.label}>Loading</span>
                <Button theme="primary" loading>
                  Сохраняем
                </Button>
              </div>
              <div className={s.group}>
                <span className={s.label}>Disabled</span>
                <Button theme="primary" disabled>
                  Недоступно
                </Button>
              </div>
            </div>
          </section>

          {/* SECONDARY */}
          <section className={s.section}>
            <h2 className={s.sectionTitle}>Secondary</h2>
            <p className={s.sectionDesc}>Glass-эффект, вторичное действие</p>
            <div className={s.row}>
              <Button size="sm" theme="secondary">
                Отмена
              </Button>
              <Button theme="secondary">Отменить</Button>
              <Button size="lg" theme="secondary">
                Назад
              </Button>
            </div>
            <div className={s.row}>
              <Button theme="secondary" iconLeft={<TrashIcon />}>
                Удалить
              </Button>
              <Button theme="secondary" disabled>
                Недоступно
              </Button>
            </div>
          </section>

          {/* GHOST */}
          <section className={s.sectionGhost}>
            <div className={s.ghostBg} />
            <h2 className={s.sectionTitle}>Ghost</h2>
            <p className={s.sectionDesc}>Для кнопок на фоне с изображением</p>
            <div className={s.row}>
              <Button theme="ghost" size="sm">
                Маленькая
              </Button>
              <Button theme="ghost">Средняя</Button>
              <Button theme="ghost" size="lg">
                Большая
              </Button>
              <Button theme="ghost" iconLeft={<StarIcon />}>
                С иконкой
              </Button>
              <Button theme="ghost" disabled>
                Disabled
              </Button>
            </div>
          </section>

          {/* LIGHT */}
          <section className={s.section}>
            <h2 className={s.sectionTitle}>Light</h2>
            <div className={s.row}>
              <Button size="sm" theme="light">
                Меньше
              </Button>
              <Button theme="light">Пропустить</Button>
              <Button size="lg" theme="light">
                Позже
              </Button>
              <Button theme="light" disabled>
                Disabled
              </Button>
            </div>
          </section>

          {/* LINK */}
          <section className={s.section}>
            <h2 className={s.sectionTitle}>Link</h2>
            <div className={s.row}>
              <Button theme="link">Забыли пароль?</Button>
              <Button theme="link" disabled>
                Недоступно
              </Button>
            </div>
          </section>

          {/* КОМБИНАЦИИ */}
          <section className={s.section}>
            <h2 className={s.sectionTitle}>Комбинации</h2>
            <div className={s.comboRow}>
              <Button theme="secondary">Отмена</Button>
              <Button theme="primary">Сохранить</Button>
            </div>
            <div className={s.comboRow}>
              <Button theme="light">Пропустить</Button>
              <Button theme="secondary">Назад</Button>
              <Button theme="primary" iconRight={<ArrowRightIcon />}>
                Далее
              </Button>
            </div>
          </section>
        </div>
      </div>

      {/* === ИНПУТЫ (с FormProvider) === */}
      <InputsSection />
    </div>
  );
};
