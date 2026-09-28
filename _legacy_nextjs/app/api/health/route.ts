import { NextResponse } from 'next/server';
import { anonClient } from '../_helpers';

// GET /api/health — فحص حيوية اتصال Supabase (استعلام تافه)، بدون تسجيل دخول.
export async function GET() {
  try {
    const s = anonClient();
    const { count, error } = await s.from('dealers').select('id', { head: true, count: 'exact' });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true, db: 'connected', timestamp: new Date().toISOString() });
  } catch (e) {
    console.error(e);
    const message = e instanceof Error ? e.message : 'Supabase connection failed.';
    return NextResponse.json({ ok: false, error: { code: 'DB_UNREACHABLE', message } }, { status: 500 });
  }
}