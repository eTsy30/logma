'use client';
import s from './dashboard.module.scss';
import { Tabs } from 'shared/ui/Tabs';

import { MAIN_TABS } from 'features/media/mainTabs.config';
import { Sidebar } from 'shared/ui/Sidebar';

export const DashboardView = () => {
  return (
    <div className={s.container}>
      <Sidebar />
      <div className={s.tabsWrapper}>
        {' '}
        {/* ← ДОБАВИТЬ */}
        <Tabs
          storageKey="main-category"
          orientation="vertical"
          tabs={MAIN_TABS}
        />
      </div>
    </div>
  );
};
