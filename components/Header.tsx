'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-surface border-b border-text-muted/20">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold text-text-main hover:text-primary transition-colors"
        >
          What Shall We Watch?
        </Link>

        <nav className="flex items-center gap-4">
          {loading ? (
            <div className="h-5 w-20 bg-text-muted/20 rounded animate-pulse" />
          ) : user ? (
            <>
              <Link
                href="/watchlist"
                className="text-sm text-text-muted hover:text-primary transition-colors"
              >
                Watchlist
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-text-muted hover:text-primary transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-text-muted hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm text-text-muted hover:text-primary transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
