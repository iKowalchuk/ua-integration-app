import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import getControls, { Control } from '@/api/getControls';
import zustandStorage from '@/stores/zustandStorage';

type State = {
  controls: Control[];
  favorites: number[];
  renamedControls: Record<number, string>;
};

type Actions = {
  fetchControls: (payload: { apiURL: string; token: string }) => Promise<void>;
  toggleFavorite: (controlId: number) => void;
  renameControl: (controlId: number, name: string) => void;
};

const addToFavorites = (state: State, controlId: number) => ({
  favorites: [...state.favorites, controlId],
});

const removeFromFavorites = (state: State, controlId: number) => ({
  favorites: state.favorites.filter((id) => id !== controlId),
});

const renameControl = (state: State, controlId: number, name: string) => ({
  renamedControls: {
    ...state.renamedControls,
    [controlId]: name,
  },
  controls: state.controls.map((control) =>
    control.id === controlId ? { ...control, name } : control
  ),
});

const mergeFetchedWithState = (controls: Control[], state: State) =>
  controls.map((control) => ({
    ...control,
    name: state.renamedControls[control.id] || control.name,
  }));

const useControlsStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      controls: [],
      favorites: [],
      renamedControls: {},

      fetchControls: async (payload) => {
        const controls = await getControls({
          apiURL: payload.apiURL,
          token: payload.token,
        });
        set((state) => ({
          controls: mergeFetchedWithState(controls, state),
        }));
      },

      toggleFavorite: (controlId) => {
        const { favorites } = get();
        const setFavorites = favorites.includes(controlId)
          ? removeFromFavorites
          : addToFavorites;
        set((state) => setFavorites(state, controlId));
      },

      renameControl: (controlId, name) => {
        set((state) => renameControl(state, controlId, name));
      },
    }),
    {
      name: 'controls-storage',
      version: 1,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export default useControlsStore;
