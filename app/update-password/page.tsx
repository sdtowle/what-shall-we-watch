'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useState } from 'react';
import { updatePassword } from './actions';
import { FormInput } from '@/components/FormInput';
import { validatePassword } from '@/lib/validation';
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
      {pending ? 'Updating...' : 'Update password'}
    </button>
  );
}

export default function UpdatePasswordPage() {
  const [state, formAction] = useFormState(updatePassword, initialState);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [clientErrors, setClientErrors] = useState<AuthFormState['fieldErrors']>({});

  const errors = { ...clientErrors, ...state.fieldErrors };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-text-main text-center mb-2">
          Set new password
        </h1>
        <p className="text-text-muted text-sm text-center mb-8">
          Enter your new password below.
        </p>

        <form action={formAction} className="space-y-4">
          {state.error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
              {state.error}
            </div>
          )}

          <FormInput
            id="password"
            name="password"
            type="password"
            label="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => {
              const result = validatePassword(password);
              setClientErrors({ password: result.valid ? undefined : result.error });
            }}
            error={errors.password}
            autoComplete="new-password"
            required
          />

          <FormInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
