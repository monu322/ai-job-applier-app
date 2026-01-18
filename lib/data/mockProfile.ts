import { UserProfile } from '../types/user.types';

export const mockProfile: UserProfile = {
  id: '1',
  name: 'Jason Mitchell',
  title: 'Product Manager',
  location: 'NYC',
  avatar: 'https://i.pravatar.cc/300?img=12',
  experience: 'Senior',
  salaryRange: {
    min: 110000,
    max: 140000,
  },
  skills: ['Product Strategy', 'Agile', 'SQL', 'User Growth'],
  resume: {
    fileName: 'Jason_Mitchell_Resume.pdf',
    uploadedAt: new Date('2026-01-15'),
  },
  marketDemand: 'high',
  globalMatches: 12400,
  confidence: 98.2,
};
