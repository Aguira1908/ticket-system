'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateTicketStatus, ApiError } from '@/lib/api';
import { STATUS_OPTIONS } from '@/lib/status';
import { TicketStatus } from '@/types/ticket';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

interface StatusUpdateFormProps {
  ticketId: number;
  currentStatus: TicketStatus;
  token: string;
}

export function StatusUpdateForm({
  ticketId,
  currentStatus,
  token,
}: StatusUpdateFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<TicketStatus>(currentStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // sinkron ulang kalau currentStatus berubah dari server (misal setelah router.refresh())
  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await updateTicketStatus(ticketId, status, token);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to update status.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {error && <Alert variant="error">{error}</Alert>}
      <div className="flex items-end gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-sm font-medium text-gray-700">
            Ticket Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TicketStatus)}
            disabled={isSubmitting}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={status === currentStatus}
        >
          Update Status
        </Button>
      </div>
    </form>
  );
}
