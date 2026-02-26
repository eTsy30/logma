'use client';
import { Tabs } from 'shared/ui/Tabs';
import { BOOK_TABS } from './books.config';

export const BooksTabs = () => {
  return <Tabs storageKey="books-subcategory" tabs={BOOK_TABS} />;
};
