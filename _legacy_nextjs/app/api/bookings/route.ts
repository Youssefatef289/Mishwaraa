import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiError, bearerToken, handleError, parseJsonSafe, userClientFromToken } from '../_helpers';
import { createBookingFor } from '@/lib/booking-core';

// POST /api/bookings — إنشاء حجز عبر نفس المسار المُتحقق منه في createBooking (lib/booking-core)،
// لكن بكلاينت مُشتق من Bearer token المستخدم، فتمر عبر RLS بدل الـ service role.
const body = z.object({
  carId: z.string().uuid(),
  destination: z.string().trim().min(2).max(100),
  days: z.number().int().min(1).max(90),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid start date (YYYY-MM-DD).'),
  terms: z.literal(true),
});

export async function POST(request: Request) {
  try {
    const token = bearerToken(request);
    const payload = body.parse(parseJsonSafe(await request.text()));
    const { client, user } = await userClientFromToken(token);
    try {
      const created = await createBookingFor(client, user, payload);
      return NextResponse.json({ data: created }, { status: 201 });
    } catch (bookingError) {
      const message = bookingError instanceof Error ? bookingError.message : String(bookingError);
      if (message.includes('no longer available')) return apiError('CAR_UNAVAILABLE', 403, 'This car is no longer available.');
      if (message.includes('terms') || message.includes('valid destination') || message.includes('duration') || message.includes('start date')) {
        return apiError('VALIDATION', 422, message);
      }
      throw bookingError;
    }
  } catch (e) {
    return handleError(e);
  }
}