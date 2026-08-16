import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { detectBot, buildTargetUrlWithParams } from '@/lib/bot-detector';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, simulatedUserAgent, headers: simHeaders = {}, queryParams = {} } = body;

    const link = slug ? storage.getLinkBySlug(slug) : null;
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
