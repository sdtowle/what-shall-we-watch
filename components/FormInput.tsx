'use client';

interface FormInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  error?: string;
  autoComplete?: string;
  required?: boolean;
}

export function FormInput({
  id,
  name,
  type,
  label,
  value,
  onChange,
  onBlur,
  error,
  autoComplete,
  required = false,
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text-main mb-1">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        required={required}
        className={`w-full px-3 py-2 bg-background border rounded-lg text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
          error ? 'border-red-500' : 'border-text-muted/30'
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
