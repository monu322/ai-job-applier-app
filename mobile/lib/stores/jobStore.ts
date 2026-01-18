import { create } from 'zustand';
import { Job, Application, ViewMode } from '../types/job.types';
import { mockJobs } from '../data/mockJobs';

interface JobState {
  jobs: Job[];
  applications: Application[];
  viewMode: ViewMode;
  currentJobIndex: number;
  setJobs: (jobs: Job[]) => void;
  setViewMode: (mode: ViewMode) => void;
  addApplication: (application: Application) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  nextJob: () => void;
  likeJob: (jobId: string) => void;
  skipJob: (jobId: string) => void;
}

export const useJobStore = create<JobState>((set) => ({
  jobs: mockJobs,
  applications: [],
  viewMode: 'swipe',
  currentJobIndex: 0,
  setJobs: (jobs) => set({ jobs }),
  setViewMode: (mode) => set({ viewMode: mode }),
  addApplication: (application) =>
    set((state) => ({
      applications: [...state.applications, application],
    })),
  updateApplication: (id, updates) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, ...updates } : app
      ),
    })),
  nextJob: () =>
    set((state) => ({
      currentJobIndex: Math.min(state.currentJobIndex + 1, state.jobs.length - 1),
    })),
  likeJob: (jobId) => {
    set((state) => ({
      currentJobIndex: state.currentJobIndex + 1,
    }));
  },
  skipJob: (jobId) => {
    set((state) => ({
      currentJobIndex: state.currentJobIndex + 1,
    }));
  },
}));
