import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiError, bearerToken, handleError, userClientFromToken } from '../../_helpers';

// GET /api/bookings/:id — حجز واحد فقط لأطرافه (RLS).
// مَن ليس طرفًا يرى نفس استجابة "غير موجود" (404) — لا نفوّت وجود السجل بفارق 403.
const routeParams = z.object({ id: z.string().uuid() });

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = bearerToken(request);
    const { id } = routeParams.parse(params);
    const { client } = await userClientFromToken(token);
    const { data, error } = await client
      .from('bookings')
      .select('*,cars(name),dealers(name)')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return apiError('NOT_FOUND', 404, 'Booking not found.');
    return NextResponse.json({ data });
  } catch (e) {
    return handleError(e);
  }
}