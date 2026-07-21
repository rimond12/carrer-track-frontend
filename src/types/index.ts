export type ApplicationStatus = 'Saved' | 'Applied' | 'Assessment' | 'Interview' | 'Rejected' | 'Offer';
export type ApplicationSource = 'LinkedIn' | 'Bdjobs' | 'Indeed' | 'Wellfound' | 'Facebook' | 'Referral' | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface JobApplication {
  _id: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  jobUrl?: string;
  source: ApplicationSource;
  applicationDate: string;
  status: ApplicationStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  total: number;
  saved: number;
  applied: number;
  assessment: number;
  interview: number;
  rejected: number;
  offer: number;
}

export interface AIAnalysisResult {
  summary: string;
  requiredSkills: string[];
  preparationTopics: string[];
  interviewQuestions: string[];
}
