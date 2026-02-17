export interface Topic {
  title: string;
  points: string[];
}

export interface MasteryLayer {
  name: string;
  description: string;
}

export interface MasteryTrack {
  name: string;
  description: string;
  includes?: string;
}

export interface Resource {
  title: string;
  author: string;
}

export interface Domain {
  id: number;
  title: string;
  shortDescription: string;
  icon: string;
  pillars: string[];
  subdomains: Topic[];
  advancedLayers?: MasteryLayer[];
  tracks?: MasteryTrack[];
  resources?: Resource[];
  isLocked?: boolean;
}

export interface Quote {
  text: string;
  author: string;
  domain: string;
}

export interface DomainConnection {
  from: number;
  to: number;
}

export interface ArenaQuestion {
  id: string;
  domain: number;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  relatedDomain?: number;
}

export interface GrimoireNote {
  id: string;
  title: string;
  domain: number;
  subjects: string[];
  body: string;
  masteryLevel: 1 | 2 | 3 | 4 | 5;
  created: string;
  lastEdited: string;
  wordCount: number;
  tags: string[];
}
