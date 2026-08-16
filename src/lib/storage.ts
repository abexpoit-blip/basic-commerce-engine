import fs from 'fs';
import path from 'path';
import { ShortLink, TrafficLog } from './types';
import { INITIAL_LINKS, INITIAL_LOGS } from './mock-data';
import { calculateLinkHealth } from './leak-detector';

const TMP_FILE = path.join('/tmp', 'linkshield_data.json');

interface StoredData {
  links: ShortLink[];
  logs: TrafficLog[];
}

// Global in-memory cache
let globalLinks: ShortLink[] = [...INITIAL_LINKS];
let globalLogs: TrafficLog[] = [...INITIAL_LOGS];

// Load from /tmp if available
function loadPersistedData(): void {
  try {
    if (fs.existsSync(TMP_FILE)) {
      const raw = fs.readFileSync(TMP_FILE, 'utf-8');
      const data: StoredData = JSON.parse(raw);
      if (Array.isArray(data.links) && data.links.length > 0) {
        // Merge with initial links (preferring persisted)
        const map = new Map<string, ShortLink>();
        INITIAL_LINKS.forEach(l => map.set(l.slug.toLowerCase(), l));
        data.links.forEach(l => map.set(l.slug.toLowerCase(), l));
        globalLinks = Array.from(map.values());
      }
      if (Array.isArray(data.logs)) {
        globalLogs = data.logs;
      }
    }
  } catch (err) {
    // Ignore read errors in read-only environments
  }
}

// Save to /tmp
function savePersistedData(): void {
  try {
    const data: StoredData = {
      links: globalLinks,
      logs: globalLogs,
    };
    fs.writeFileSync(TMP_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // Ignore write errors
  }
}

// Initial load
loadPersistedData();

export const storage = {
  getLinks(): ShortLink[] {
    loadPersistedData();
    return globalLinks.map(l => ({
      ...l,
      health: calculateLinkHealth(l, globalLogs),
    }));
  },

  getLinkBySlug(slug: string): ShortLink | undefined {
    loadPersistedData();
    const cleanSlug = slug.toLowerCase().trim();
    const link = globalLinks.find(l => l.slug.toLowerCase() === cleanSlug && l.enabled);
    if (link) {
      return {
        ...link,
        health: calculateLinkHealth(link, globalLogs),
      };
    }
    return undefined;
  },

  getLinkById(id: string): ShortLink | undefined {
    loadPersistedData();
    const link = globalLinks.find(l => l.id === id);
    if (link) {
      return {
        ...link,
        health: calculateLinkHealth(link, globalLogs),
      };
    }
    return undefined;
  },

  saveLink(link: ShortLink): ShortLink {
    loadPersistedData();
    const idx = globalLinks.findIndex(l => l.id === link.id || l.slug.toLowerCase() === link.slug.toLowerCase());
    const linkWithHealth: ShortLink = {
      ...link,
      health: calculateLinkHealth(link, globalLogs),
    };
    
    if (idx >= 0) {
      globalLinks[idx] = linkWithHealth;
    } else {
      globalLinks.unshift(linkWithHealth);
    }

    savePersistedData();
    return linkWithHealth;
  },

  bulkSync(links: ShortLink[]): void {
    loadPersistedData();
    const map = new Map<string, ShortLink>();
    globalLinks.forEach(l => map.set(l.slug.toLowerCase(), l));
    links.forEach(l => map.set(l.slug.toLowerCase(), l));
    globalLinks = Array.from(map.values());
    savePersistedData();
  },

  deleteLink(id: string): boolean {
    loadPersistedData();
    const initialLen = globalLinks.length;
    globalLinks = globalLinks.filter(l => l.id !== id);
    savePersistedData();
    return globalLinks.length < initialLen;
  },

  recordClick(linkId: string, isBot: boolean, log: Omit<TrafficLog, 'id'>): void {
    loadPersistedData();
    const link = globalLinks.find(l => l.id === linkId);
    if (link) {
      link.clicks.total += 1;
      if (isBot) {
        link.clicks.bot += 1;
      } else {
        link.clicks.human += 1;
      }
    }

    const newLog: TrafficLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };

    globalLogs.unshift(newLog);
    if (globalLogs.length > 500) {
      globalLogs = globalLogs.slice(0, 500);
    }

    if (link) {
      link.health = calculateLinkHealth(link, globalLogs);
    }

    savePersistedData();
  },

  getLogs(limit = 100): TrafficLog[] {
    loadPersistedData();
    return globalLogs.slice(0, limit);
  },

  resetDefaults(): void {
    globalLinks = [...INITIAL_LINKS];
    globalLogs = [...INITIAL_LOGS];
    savePersistedData();
  }
};
