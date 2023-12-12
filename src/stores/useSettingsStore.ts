import { create } from 'zustand';

type State = object;

type Actions = object;

const useSettingsStore = create<State & Actions>((set) => ({}));

export default useSettingsStore;
