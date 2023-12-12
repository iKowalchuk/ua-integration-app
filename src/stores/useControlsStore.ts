import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import getControls, { Control } from '@/api/getControls';
import zustandStorage from '@/stores/zustandStorage';

type State = {
  controls: Control[];
  favoriteControls: Control[];
  renamedControls: Record<number, string>;
};

type Actions = {
  fetchControls: (payload: { apiURL: string; token: string }) => Promise<void>;
  hasFavorite: (control: Control) => boolean;
  toggleFavorite: (control: Control) => void;
  renameControl: (controlId: number, name: string) => void;
};

const isInFavorites = (favorites: Control[], control: Control) =>
  favorites.some((favControl) => favControl.id === control.id);

const addToFavorites = (state: State, control: Control) => ({
  favoriteControls: [...state.favoriteControls, control],
});

const removeFromFavorites = (state: State, control: Control) => ({
  favoriteControls: state.favoriteControls.filter(
    (favControl) => favControl.id !== control.id
  ),
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
      favoriteControls: [],
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

      hasFavorite: (control) => {
        const { favoriteControls } = get();
        return isInFavorites(favoriteControls, control);
      },

      toggleFavorite: (control) => {
        const { favoriteControls } = get();
        const setFavorites = isInFavorites(favoriteControls, control)
          ? removeFromFavorites
          : addToFavorites;
        set((state) => setFavorites(state, control));
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
