import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const links = storage.getLinks();
  const logs = storage.getLogs(150);

  const totalClicks = links.reduce((sum, l) => sum + l.clicks.total, 0);
  const totalHuman = links.reduce((sum, l) => sum + l.clicks.human, 0);
  const totalBot = links.reduce((sum, l) => sum + l.clicks.bot, 0);

  const countryMap: Record<string, number> = {};
  const deviceMap: Record<string, number> = { mobile: 0, desktop: 0, tablet: 0, bot: 0 };
  const botReasonsMap: Record<string, number> = {};

  for (const log of logs) {
    if (log.country) {
      countryMap[log.country] = (countryMap[log.country] || 0) + 1;
    }
    if (log.device) {
      deviceMap[log.device] = (deviceMap[log.device] || 0) + 1;
    }
    if (log.isBot && log.detectionReasons) {
      for (const r of log.detectionReasons) {
        botReasonsMap[r] = (botReasonsMap[r] || 0) + 1;
      }
    }
  }

  return NextResponse.json({
    success: true,
    summary: {
      totalClicks,
      totalHuman,
      totalBot,
      activeLinksCount: links.filter(l => l.enabled).length,
      protectionRate: totalClicks > 0 ? Math.round((totalBot / totalClicks) * 100) : 0,
    },
    countryBreakdown: countryMap,
    deviceBreakdown: deviceMap,
    topBotReasons: botReasonsMap,
    recentLogs: logs,
  });
}
