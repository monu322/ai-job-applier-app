export interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  remote: boolean;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  visaSponsored: boolean;
  matchScore: number;
  tags: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  posted: Date;
  experience: string;
  industry: string;
}

export interface Application {
  id: string;
  jobId: string;
  status: 'processing' | 'applied' | 'interview' | 'review' | 'rejected' | 'queued';
  appliedAt: Date;
  aiScore: number;
  progress?: number;
}

export type ViewMode = 'swipe' | 'list';
