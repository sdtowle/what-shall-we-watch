'use server';

import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import { validateEmail, validatePassword, sanitizeInput } from '@/lib/validation';
import { AuthFormState } from '@/lib/types';

export async function login(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const fieldErrors: AuthFormState['fieldErrors'] = {};

  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    fieldErrors.email = emailValidation.error;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    fieldErrors.password = passwordValidation.error;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const sanitizedEmail = sanitizeInput(email);

  const supabase = await createServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: sanitizedEmail,
    password,
  });

  if (error) {
    return { error: 'Invalid email or password' };
  }

  redirect('/?loggedIn=true');
}
