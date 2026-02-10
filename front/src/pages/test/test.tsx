'use client';
// UI-Kit-Showcase.tsx — Все варианты компонентов
import { Form, FormProvider, useFormStore } from '@ariakit/react';

import s from './test.module.scss';
import { Button } from 'shared/ui/Button';

import { useTheme } from 'next-themes';
import { Input, PasswordInput, Textarea } from 'shared/ui/Inputs';

// ============================================
// Icons
// ============================================
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

const StarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    width="20"
    height="20"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// ============================================
// Main Showcase Component
// ============================================
export function Test() {
  // Forms
  const loginForm = useFormStore({ defaultValues: { email: '', password: '' } });
  const { theme, setTheme } = useTheme();
  const registerForm = useFormStore({
    defaultValues: { username: '', email: '', password: '', bio: '' },
  });
  const searchForm = useFormStore({ defaultValues: { search: '' } });

  return (
    <div className={s.showcase}>
      <h1 className={s.title}>CineLog UI Kit</h1>

      {/* ============================================
          BUTTONS SECTION
      ============================================ */}
      <section className={s.section}>
        <h2 className={s.sectionTitle}>Buttons</h2>

        {/* Sizes */}
        <div className={s.block}>
          <h3 className={s.blockTitle}>Sizes</h3>
          <div className={s.row}>
            <Button size="sm">Small Button</Button>
            <Button size="md">Medium Button</Button>
            <Button size="lg">Large Button</Button>
          </div>
        </div>

        {/* Themes */}
        <div className={s.block}>
          <h3 className={s.blockTitle}>Themes</h3>
          <div className={s.row}>
            <Button theme="primary">Primary</Button>
            <Button theme="secondary">Secondary</Button>
            <Button theme="light">Light</Button>
            <Button theme="link">Link</Button>
          </div>
        </div>

        {/* States */}
        <div className={s.block}>
          <h3 className={s.blockTitle}>States</h3>
          <div className={s.row}>
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
            <Button disabled loading>
              Disabled Loading
            </Button>
          </div>
        </div>

        {/* With Icons */}
        <div className={s.block}>
          <h3 className={s.blockTitle}>With Icons</h3>
          <div className={s.row}>
            <Button iconLeft={<PlusIcon />}>Add Movie</Button>
            <Button iconRight={<ArrowRightIcon />}>Next Step</Button>
            <Button iconLeft={<ArrowLeftIcon />} iconRight={<ArrowRightIcon />}>
              Both Icons
            </Button>
          </div>
          <div className={s.row}>
            <Button theme="secondary" iconLeft={<SearchIcon />}>
              Search
            </Button>
            <Button theme="light" iconLeft={<StarIcon />}>
              Favorite
            </Button>
            <Button theme="link" iconRight={<ArrowRightIcon />}>
              View All
            </Button>
          </div>
        </div>

        {/* Icon Only (квадратные) */}
        <div className={s.block}>
          <h3 className={s.blockTitle}>Icon Only</h3>
          <div className={s.row}>
            <Button iconLeft={<SearchIcon />} aria-label="Search" />
            <Button iconLeft={<PlusIcon />} theme="secondary" aria-label="Add" />
            <Button iconLeft={<StarIcon />} theme="light" aria-label="Favorite" />
            <Button iconLeft={<ArrowRightIcon />} theme="link" aria-label="Next" />
          </div>
        </div>

        {/* Full Width */}
        <div className={s.block}>
          <h3 className={s.blockTitle}>Full Width</h3>
          <div className={s.column}>
            <Button fullWidth>Full Width Primary</Button>
            <Button fullWidth theme="secondary">
              Full Width Secondary
            </Button>
            <Button fullWidth theme="primary" iconLeft={<DownloadIcon />}>
              Download All
            </Button>
          </div>
        </div>

        {/* Size + Theme Combinations */}
        <div className={s.block}>
          <h3 className={s.blockTitle}>Size + Theme Matrix</h3>
          <div className={s.grid}>
            <Button size="sm" theme="primary">
              SM Primary
            </Button>
            <Button size="sm" theme="secondary">
              SM Secondary
            </Button>
            <Button size="sm" theme="light">
              SM Light
            </Button>
            <Button size="sm" theme="link">
              SM Link
            </Button>

            <Button size="md" theme="primary">
              MD Primary
            </Button>
            <Button size="md" theme="secondary">
              MD Secondary
            </Button>
            <Button size="md" theme="light">
              MD Light
            </Button>
            <Button size="md" theme="link">
              MD Link
            </Button>

            <Button size="lg" theme="primary">
              LG Primary
            </Button>
            <Button size="lg" theme="secondary">
              LG Secondary
            </Button>
            <Button size="lg" theme="light">
              LG Light
            </Button>
            <Button size="lg" theme="link">
              LG Link
            </Button>
          </div>
        </div>

        {/* Complex Examples */}
        <div className={s.block}>
          <h3 className={s.blockTitle}>Complex Examples</h3>
          <div className={s.row}>
            <Button
              size="lg"
              theme="primary"
              iconLeft={<PlusIcon />}
              iconRight={<ArrowRightIcon />}
            >
              Create Account
            </Button>
            <Button theme="secondary" iconLeft={<CheckIcon />} disabled>
              Saved
            </Button>
            <Button theme="link" loading>
              Processing...
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================
          INPUTS SECTION
      ============================================ */}
      <section className={s.section}>
        <h2 className={s.sectionTitle}>Inputs</h2>

        {/* Basic Text Inputs */}
        <div className={s.block}>
          <h3 className={s.blockTitle}>Basic Text Inputs</h3>
          <div className={s.column}>
            <FormProvider store={loginForm}>
              <Input
                name="basic-sm"
                size="sm"
                label="Small Input"
                placeholder="Small placeholder..."
              />
              <Input
                name="basic-md"
                size="md"
                label="Medium Input (Default)"
                placeholder="Medium placeholder..."
              />
              <Input
                name="basic-lg"
                size="lg"
                label="Large Input"
                placeholder="Large placeholder..."
              />
            </FormProvider>
          </div>
        </div>

        {/* Input Types */}
        <div className={s.block}>
          <h3 className={s.blockTitle}>Input Types</h3>
          <div className={s.column}>
            <FormProvider store={loginForm}>
              <Input name="type-text" type="text" label="Text" placeholder="Regular text..." />
              <Input name="type-email" type="email" label="Email" placeholder="user@example.com" />
              <Input name="type-tel" type="tel" label="Phone" placeholder="+1 (555) 000-0000" />
              <Input name="type-url" type="url" label="URL" placeholder="https://example.com" />
              <Input name="type-number" type="number" label="Number" placeholder="0" />
            </FormProvider>
          </div>
        </div>

        {/* With Icons */}
        <div className={s.block}>
          <h3 className={s.blockTitle}>With Icons</h3>
          <div className={s.column}>
            <FormProvider store={loginForm}>
              <Input
                name="icon-left"
                label="Left Icon"
                placeholder="Search movies..."
                iconLeft={<SearchIcon />}
              />
              <Input
                name="icon-right"
                label="Right Icon"
                placeholder="Your name"
                iconRight={<UserIcon />}
              />
              <Input
                name="icon-both"
                label="Both Icons"
                placeholder="Select date"
                iconLeft={<CalendarIcon />}
                iconRight={<CheckIcon />}
              />
              <Input
                name="icon-search-type"
                type="search"
                label="Auto Search Icon (type=search)"
                placeholder="Search..."
              />
            </FormProvider>
          </div>
        </div>

        {/* States */}
        <div className={s.block}>
          <h3 className={s.blockTitle}>States</h3>
          <div className={s.column}>
            <FormProvider store={loginForm}>
              <Input name="state-normal" label="Normal" placeholder="Normal state" />
              <Input
                name="state-disabled"
                label="Disabled"
                placeholder="Disabled input"
                disabled
                value="Can't edit this"
              />
              <Input name="state-required" label="Required" placeholder="Required field" required />
              <Input
                name="state-readonly"
                label="Read Only"
                placeholder="Read only"
                readOnly
                value="Read only value"
              />
            </FormProvider>
          </div>
        </div>

        {/* With Helper & Error */}
        <div className={s.block}>
          <h3 className={s.blockTitle}>Helper & Error Text</h3>
          <div className={s.column}>
            <FormProvider store={loginForm}>
              <Input
                name="helper-only"
                label="With Helper"
                placeholder="Type something..."
                helperText="This is a helpful hint"
              />
              <Input
                name="error-only"
                label="With Error"
                placeholder="Invalid input"
                error="This field is required"
              />
              <Input
                name="helper-and-error"
                label="Helper + Error (Error wins)"
                placeholder="Check validation"
                helperText="Should be at least 5 characters"
                error="Too short!"
              />
            </FormProvider>
          </div>
        </div>

        {/* Password Inputs */}
        <div className={s.block}>
          <h3 className={s.blockTitle}>Password Inputs</h3>
          <div className={s.column}>
            <FormProvider store={loginForm}>
              <PasswordInput name="pwd-basic" label="Basic Password" placeholder="Enter password" />
              <PasswordInput
                name="pwd-strength"
                label="With Strength Meter"
                placeholder="Strong password..."
                showStrength
                helperText="Use 8+ chars, numbers & symbols"
              />
              <PasswordInput
                name="pwd-error"
                label="Password with Error"
                placeholder="Wrong password"
                error="Password must contain uppercase letter"
              />
              <PasswordInput
                name="pwd-required"
                label="Required Password"
                placeholder="••••••••"
                required
                showStrength
              />
            </FormProvider>
          </div>
        </div>

        {/* Textarea */}
        <div className={s.block}>
          <h3 className={s.blockTitle}>Textarea</h3>
          <div className={s.column}>
            <FormProvider store={registerForm}>
              <Textarea
                name="textarea-sm"
                size="sm"
                label="Small Textarea"
                placeholder="Small text area..."
                rows={3}
              />
              <Textarea
                name="textarea-md"
                size="md"
                label="Medium Textarea (Default)"
                placeholder="Tell us about your favorite movie..."
                rows={4}
                helperText="Maximum 500 characters"
              />
              <Textarea
                name="textarea-lg"
                size="lg"
                label="Large Textarea"
                placeholder="Large text area..."
                rows={5}
              />
              <Textarea
                name="textarea-resize"
                label="No Resize"
                placeholder="Cannot resize this..."
                resize="none"
              />
              <Textarea
                name="textarea-horizontal"
                label="Horizontal Resize"
                placeholder="Resize horizontally..."
                resize="horizontal"
              />
              <Textarea
                name="textarea-error"
                label="Textarea with Error"
                placeholder="Invalid content..."
                error="Description is too short"
              />
              <Textarea
                name="textarea-disabled"
                label="Disabled Textarea"
                placeholder="Disabled..."
                disabled
                value="Can't edit this"
              />
            </FormProvider>
          </div>
        </div>

        {/* Complex Combinations */}
        <div className={s.block}>
          <h3 className={s.blockTitle}>Complex Combinations</h3>
          <div className={s.column}>
            <FormProvider store={registerForm}>
              <Input
                name="complex-1"
                size="lg"
                label="Large with Icons & Helper"
                placeholder="Search database..."
                iconLeft={<SearchIcon />}
                iconRight={<CheckIcon />}
                helperText="Press Enter to search"
              />
              <Input
                name="complex-2"
                type="email"
                label="Email Validation"
                placeholder="user@cinelog.com"
                iconLeft={<MailIcon />}
                required
                helperText="We'll send confirmation"
              />
              <PasswordInput
                name="complex-3"
                size="lg"
                label="Secure Password"
                placeholder="Create strong password"
                showStrength
                required
                helperText="Min 8 chars, 1 uppercase, 1 number"
              />
            </FormProvider>
          </div>
        </div>
      </section>

      {/* ============================================
          FORMS SECTION
      ============================================ */}
      <section className={s.section}>
        <h2 className={s.sectionTitle}>Complete Forms</h2>

        {/* Login Form */}
        <div className={s.block}>
          <h3 className={s.blockTitle}>Login Form</h3>
          <FormProvider store={loginForm}>
            <Form className={s.form}>
              <Input
                name="email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                iconLeft={<MailIcon />}
                required
              />
              <PasswordInput name="password" label="Password" placeholder="••••••••" required />
              <div className={s.formActions}>
                <Button theme="link" size="sm">
                  Forgot password?
                </Button>
                <Button type="submit" theme="primary" fullWidth size="lg">
                  Sign In
                </Button>
              </div>
            </Form>
          </FormProvider>
        </div>

        {/* Registration Form */}
        <div className={s.block}>
          <h3 className={s.blockTitle}>Registration Form</h3>
          <FormProvider store={registerForm}>
            <Form className={s.form}>
              <Input
                name="username"
                label="Username"
                placeholder="moviebuff123"
                iconLeft={<UserIcon />}
                required
                helperText="3-20 characters, letters and numbers only"
              />
              <Input
                name="email"
                type="email"
                label="Email"
                placeholder="you@example.com"
                iconLeft={<MailIcon />}
                required
              />
              <PasswordInput
                name="password"
                label="Password"
                placeholder="Create password"
                required
                showStrength
                helperText="Use 8+ characters with mix of letters, numbers & symbols"
              />
              <Textarea
                name="bio"
                label="Bio (Optional)"
                placeholder="Tell us about your movie preferences..."
                rows={3}
                helperText="This will be shown on your profile"
              />
              <Button type="submit" theme="primary" fullWidth size="lg" iconLeft={<CheckIcon />}>
                Create Account
              </Button>
            </Form>
          </FormProvider>
        </div>

        {/* Search Form */}
        <div className={s.block}>
          <h3 className={s.blockTitle}>Search Form</h3>
          <FormProvider store={searchForm}>
            <Form className={s.searchForm}>
              <Input
                name="search"
                type="search"
                size="lg"
                placeholder="Search movies, directors, actors..."
                iconRight={<Button theme="primary" size="sm" iconLeft={<SearchIcon />} />}
              />
              <div className={s.searchFilters}>
                <Button theme="secondary" size="sm">
                  Movies
                </Button>
                <Button theme="light" size="sm">
                  TV Shows
                </Button>
                <Button theme="light" size="sm">
                  People
                </Button>
              </div>
            </Form>
          </FormProvider>
        </div>
      </section>

      {/* ============================================
          DARK MODE TOGGLE
      ============================================ */}
      <section className={s.section}>
        <h2 className={s.sectionTitle}>Theme Test</h2>
        <div className={s.block}>
          <div className={s.row}>
            <Button onClick={() => document.documentElement.setAttribute('data-theme', 'light')}>
              Light Mode
            </Button>
            <Button
              theme="secondary"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              Dark Mode
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
