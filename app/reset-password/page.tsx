'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from './actions';
import { FormInput } from '@/components/FormInput';
import { validateEmail } from '@/lib/validation';
import { AuthFormState } from '@/lib/types';

const initialState: AuthFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2 px-4 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-medium rounded-lg transition-colors"
    >
      {pending ? 'Sending...' : 'Send reset link'}
    </button>
  );
}

export default function ResetPasswordPage() {
  const [state, formAction] = useFormState(resetPassword, initialState);
  const [email, setEmail] = useState('');
  const [clientErrors, setClientErrors] = useState<AuthFormState['fieldErrors']>({});

  const errors = { ...clientErrors, ...state.fieldErrors };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-text-main text-center mb-2">
          Reset your password
        </h1>
        <p className="text-text-muted text-sm text-center mb-8">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>

        <form action={formAction} className="space-y-4">
          {state.error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
              {state.error}
            </div>
          )}

          {state.success && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-500 text-sm">
              {state.success}
            </div>
          )}

          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => {
              const result = validateEmail(email);
              setClientErrors({ email: result.valid ? undefined : result.error });
            }}
            error={errors.email}
            autoComplete="email"
            required
          />

          <SubmitButton />
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Remember your password?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
