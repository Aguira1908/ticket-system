'use client';

import { useRouter, usePathname } from 'next/navigation';
import { STATUS_OPTIONS } from '@/lib/status';

const FILTERS = [{ value: '', label: 'All' }, ...STATUS_OPTIONS];

export function StatusFilter({ activeStatus }: { activeStatus?: string }) {
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(status: string) {
    router.push(status ? `${pathname}?status=${status}` : pathname);
  }

  return (
    <div
      className="flex gap-2 flex-wrap"
      role="group"
      aria-label="Filter by status"
    >
      {FILTERS.map((filter) => {
        const isActive = (activeStatus ?? '') === filter.value;
        return (
          <button
            key={filter.value || 'all'}
            type="button"
            onClick={() => handleChange(filter.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              isActive
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
