import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ApiError, anonClient, apiError, handleError, parseJsonSafe } from '../_helpers';
import { calculateQuote } from '@/lib/booking-core';

// POST /api/quote — يحسب الاقتباس بنفس منطق calculateQuote في app/actions.ts (مستخرج في lib/booking-core).
const body = z.object({
  carId: z.string().uuid(),
  destinationCity: z.string().trim().min(2).max(100),
  days: z.number().int().min(1).max(90),
});

export async function POST(request: Request) {
  try {
    const payload = body.parse(parseJsonSafe(await request.text()));
    const s = anonClient();
    const { data: car, error } = await s
      .from('cars')
      .select('*,dealers!inner(city,status)')
      .eq('id', payload.carId)
      .eq('status', 'available')
      .eq('dealers.status', 'approved')
      .single();
    if (error || !car) throw new ApiError('CAR_NOT_FOUND', 404, 'Car not found or not available.');
    const dealer = car.dealers as { city: string };
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      return apiError('SERVICE_UNAVAILABLE', 503, 'Distance service is not configured on this server.');
    }
    const { distanceKm, totalPrice } = await calculateQuote(dealer.city, payload.destinationCity, payload.days, Number(car.price_per_day), Number(car.extra_per_km));
    return NextResponse.json({
      data: { distanceKm, totalPrice, pricePerDay: Number(car.price_per_day), extraPerKm: Number(car.extra_per_km) },
    });
  } catch (e) {
    return handleError(e);
  }
}