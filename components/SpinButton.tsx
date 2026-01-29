'use client';

interface SpinButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export default function SpinButton({ onClick, isLoading }: SpinButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        relative px-8 py-4 rounded-2xl font-bold text-lg
        bg-gradient-to-r from-primary to-purple-500
        text-white shadow-xl shadow-primary/40
        transition-all duration-300
        hover:shadow-2xl hover:shadow-primary/50 hover:scale-105
        active:scale-95
        disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
      `}
    >
      <span className={`flex items-center gap-3 ${isLoading ? 'opacity-0' : ''}`}>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Pick a Show!
      </span>

      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-6 h-6 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
    </button>
  );
}
