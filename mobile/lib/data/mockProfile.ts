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
  email: 'jason.mitchell@email.com',
  phone: '+1 (555) 123-4567',
  summary: 'Results-driven Product Manager with 8+ years of experience leading cross-functional teams to deliver innovative products. Proven track record of driving user growth and improving product metrics through data-driven decision making.',
  roles: ['Product Manager', 'Senior Product Manager', 'Lead Product Manager', 'Director of Product'],
  jobSearchLocation: 'New York, NY',
  education: 'MBA in Business Administration, Stanford University',
  workHistory: [
    {
      company: 'TechCorp Inc',
      position: 'Senior Product Manager',
      start_date: '2020-06',
      end_date: 'Present',
      duration: '3.5 years',
      achievements: [
        'Led product development for flagship SaaS platform serving 100K+ users',
        'Increased user engagement by 45% through data-driven feature optimization',
        'Managed cross-functional team of 12 engineers, designers, and analysts',
        'Drove $5M in annual recurring revenue through strategic product launches'
      ],
      skills: ['Product Strategy', 'Agile', 'SQL', 'A/B Testing', 'User Analytics']
    },
    {
      company: 'StartupHub',
      position: 'Product Manager',
      start_date: '2018-03',
      end_date: '2020-05',
      duration: '2 years',
      achievements: [
        'Built MVP that achieved product-market fit within 6 months',
        'Grew user base from 0 to 50,000 users in first year',
        'Implemented customer feedback loop resulting in 30% increase in retention',
        'Collaborated with sales team to close enterprise deals worth $2M+'
      ],
      skills: ['Product Development', 'User Research', 'Roadmap Planning', 'Jira']
    },
    {
      company: 'Digital Solutions Ltd',
      position: 'Associate Product Manager',
      start_date: '2016-01',
      end_date: '2018-02',
      duration: '2 years',
      achievements: [
        'Assisted in launching 3 major product features used by 200K+ users',
        'Conducted user interviews and usability testing sessions',
        'Created product documentation and user stories for development team'
      ],
      skills: ['Agile', 'Scrum', 'Wireframing', 'User Stories']
    }
  ]
};
