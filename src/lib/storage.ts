import { ShortLink, TrafficLog } from './types';
import { INITIAL_LINKS, INITIAL_LOGS } from './mock-data';
import { calculateLinkHealth } from './leak-detector';

let globalLinks: ShortLink[] = [...INITIAL_LINKS];
let globalLogs: TrafficLog[] = [...INITIAL_LOGS];

export const storage = {
  getLinks(): ShortLink[] {
    return globalLinks.map(l => ({
      ...l,
      health: calculateLinkHealth(l, globalLogs),
    }));
  },

  getLinkBySlug(slug: string): ShortLink | undefined {
    const link = globalLinks.find(l => l.slug.toLowerCase() === slug.toLowerCase() && l.enabled);
    if (link) {
      return {
        ...link,
        health: calculateLinkHealth(link, globalLogs),
      };
    }
    return undefined;
  },

  getLinkById(id: string): ShortLink | undefined {
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
    const idx = globalLinks.findIndex(l => l.id === link.id);
    const linkWithHealth: ShortLink = {
      ...link,
      health: calculateLinkHealth(link, globalLogs),
    };
    if (idx >= 0) {
      globalLinks[idx] = linkWithHealth;
    } else {
      globalLinks.unshift(linkWithHealth);
    }
    return linkWithHealth;
  },

  deleteLink(id: string): boolean {
    const initialLen = globalLinks.length;
    globalLinks = globalLinks.filter(l => l.id !== id);
    return globalLinks.length < initialLen;
  },

  recordClick(linkId: string, isBot: boolean, log: Omit<TrafficLog, 'id'>): void {
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

    // Refresh health for affected link
    if (link) {
      link.health = calculateLinkHealth(link, globalLogs);
    }
  },

  getLogs(limit = 100): TrafficLog[] {
    return globalLogs.slice(0, limit);
  },

  resetDefaults(): void {
    globalLinks = [...INITIAL_LINKS];
    globalLogs = [...INITIAL_LOGS];
  }
};
