import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { ShortLink } from '@/lib/types';
import { calculateLinkHealth } from '@/lib/leak-detector';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const links = storage.getLinks();
  return NextResponse.json({ success: true, links });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.slug || !body.targetUrl) {
      return NextResponse.json(
        { success: false, error: 'Slug and Target URL are required' },
        { status: 400 }
      );
    }

    const cleanSlug = body.slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    
    // Check if slug already taken by another link
    const existing = storage.getLinkBySlug(cleanSlug);
    if (existing && existing.id !== body.id) {
      return NextResponse.json(
        { success: false, error: `Slug "${cleanSlug}" is already in use.` },
        { status: 409 }
      );
    }

    const newLink: ShortLink = {
      id: body.id || `link-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      slug: cleanSlug,
      title: body.title || cleanSlug,
      targetUrl: body.targetUrl.trim(),
      safePageType: body.safePageType || 'tech-editorial',
      customSafeUrl: body.customSafeUrl?.trim() || undefined,
      redirectMethod: body.redirectMethod || 'meta-refresh',
      sensitivity: body.sensitivity || 'strict-fb',
      enabled: body.enabled !== undefined ? body.enabled : true,
      allowedCountries: body.allowedCountries || [],
      allowedDevices: body.allowedDevices || ['mobile', 'desktop', 'tablet'],
      requireFbclid: Boolean(body.requireFbclid),
      preserveUtms: body.preserveUtms !== undefined ? body.preserveUtms : true,
      notes: body.notes || '',
      createdAt: body.createdAt || new Date().toISOString(),
      clicks: body.clicks || { total: 0, human: 0, bot: 0 },
      health: calculateLinkHealth(body),
    };

    const saved = storage.saveLink(newLink);
    return NextResponse.json({ success: true, link: saved });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to save link' },
      { status: 500 }
    );
  }
}
