import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

// ========== مساعدات مشتركة لطبقة REST API (app/api) ==========
// كل العمليات تسير عبر كلاينت publishable (بدون service role إطلاقًا) حتى تُفعَّل RLS فعليًا.

export const isConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

export class ApiError extends Error {
  constructor(public code: string, public status: number, message: string) {
    super(message);
  }
}

export function apiError(code: string, status: number, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

/** كلاينت مجهول (anon) — للقراءة العامة فقط، نفس RLS اللي بيعتمد عليها الموقع. */
export function anonClient(): SupabaseClient {
  if (!isConfigured()) throw new ApiError('CONFIG_MISSING', 503, 'Supabase is not configured on this server.');
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
}

/**
 * كلاينت مُشتق من Bearer token الخاص بالمستخدم.
 * يُمرَّر التوكن عبر خيار accessToken في كل طلب (Authorization: Bearer <token>)
 * فتصير الاستعلامات مُقيَّدة بـ RLS بهوية المستخدم نفسه — مش الـ service role.
 */
export async function userClientFromToken(accessToken: string): Promise<{ client: SupabaseClient; user: User }> {
  if (!isConfigured()) throw new ApiError('CONFIG_MISSING', 503, 'Supabase is not configured on this server.');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  const probe = createSupabaseClient(url, key);
  const { data, error } = await probe.auth.getUser(accessToken);
  if (error || !data.user) throw new ApiError('UNAUTHORIZED', 401, 'Invalid or missing authentication token.');
  const client = createSupabaseClient(url, key, { accessToken: () => Promise.resolve(accessToken) });
  return { client, user: data.user };
}

export function bearerToken(request: Request): string {
  const header = request.headers.get('authorization') ?? '';
  const [scheme, token] = header.split(' ');
  if (!/^bearer$/i.test(scheme ?? '') || !token) {
    throw new ApiError('UNAUTHORIZED', 401, 'Missing Authorization header. Send: Authorization: Bearer <access_token>.');
  }
  return token.trim();
}

export function parseJsonSafe(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError('VALIDATION', 422, 'Request body must be a valid JSON object.');
  }
}

export function formatZodError(error: ZodError): string {
  return error.issues[0]?.message ?? 'Invalid request payload.';
}

export function handleError(e: unknown): NextResponse {
  if (e instanceof ApiError) return apiError(e.code, e.status, e.message);
  if (e instanceof ZodError) return apiError('VALIDATION', 422, formatZodError(e));
  console.error(e);
  return apiError('INTERNAL', 500, 'Internal server error.');
}