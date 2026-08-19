import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { detectBot, buildTargetUrlWithParams, decodeLinkSlug } from '@/lib/bot-detector';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, simulatedUserAgent, headers: simHeaders = {}, queryParams = {} } = body;

    let link = slug ? storage.getLinkBySlug(slug) : null;
    if (!link && slug) {
      const decoded = decodeLinkSlug(slug);
      if (decoded) {
        link = {
          id: `inspect-${slug}`,
          slug,
          title: `Active Link (${slug.substring(0, 8)})`,
          targetUrl: decoded.targetUrl,
          safePageType: decoded.safePageType || 'tech-editorial',
          redirectMethod: 'meta-refresh',
          sensitivity: 'strict-fb',
          enabled: true,
          preserveUtms: true,
          createdAt: new Date().toISOString(),
          clicks: { total: 0, human: 0, bot: 0 },
          health: { score: 100, riskLevel: 'safe', crawlerScanSurge: false, metaReviewFrequency: 'normal', recommendation: 'Optimal' },
        };
      }
    }

    const sensitivity = link ? link.sensitivity : 'strict-fb';
    const requireFbclid = link ? link.requireFbclid : false;

    const detection = detectBot(
      simulatedUserAgent || '',
      simHeaders,
      sensitivity,
      requireFbclid,
      queryParams
    );

    let destinationIfReal = '';
    if (link) {
      destinationIfReal = buildTargetUrlWithParams(link.targetUrl, queryParams, link.preserveUtms);
    }

    return NextResponse.json({
      success: true,
      detection,
      evaluatedOutcome: detection.isBot ? 'SERVE_SAFE_PAGE' : 'REDIRECT_TO_TARGET',
      safePageType: link ? link.safePageType : 'tech-editorial',
      finalDestination: detection.isBot ? null : destinationIfReal,
      targetUrlOriginal: link ? link.targetUrl : null,
      matchedLink: link ? { slug: link.slug, title: link.title } : null,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
