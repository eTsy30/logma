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

// Главный компонент
export const Test = () => {
  return (
    <div className={s.pageWrapper}>
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
