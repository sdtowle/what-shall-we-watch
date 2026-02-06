'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { login } from './actions';
import { FormInput } from '@/components/FormInput';
import { validateEmail, validatePassword } from '@/lib/validation';
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
      {pending ? 'Logging in...' : 'Login'}
    </button>
  );
}

function SuccessMessage() {
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get('registered') === 'true';

  if (!justRegistered) return null;

  return (
    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-500 text-sm">
      Account created successfully. Please check your email to confirm your account before logging in.
    </div>
  );
}

function LoginForm() {
  const [state, formAction] = useFormState(login, initialState);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [clientErrors, setClientErrors] = useState<AuthFormState['fieldErrors']>({});

  const validateField = (field: string, value: string) => {
    const errors = { ...clientErrors };

    switch (field) {
      case 'email':
        const emailResult = validateEmail(value);
        errors.email = emailResult.valid ? undefined : emailResult.error;
        break;
      case 'password':
        const passwordResult = validatePassword(value);
        errors.password = passwordResult.valid ? undefined : passwordResult.error;
        break;
    }

    setClientErrors(errors);
  };

  const errors = { ...clientErrors, ...state.fieldErrors };

  return (
    <form action={formAction} className="space-y-4">
      <Suspense fallback={null}>
        <SuccessMessage />
      </Suspense>

      {state.error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
          {state.error}
        </div>
      )}

      <FormInput
        id="email"
        name="email"
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => validateField('email', email)}
        error={errors.email}
        autoComplete="email"
        required
      />

      <FormInput
        id="password"
        name="password"
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => validateField('password', password)}
        error={errors.password}
        autoComplete="current-password"
        required
      />

      <SubmitButton />
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-text-main text-center mb-8">
          Welcome back
        </h1>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-text-muted">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
