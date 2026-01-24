import { create } from 'zustand';
import { UserProfile } from '../types/user.types';
import { mockProfile } from '../data/mockProfile';

interface UserState {
  masterUser: UserProfile | null; // The actual account owner
  personas: UserProfile[];
  activePersonaId: string | null;
  isOnboarded: boolean;
  setMasterUser: (user: UserProfile) => void;
  addPersona: (profile: UserProfile) => void;
  setPersonas: (personas: UserProfile[]) => void;
  setActivePersona: (id: string) => void;
  setOnboarded: (value: boolean) => void;
  updatePersona: (id: string, updates: Partial<UserProfile>) => void;
  getActivePersona: () => UserProfile | null;
  clearPersonas: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  masterUser: null,
  personas: [],
  activePersonaId: null,
  isOnboarded: false,
  setMasterUser: (user) => set({ masterUser: user }),
  addPersona: (profile) =>
    set((state) => ({
      personas: [...state.personas, profile],
      activePersonaId: state.activePersonaId || profile.id,
    })),
  setPersonas: (personas) =>
    set((state) => ({
      personas,
      activePersonaId: personas.length > 0 ? (state.activePersonaId || personas[0].id) : null,
      isOnboarded: personas.length > 0,
    })),
  setActivePersona: (id) => set({ activePersonaId: id }),
  setOnboarded: (value) => set({ isOnboarded: value }),
  updatePersona: (id, updates) =>
    set((state) => ({
      personas: state.personas.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),
  getActivePersona: () => {
    const state = get();
    return state.personas.find((p) => p.id === state.activePersonaId) || null;
  },
  clearPersonas: () => set({ personas: [], activePersonaId: null, isOnboarded: false }),
}));

// Helper function to initialize mock personas
export const initializeMockProfile = () => {
  const store = useUserStore.getState();
  if (store.personas.length === 0) {
    // Set master user
    store.setMasterUser(mockProfile);
    
    // Add personas
    store.addPersona(mockProfile);
    store.addPersona({
      ...mockProfile,
      id: '2',
      name: 'Sarah Chen',
      title: 'UX Designer',
      avatar: 'https://i.pravatar.cc/300?img=47',
      experience: 'Mid-Level',
      skills: ['UI/UX', 'Figma', 'User Research', 'Prototyping'],
      salaryRange: { min: 90000, max: 120000 },
      globalMatches: 8200,
      confidence: 94.5,
    });
  }
  store.setOnboarded(true);
};
