'use client';
import { Tabs } from 'shared/ui/Tabs';
import { BOOK_TABS } from './books.config';

export const BooksTabs = () => {
  return (
    <Tabs storageKey="books-subcategory" tabType="button" tabs={BOOK_TABS} />
  );
};
