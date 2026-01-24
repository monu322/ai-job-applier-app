export interface WorkHistoryItem {
  company: string;
  position: string;
  duration?: string;
  description?: string;
  achievements?: string[];
  start_date?: string;
  end_date?: string;
  skills?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  location: string;
  avatar: string;
  experience: string;
  salaryRange: {
    min: number;
    max: number;
  };
  skills: string[];
  resume?: {
    fileName: string;
    uploadedAt: Date;
  };
  marketDemand: 'low' | 'medium' | 'high';
  globalMatches: number;
  confidence: number;
  email?: string;
  phone?: string;
  summary?: string;
  roles?: string[];
  jobSearchLocation?: string;
  education?: string;
  workHistory?: WorkHistoryItem[];
}
