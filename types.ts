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

export interface Domain {
  id: number;
  title: string;
  shortDescription: string;
  icon: string;
  pillars: string[];
  subdomains: Topic[];
  advancedLayers?: MasteryLayer[];
  tracks?: MasteryTrack[];
  isLocked?: boolean; // For domains 11-20 not fully defined in source text
}
