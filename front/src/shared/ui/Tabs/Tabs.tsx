'use client';
import { type ReactNode, useEffect, useState, useCallback } from 'react';
import * as Ariakit from '@ariakit/react';
import cx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

import s from './Tabs.module.scss';

type TabItem = {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

type TabsProps = {
  tabs: TabItem[];
  defaultId?: string;
  selectedId?: string;
  onSelect?: (id: string | null | undefined) => void;
  storageKey?: string;
  variant?: 'horizontal' | 'floating'; // 'floating' = новый вид как на картинке
  lazy?: boolean;
  tabsClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
  panelClassName?: string;
};

export function Tabs({
  tabs,
  defaultId,
  selectedId: controlledSelectedId,
  onSelect,
  storageKey,
  variant = 'horizontal',
  lazy = false,
  tabsClassName,
  tabClassName,
  contentClassName,
  panelClassName,
}: TabsProps) {
  const [mountedTabs, setMountedTabs] = useState<Set<string>>(
    new Set<string>(),
  );

  const getInitialSelectedId = useCallback(() => {
    if (controlledSelectedId) return controlledSelectedId;
    if (storageKey && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved && tabs.some((t) => t.id === saved)) {
          return saved;
        }
      } catch {}
    }
    return defaultId || tabs[0]?.id;
  }, [controlledSelectedId, storageKey, defaultId, tabs]);

  const [internalSelectedId, setInternalSelectedId] = useState<
    string | undefined
  >(getInitialSelectedId);

  useEffect(() => {
    if (controlledSelectedId !== undefined) {
      setInternalSelectedId(controlledSelectedId);
    }
  }, [controlledSelectedId]);

  const handleSelect = useCallback(
    (id: string | null | undefined) => {
      if (id === null || id === undefined) return;
      if (controlledSelectedId === undefined) {
        setInternalSelectedId(id);
      }
      if (storageKey && typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, id);
        } catch {}
      }
      onSelect?.(id);
      if (lazy) {
        setMountedTabs((prev) => new Set(prev).add(id));
      }
    },
    [controlledSelectedId, storageKey, onSelect, lazy],
  );

  const isControlled = controlledSelectedId !== undefined;
  const currentSelectedId = isControlled
    ? controlledSelectedId
    : internalSelectedId;

  const shouldRenderTab = (tabId: string) => {
    if (!lazy) return true;
    return mountedTabs.has(tabId) || tabId === currentSelectedId;
  };

  useEffect(() => {
    if (currentSelectedId && lazy) {
      setMountedTabs((prev) => new Set(prev).add(currentSelectedId));
    }
  }, [currentSelectedId, lazy]);

  useEffect(() => {
    if (!lazy) {
      setMountedTabs(new Set(tabs.map((t) => t.id)));
    }
  }, [lazy, tabs]);

  // === FLOATING TABS (как на картинке — иконки в голубой панели) ===
  if (variant === 'floating') {
    return (
      <Ariakit.TabProvider
        selectedId={currentSelectedId}
        setSelectedId={handleSelect}
      >
        <div className={cx(s.floatingTabs, tabsClassName)}>
          {tabs.map((tab, index) => {
            const isActive = tab.id === currentSelectedId;
            const showDivider = index > 0; // Разделитель перед всеми кроме первой

            return (
              <div
                key={tab.id}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                {showDivider && <div className={s.floatingTabDivider} />}
                <Ariakit.Tab
                  id={tab.id}
                  disabled={tab.disabled}
                  className={cx(
                    s.floatingTab,
                    isActive && s.floatingTabActive,
                    tabClassName,
                  )}
                >
                  {tab.icon && (
                    <span className={s.floatingTabIcon}>{tab.icon}</span>
                  )}

                  {tab.label && (
                    <span className={s.floatingTabLabel}>{tab.label}</span>
                  )}
                </Ariakit.Tab>
              </div>
            );
          })}
        </div>

        <div className={cx(s.floatingContent, contentClassName)}>
          <AnimatePresence mode="wait">
            {tabs.map(
              (tab) =>
                tab.id === currentSelectedId && (
                  <Ariakit.TabPanel
                    key={tab.id}
                    tabId={tab.id}
                    className={cx(s.floatingPanel, panelClassName)}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={s.content_list}
                    >
                      {shouldRenderTab(tab.id) && tab.content}
                    </motion.div>
                  </Ariakit.TabPanel>
                ),
            )}
          </AnimatePresence>
        </div>
      </Ariakit.TabProvider>
    );
  }

  return (
    <Ariakit.TabProvider
      selectedId={currentSelectedId}
      setSelectedId={handleSelect}
    >
      <div className={cx(s.wrapper, s.wrapperHorizontal)}>
        <Ariakit.TabList
          className={cx(s.list, s.listHorizontal, tabsClassName)}
        >
          {tabs.map((tab) => {
            const isActive = tab.id === currentSelectedId;
            return (
              <Ariakit.Tab
                key={tab.id}
                id={tab.id}
                disabled={tab.disabled}
                className={cx(
                  s.tab,
                  s.tabHorizontal,
                  isActive && s.tabActive,
                  tabClassName,
                )}
              >
                {tab.icon && <span className={s.tabIcon}>{tab.icon}</span>}
                <span className={s.tabLabel}>{tab.label}</span>
                {isActive && (
                  <motion.span
                    className={s.tabIndicator}
                    layoutId={
                      storageKey
                        ? `activeTab-${storageKey}`
                        : 'activeTab-horizontal'
                    }
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </Ariakit.Tab>
            );
          })}
        </Ariakit.TabList>

        <div className={cx(s.content, s.contentHorizontal, contentClassName)}>
          <AnimatePresence mode="wait">
            {tabs.map(
              (tab) =>
                tab.id === currentSelectedId && (
                  <Ariakit.TabPanel
                    key={tab.id}
                    tabId={tab.id}
                    className={cx(s.panel, panelClassName)}
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={s.content_list}
                    >
                      {shouldRenderTab(tab.id) && tab.content}
                    </motion.div>
                  </Ariakit.TabPanel>
                ),
            )}
          </AnimatePresence>
        </div>
      </div>
    </Ariakit.TabProvider>
  );
}
