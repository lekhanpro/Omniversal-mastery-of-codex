import { domains } from '../data';
import { Domain } from '../types';

export const ACTIVE_DOMAIN_COUNT = 17;
export const masteryDomains: Domain[] = domains.slice(0, ACTIVE_DOMAIN_COUNT);

export const DOMAIN_COLORS: Record<number, string> = {
  1: '#4488ff',
  2: '#00ccaa',
  3: '#aa44ff',
  4: '#ff6644',
  5: '#ffcc44',
  6: '#44ff88',
  7: '#ff44aa',
  8: '#88ff44',
  9: '#ff8844',
  10: '#44aaff',
  11: '#65d4ff',
  12: '#9d7dff',
  13: '#ff79d7',
  14: '#ffd166',
  15: '#7df9c1',
  16: '#ff9f7a',
  17: '#9ad1ff',
};

export type ActivityType =
  | 'subject'
  | 'quiz'
  | 'note'
  | 'project'
  | 'resource'
  | 'oracle'
  | 'map'
  | 'roadmap';

export interface ActivityLogEntry {
  id: string;
  timestamp: number;
  date: string;
  type: ActivityType;
  domainIds: number[];
  message: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface DomainProgress {
  domainId: number;
  checked: number;
  total: number;
  completion: number;
}

export interface SharePayload {
  createdAt: number;
  checked: Record<string, string>;
}

export interface AggregatedMasteryData {
  completionByDomain: DomainProgress[];
  totalSubjects: number;
  checkedSubjects: number;
  avgCompletion: number;
  totalHoursLogged: number;
  quizCount: number;
  noteCount: number;
  resourceCount: number;
  projectCount: number;
  currentStreak: number;
  lastActivityAt: number | null;
  domainActivityScore: Record<number, number>;
}

export const CODEX_ACTIVITY_KEY = 'codex_activity_log';
const SHARE_PARAM = 'share';

export const safeParseJSON = <T>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const uid = (prefix: string): string =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const getDomainById = (domainId: number): Domain | undefined =>
  masteryDomains.find((domain) => domain.id === domainId);

export const getDomainSubjectKeys = (domainId: number): string[] => {
  const domain = getDomainById(domainId);
  if (!domain) return [];
  const keys: string[] = [];
  domain.subdomains.forEach((subdomain, subdomainIndex) => {
    subdomain.points.forEach((_, pointIndex) => {
      keys.push(`codex_d${domainId}_s${subdomainIndex}_p${pointIndex}`);
    });
  });
  return keys;
};

export const getDomainProgress = (
  domainId: number,
  readOnlyProgress?: Record<string, string>
): DomainProgress => {
  const keys = getDomainSubjectKeys(domainId);
  const checked = keys.reduce((count, key) => {
    const stored = readOnlyProgress ? readOnlyProgress[key] : localStorage.getItem(key);
    return stored === 'true' ? count + 1 : count;
  }, 0);
  const total = keys.length;
  return {
    domainId,
    checked,
    total,
    completion: total > 0 ? (checked / total) * 100 : 0,
  };
};

export const getAllDomainProgress = (
  readOnlyProgress?: Record<string, string>
): DomainProgress[] =>
  masteryDomains.map((domain) => getDomainProgress(domain.id, readOnlyProgress));

export const getAllSubjectSnapshot = (): Record<string, string> => {
  const snapshot: Record<string, string> = {};
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key || !/^codex_d\d+_s\d+_p\d+$/.test(key)) continue;
    const value = localStorage.getItem(key);
    if (value === 'true') snapshot[key] = 'true';
  }
  return snapshot;
};

export const encodeSharePayload = (): string => {
  const payload: SharePayload = {
    createdAt: Date.now(),
    checked: getAllSubjectSnapshot(),
  };
  return window.btoa(JSON.stringify(payload));
};

export const decodeSharePayload = (encoded: string | null): SharePayload | null => {
  if (!encoded) return null;
  try {
    const decoded = window.atob(encoded);
    const parsed = JSON.parse(decoded) as SharePayload;
    if (!parsed || typeof parsed !== 'object' || !parsed.checked) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const getShareParam = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get(SHARE_PARAM);
};

export const withShareParam = (encoded: string): string => {
  const hash = window.location.hash || '#/';
  return `${window.location.origin}${window.location.pathname}?${SHARE_PARAM}=${encodeURIComponent(encoded)}${hash}`;
};

export const readActivityLog = (): ActivityLogEntry[] =>
  safeParseJSON<ActivityLogEntry[]>(localStorage.getItem(CODEX_ACTIVITY_KEY), []);

export const writeActivityLog = (entries: ActivityLogEntry[]): void => {
  localStorage.setItem(CODEX_ACTIVITY_KEY, JSON.stringify(entries.slice(-730)));
};

export const appendActivity = (
  type: ActivityType,
  domainIds: number[],
  message: string,
  metadata?: Record<string, string | number | boolean>
): ActivityLogEntry => {
  const now = Date.now();
  const entry: ActivityLogEntry = {
    id: uid('activity'),
    timestamp: now,
    date: new Date(now).toISOString().slice(0, 10),
    type,
    domainIds,
    message,
    metadata,
  };
  const existing = readActivityLog();
  existing.push(entry);
  writeActivityLog(existing);
  return entry;
};

export const readLS = <T>(key: string, fallback: T): T =>
  safeParseJSON<T>(localStorage.getItem(key), fallback);

export const writeLS = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getCurrentStreakFromActivity = (): number => {
  const entries = readActivityLog();
  if (entries.length === 0) return 0;

  const uniqueDays = new Set(entries.map((entry) => entry.date));
  const sortedDays = [...uniqueDays].sort();

  let streak = 0;
  let cursor = new Date();
  while (true) {
    const iso = cursor.toISOString().slice(0, 10);
    if (sortedDays.includes(iso)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }
    if (streak === 0) {
      cursor.setDate(cursor.getDate() - 1);
      const yesterdayIso = cursor.toISOString().slice(0, 10);
      if (sortedDays.includes(yesterdayIso)) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
        continue;
      }
    }
    break;
  }
  return streak;
};

export const getMasteryData = (
  readOnlyProgress?: Record<string, string>
): AggregatedMasteryData => {
  const completionByDomain = getAllDomainProgress(readOnlyProgress);
  const totalSubjects = completionByDomain.reduce((sum, domain) => sum + domain.total, 0);
  const checkedSubjects = completionByDomain.reduce((sum, domain) => sum + domain.checked, 0);
  const avgCompletion =
    completionByDomain.reduce((sum, domain) => sum + domain.completion, 0) /
    Math.max(1, completionByDomain.length);

  const arenaResults = readLS<Array<{ score: number; total: number }>>('arena_results', []);
  const grimoireNotes = readLS<Array<{ id: string; domain?: number; wordCount?: number }>>('grimoire_notes', []);
  const resources = readLS<Array<{ id: string; domains?: number[]; difficulty?: number; progress?: number }>>(
    'observatory_resources',
    []
  );
  const projects = readLS<Array<{ id: string; domains?: number[]; difficulty?: number; progress?: number }>>(
    'forge_projects',
    []
  );
  const activities = readActivityLog();

  const domainActivityScore: Record<number, number> = {};
  masteryDomains.forEach((domain) => {
    domainActivityScore[domain.id] = 0;
  });
  activities.forEach((activity) => {
    activity.domainIds.forEach((domainId) => {
      if (domainActivityScore[domainId] !== undefined) {
        domainActivityScore[domainId] += 1;
      }
    });
  });

  const noteHours = grimoireNotes.reduce((sum, note) => sum + Math.max(0.15, (note.wordCount ?? 0) / 220), 0);
  const resourceHours = resources.reduce(
    (sum, resource) => sum + ((resource.progress ?? 0) / 100) * Math.max(0.4, (resource.difficulty ?? 3) * 0.8),
    0
  );
  const projectHours = projects.reduce(
    (sum, project) => sum + ((project.progress ?? 0) / 100) * Math.max(1.2, (project.difficulty ?? 3) * 2.2),
    0
  );
  const quizHours = arenaResults.length * 0.25;
  const totalHoursLogged = Math.round((noteHours + resourceHours + projectHours + quizHours) * 10) / 10;

  return {
    completionByDomain,
    totalSubjects,
    checkedSubjects,
    avgCompletion,
    totalHoursLogged,
    quizCount: arenaResults.length,
    noteCount: grimoireNotes.length,
    resourceCount: resources.length,
    projectCount: projects.length,
    currentStreak: getCurrentStreakFromActivity(),
    lastActivityAt: activities.length > 0 ? activities[activities.length - 1].timestamp : null,
    domainActivityScore,
  };
};

export const getHumanDomainName = (domainId: number): string =>
  getDomainById(domainId)?.title ?? `Domain ${domainId}`;

export const calculateReadTime = (wordCount: number): number => Math.max(1, Math.ceil(wordCount / 220));

export const lightenColor = (hexColor: string, factor = 0.35): string => {
  const hex = hexColor.replace('#', '');
  const fullHex = hex.length === 3 ? hex.split('').map((char) => `${char}${char}`).join('') : hex;
  const value = Number.parseInt(fullHex, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  const mixed = (channel: number) => Math.round(channel + (255 - channel) * factor);
  return `rgb(${mixed(red)}, ${mixed(green)}, ${mixed(blue)})`;
};
