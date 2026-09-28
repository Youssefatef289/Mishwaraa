import { NextResponse } from 'next/server';
import { z } from 'zod';
import { anonClient, handleError } from '../_helpers';

// GET /api/cars?city=&type= — السيارات المتاحة من معارض معتمدة (نفس شكل صفحة /cars)، قراءة عامة.
const query = z.object({
  city: z.string().trim().min(2).max(100).optional(),
  type: z.enum(['economy', 'family', 'suv', 'luxury', 'minibus']).optional(),
});

export async function GET(request: Request) {
  try {
    const parsed = query.parse(Object.fromEntries(new URL(request.url).searchParams));
    const s = anonClient();
    let q = s
      .from('cars')
      .select('*,dealers!inner(name,city,status)')
      .eq('status', 'available')
      .eq('dealers.status', 'approved');
    if (parsed.city) q = q.eq('dealers.city', parsed.city);
    if (parsed.type) q = q.eq('type', parsed.type);
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return NextResponse.json({ data: data ?? [] });
  } catch (e) {
    return handleError(e);
  }
}