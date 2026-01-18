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
}
