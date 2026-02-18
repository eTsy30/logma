'use client';
import s from './dashboard.module.scss';
import { Tabs } from 'shared/ui/Tabs';

import { MAIN_TABS } from 'features/media/mainTabs.config';
import { MovieSearch } from 'features/movie-search';

export const DashboardView = () => {
  return (
    <div className={s.container}>
      <div className={s.content}>
        <MovieSearch />
      </div>
      <Tabs
        storageKey="main-category"
        orientation="vertical"
        tabs={MAIN_TABS}
      />
    </div>
  );
};
