'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useState } from 'react';
import Link from 'next/link';
import { register } from './actions';
import { FormInput } from '@/components/FormInput';
import { validateEmail, validateName, validatePassword } from '@/lib/validation';
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
      {pending ? 'Creating account...' : 'Register'}
    </button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useFormState(register, initialState);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [clientErrors, setClientErrors] = useState<AuthFormState['fieldErrors']>({});

  const validateField = (field: string, value: string) => {
    const errors = { ...clientErrors };

    switch (field) {
      case 'firstName':
        const firstNameResult = validateName(value, 'First name');
        errors.firstName = firstNameResult.valid ? undefined : firstNameResult.error;
        break;
      case 'lastName':
        const lastNameResult = validateName(value, 'Last name');
        errors.lastName = lastNameResult.valid ? undefined : lastNameResult.error;
        break;
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-text-main text-center mb-8">
          Create an account
        </h1>

        <form action={formAction} className="space-y-4">
          {state.error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
              {state.error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              id="firstName"
              name="firstName"
              type="text"
              label="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => validateField('firstName', firstName)}
              error={errors.firstName}
              autoComplete="given-name"
              required
            />
            <FormInput
              id="lastName"
              name="lastName"
              type="text"
              label="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={() => validateField('lastName', lastName)}
              error={errors.lastName}
              autoComplete="family-name"
              required
            />
          </div>

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
            autoComplete="new-password"
            required
          />

          <SubmitButton />
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
