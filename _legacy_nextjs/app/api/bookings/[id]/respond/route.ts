import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiError, bearerToken, handleError, parseJsonSafe, userClientFromToken } from '../../../_helpers';

// POST /api/bookings/:id/respond — نفس مسار respond_to_booking (تأكيد/رفض) عبر الـ API.
// الـ RPC نفسه يتحقق داخليًا أن المُنفِّذ هو مالك المعرض أو مشرف (security definer + auth.uid()).
const routeParams = z.object({ id: z.string().uuid() });
const body = z.object({ status: z.enum(['confirmed', 'rejected']) });

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = bearerToken(request);
    const { id } = routeParams.parse(params);
    const { status } = body.parse(parseJsonSafe(await request.text()));
    const { client } = await userClientFromToken(token);
    const { data, error } = await client.rpc('respond_to_booking', { p_booking_id: id, p_status: status });
    if (error) {
      const message = error.message ?? 'Booking could not be updated.';
      if (message.includes('Not authorized')) return apiError('FORBIDDEN', 403, message);
      if (message.includes('already handled')) return apiError('CONFLICT', 409, message);
      if (message.includes('Booking not found') || message.includes('not exist')) return apiError('NOT_FOUND', 404, 'Booking not found.');
      return apiError('INTERNAL', 500, message);
    }
    if (!data) return apiError('NOT_FOUND', 404, 'Booking not found.');
    return NextResponse.json({ data });
  } catch (e) {
    return handleError(e);
  }
}