import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const deleted = storage.deleteLink(id);
  if (!deleted) {
    return NextResponse.json({ success: false, error: 'Link not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: 'Link deleted successfully' });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const existing = storage.getLinkById(id);

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Link not found' }, { status: 404 });
    }

    const updated = storage.saveLink({
      ...existing,
      ...body,
      id,
    });

    return NextResponse.json({ success: true, link: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
