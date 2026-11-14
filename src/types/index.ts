export type ApplicationStatus = 'Saved' | 'Applied' | 'Assessment' | 'Interview' | 'Rejected' | 'Offer';
export type ApplicationSource = string;

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Portal {
  _id: string;
  userId?: string;
  name: string;
  websiteUrl?: string;
  loginUrl?: string;
  hasAccount: boolean;
  username?: string;
  profileCompleted: number;
  resumeUploaded: boolean;
  notes?: string;
  isActive: boolean;
  order: number;
  isSystem?: boolean;
  createdAt: string;
  updatedAt: string;
  // Computed analytics
  totalApplications?: number;
  repliesCount?: number;
  interviewCount?: number;
  offerCount?: number;
  rejectionsCount?: number;
  responseRate?: number;
  interviewRate?: number;
  offerRate?: number;
  isBestPerforming?: boolean;
  noRepliesYet?: boolean;
}

export interface PortalSummaryStats {
  totalPortals: number;
  portalsWithAccount: number;
  portalsWithoutAccount: number;
  totalApplications: number;
  overallResponseRate: number;
}

export interface SourceItem {
  _id: string;
  name: string;
  websiteUrl?: string;
  isActive: boolean;
  order: number;
  isSystem?: boolean;
  inUseCount?: number;
  isInUse?: boolean;
}

export interface JobApplication {
  _id: string;
  userId: string;
  companyName: string;
  companyNormalized?: string;
  jobTitle: string;
  jobUrl?: string;
  source: string;
  portalId?: string | Portal;
  applicationDate: string;
  status: ApplicationStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TopCompanyInsight {
  companyName: string;
  count: number;
  activeCount: number;
  offerCount: number;
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
