import { LinkHealth, LeakRiskLevel, TrafficLog, ShortLink } from './types';

export function calculateLinkHealth(link: Partial<ShortLink>, logs: TrafficLog[] = []): LinkHealth {
  const linkLogs = logs.filter(l => l.linkId === link.id || l.slug === link.slug);
  const total = link.clicks?.total || linkLogs.length || 0;
  const bots = link.clicks?.bot || linkLogs.filter(l => l.isBot).length || 0;
  
  // Calculate crawler scan velocity in the last 15 minutes
  const now = Date.now();
  const recentLogs = linkLogs.filter(l => now - new Date(l.timestamp).getTime() < 15 * 60 * 1000);
  const recentBots = recentLogs.filter(l => l.isBot).length;

  let score = 98;
  let riskLevel: LeakRiskLevel = 'safe';
  let metaReviewFrequency: 'normal' | 'elevated' | 'critical-surge' = 'normal';
  let crawlerScanSurge = false;
  let recommendation = '🟢 Link Armor Active. Real traffic routing at 100% efficiency with zero drop.';

  // If recent bot surge is detected
  if (recentBots >= 5) {
    crawlerScanSurge = true;
    metaReviewFrequency = 'critical-surge';
    score = Math.max(48, score - 45);
    riskLevel = 'high-risk';
    recommendation = '🚨 High Meta Review Surge: Multiple crawler nodes inspecting link. Keep Safe Page active or rotate slug.';
  } else if (recentBots >= 2 || (total > 0 && bots / total > 0.35)) {
    metaReviewFrequency = 'elevated';
    score = Math.max(74, score - 20);
    riskLevel = 'moderate-risk';
    recommendation = '⚠️ Elevated Meta Review Activity: Policy bots inspected link. Reviewers successfully received White Page.';
  } else if (recentBots === 1) {
    score = 92;
    riskLevel = 'low-risk';
    recommendation = '🛡️ Periodic Meta Health Ping detected and filtered. Campaign running stable.';
  }

  // If strict settings are enabled, bonus protection
  if (link.sensitivity === 'paranoid' || link.requireFbclid) {
    score = Math.min(100, score + 4);
  }

  return {
    score,
    riskLevel,
    crawlerScanSurge,
    metaReviewFrequency,
    lastCrawlerAudit: linkLogs.find(l => l.isBot)?.timestamp,
    recommendation,
  };
}
