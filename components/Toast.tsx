'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/contexts/ToastContext';

const TOAST_DURATION = 4000;

interface ToastItemProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

function ToastItem({ id, message, type }: ToastItemProps) {
  const { removeToast } = useToast();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / TOAST_DURATION) * 100);
      setProgress(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        removeToast(id);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [id, removeToast]);

  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-primary',
  }[type];

  const progressColor = {
    success: 'bg-green-400',
    error: 'bg-red-400',
    info: 'bg-primary/70',
  }[type];

  return (
    <div
      className={`${bgColor} text-white rounded-lg shadow-lg overflow-hidden min-w-[280px] max-w-sm animate-slide-in`}
    >
      <div className="px-4 py-3">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <div className="h-1 bg-black/20">
        <div
          className={`h-full ${progressColor} transition-none`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  );
}
