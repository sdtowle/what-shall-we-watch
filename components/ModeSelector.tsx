'use client';

import { Mode } from '@/lib/types';

interface ModeSelectorProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

export default function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  const options: { value: Mode; label: string; emoji: string }[] = [
    { value: null, label: 'Any', emoji: '🎬' },
    { value: 'food', label: 'With Food', emoji: '🍕' },
    { value: 'freetime', label: 'Free Time', emoji: '🛋️' },
  ];

  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option.label}
          onClick={() => onChange(option.value)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
            transition-all duration-200
            ${
              mode === option.value
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-surface text-text-muted hover:bg-surface/80 hover:text-text-main'
            }
          `}
        >
          <span>{option.emoji}</span>
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}
