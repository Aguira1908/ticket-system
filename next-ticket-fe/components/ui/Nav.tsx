'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export function Nav() {
  const { user, logout, isLoading } = useAuth();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold text-gray-900">
          Support Tickets
        </Link>
        {!isLoading &&
          (user ? (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-500">{user.name}</span>
              <button
                onClick={() => logout()}
                className="text-blue-600 hover:underline"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm text-blue-600 hover:underline"
            >
              Admin login
            </Link>
          ))}
      </div>
    </nav>
  );
}
