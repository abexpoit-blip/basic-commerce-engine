import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { ShortLink } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (Array.isArray(body.links)) {
      storage.bulkSync(body.links);
    }
    return NextResponse.json({ success: true, links: storage.getLinks() });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
