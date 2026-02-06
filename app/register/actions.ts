'use server';

import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import { validateEmail, validateName, validatePassword, sanitizeInput } from '@/lib/validation';
import { AuthFormState } from '@/lib/types';

export async function register(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const fieldErrors: AuthFormState['fieldErrors'] = {};

  const firstNameValidation = validateName(firstName, 'First name');
  if (!firstNameValidation.valid) {
    fieldErrors.firstName = firstNameValidation.error;
  }

  const lastNameValidation = validateName(lastName, 'Last name');
  if (!lastNameValidation.valid) {
    fieldErrors.lastName = lastNameValidation.error;
  }

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

  const sanitizedFirstName = sanitizeInput(firstName, 50);
  const sanitizedLastName = sanitizeInput(lastName, 50);
  const sanitizedEmail = sanitizeInput(email);

  const supabase = await createServerClient();

  const { error } = await supabase.auth.signUp({
    email: sanitizedEmail,
    password,
    options: {
      data: {
        first_name: sanitizedFirstName,
        last_name: sanitizedLastName,
      },
    },
  });

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'An account with this email already exists' };
    }
    return { error: 'Something went wrong. Please try again.' };
  }

  redirect('/login?registered=true');
}
