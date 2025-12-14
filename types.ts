export interface RepoMetadata {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
  default_branch: string;
}

export interface FileNode {
  path: string;
  type: 'file' | 'dir';
}

export interface RepoContext {
  metadata: RepoMetadata;
  files: string[]; // List of file paths
  readmeContent: string | null;
  packageJsonContent: string | null;
  languages: Record<string, number>;
}

export interface RoadmapItem {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  category: 'Structure' | 'Documentation' | 'Testing' | 'Best Practices' | 'CI/CD';
}

export interface AnalysisResult {
  score: number; // 0-100
  summary: string;
  roadmap: RoadmapItem[];
  strengths: string[];
  weaknesses: string[];
  ratings: {
    codeQuality: number;
    documentation: number;
    maintainability: number;
    testing: number;
    structure: number;
  };
}

export enum AnalysisState {
  IDLE,
  FETCHING_REPO,
  ANALYZING_AI,
  COMPLETE,
  ERROR
}