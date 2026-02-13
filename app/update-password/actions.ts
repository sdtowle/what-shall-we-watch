'use server';

import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import { validatePassword } from '@/lib/validation';
import { AuthFormState } from '@/lib/types';

export async function updatePassword(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return { fieldErrors: { password: passwordValidation.error } };
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' };
  }

  const supabase = await createServerClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: 'Failed to update password. Please try again.' };
  }

  redirect('/login?passwordReset=true');
}
