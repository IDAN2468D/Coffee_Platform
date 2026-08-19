import { create } from 'zustand';
import { VoiceRouteTarget, VOICE_NAV_ROUTES, matchVoiceNavigationCommand } from '../voice/voiceNavigationMatcher';

interface VoiceAssistantState {
  isListening: boolean;
  isSearchModalOpen: boolean;
  transcript: string;
  matchedRoute: VoiceRouteTarget | null;
  statusMessage: string;
  commandHistory: string[];

  // Actions
  startListening: () => void;
  stopListening: () => void;
  setTranscript: (text: string) => void;
  setMatchedRoute: (route: VoiceRouteTarget | null) => void;
  setStatusMessage: (msg: string) => void;
  openSearchModal: () => void;
  closeSearchModal: () => void;
  toggleListening: () => void;
  resetVoiceState: () => void;
}

export const useVoiceAssistantStore = create<VoiceAssistantState>((set, get) => ({
  isListening: false,
  isSearchModalOpen: false,
  transcript: '',
  matchedRoute: null,
  statusMessage: 'הקשב לפקודה: "קח אותי לקטלוג", "שעון קפאין", "מעבדת מים"...',
  commandHistory: [],

  startListening: () => set({ isListening: true, transcript: '', statusMessage: 'מקשיב לך עכשיו...' }),
  stopListening: () => set({ isListening: false }),
  setTranscript: (text: string) => {
    const matched = matchVoiceNavigationCommand(text);
    set({
      transcript: text,
      matchedRoute: matched,
      statusMessage: matched ? `זוהתה פקודה: ${matched.label}` : 'מעבד פקודה...',
    });
  },
  setMatchedRoute: (route) => set({ matchedRoute: route }),
  setStatusMessage: (msg) => set({ statusMessage: msg }),
  openSearchModal: () => set({ isSearchModalOpen: true }),
  closeSearchModal: () => set({ isSearchModalOpen: false, transcript: '' }),
  toggleListening: () => {
    const { isListening, startListening, stopListening } = get();
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  },
  resetVoiceState: () =>
    set({
      isListening: false,
      transcript: '',
      matchedRoute: null,
      statusMessage: 'הקשב לפקודה: "קח אותי לקטלוג", "שעון קפאין", "מעבדת מים"...',
    }),
}));
