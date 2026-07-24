'use client';

import { useAuth } from '@/context/AuthContext';
import { TicketStatus } from '@/types/ticket';
import { StatusUpdateForm } from '../ticket/StatusUpdateForm';
import { ResponseForm } from './ResponseForm';

interface AdminActionsProps {
  ticketId: number;
  currentStatus: TicketStatus;
}

export function AdminActions({ ticketId, currentStatus }: AdminActionsProps) {
  const { token, user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user || !token) {
    return (
      <p className="text-xs text-gray-400 mt-6 border-t border-gray-200 pt-6">
        Log in as admin to update status or respond to this ticket.
      </p>
    );
  }

  return (
    <div className="mt-6 border-t border-gray-200 pt-6 flex flex-col gap-6">
      <h2 className="text-sm font-semibold text-gray-900">Admin Actions</h2>
      <StatusUpdateForm
        ticketId={ticketId}
        currentStatus={currentStatus}
        token={token}
      />
      <ResponseForm ticketId={ticketId} token={token} />
    </div>
  );
}
