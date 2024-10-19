import { create } from 'zustand';

type State = object;

type Actions = object;

const useSettingsStore = create<State & Actions>((_set) => ({}));

export default useSettingsStore;
