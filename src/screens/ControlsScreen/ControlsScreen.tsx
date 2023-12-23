import i18n from 'i18n-js';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import PagerView from 'react-native-pager-view';
import { useShallow } from 'zustand/react/shallow';

import { Control } from '@/api/getControls';
import LoadingView from '@/components/LoadingView';
import { useAuthContext } from '@/contexts/AuthContext';
import ControlSectionData from '@/screens/ControlsScreen/ControlSectionData';
import ControlSectionTabs from '@/screens/ControlsScreen/ControlSectionTabs';
import useControlsStore from '@/stores/useControlsStore';

const ControlsScreen = () => {
  const { authState } = useAuthContext();

  const { controls, fetchControls, favorites } = useControlsStore(
    useShallow((state) => ({
      controls: state.controls,
      fetchControls: state.fetchControls,
      favorites: state.favorites,
    }))
  );

  const [sectionTabIndex, setSectionTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const viewPagerRef = useRef<PagerView>(null);

  useEffect(() => {
    const getMenuRequest = async () => {
      if (authState.type !== 'authenticated') {
        return;
      }

      try {
        setIsLoading(true);
        await fetchControls({
          apiURL: authState.session.apiURL,
          token: authState.session.token,
        });
      } finally {
        setIsLoading(false);
      }
    };

    getMenuRequest();
  }, [authState]);

  useEffect(() => {
    setSectionTabIndex(0);
    viewPagerRef.current?.setPageWithoutAnimation(0);
  }, [favorites.length]);

  const sectionItems = useMemo(() => {
    const groupFavorites = i18n.t('controls.section.favorites');

    const entries = Object.entries(
      controls.reduce(
        (acc: { [key: string]: Control[] }, { groupName, ...other }) => {
          return Object.assign(acc, {
            ...(favorites.includes(other.id) && {
              [groupFavorites]: [
                ...(acc[groupFavorites] || []),
                { groupName, ...other },
              ],
            }),
            [groupName]: [...(acc[groupName] || []), { groupName, ...other }],
          });
        },
        {}
      )
    );

    // Sort the entries so that groupFavorites always comes first
    entries.sort(([keyA], [keyB]) => {
      if (keyA === groupFavorites) return -1;
      if (keyB === groupFavorites) return 1;
      return 0;
    });

    return entries.map(([key, value]) => ({ title: key, data: value }));
  }, [controls, favorites]);

  if (isLoading) {
    return <LoadingView />;
  }

  return (
    <>
      <ControlSectionTabs
        data={sectionItems}
        activeTabIndex={sectionTabIndex}
        onTabIndexChange={(index) => {
          setSectionTabIndex(index);
          viewPagerRef.current?.setPage(index);
        }}
      />

      <PagerView
        style={{ flex: 1 }}
        ref={viewPagerRef}
        initialPage={sectionTabIndex}
        onPageSelected={({ nativeEvent }) =>
          setSectionTabIndex(nativeEvent.position)
        }
      >
        {sectionItems.map(({ data }, index) => (
          <ControlSectionData key={index} data={data} />
        ))}
      </PagerView>
    </>
  );
};

export default ControlsScreen;
