'use server';

import { createServerClient } from '@/lib/supabase-server';
import { validateEmail, sanitizeInput } from '@/lib/validation';
import { AuthFormState } from '@/lib/types';

export async function resetPassword(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get('email') as string;

  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return { fieldErrors: { email: emailValidation.error } };
  }

  const sanitizedEmail = sanitizeInput(email);

  const supabase = await createServerClient();

  const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/update-password`,
  });

  if (error) {
    return { error: 'Something went wrong. Please try again.' };
  }

  // Always show success to prevent email enumeration
  return { success: 'If an account exists with that email, you will receive a password reset link.' };
}
