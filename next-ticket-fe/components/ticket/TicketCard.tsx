import Link from 'next/link';
import { Ticket } from '@/types/ticket';
import { StatusBadge } from '@/components/ui/Badge';

export function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <li>
      <Link
        href={`/tickets/${ticket.id}`}
        className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-shadow bg-white"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {ticket.subject}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {ticket.requester_name} &middot;{' '}
              {new Date(ticket.created_at).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
          <StatusBadge status={ticket.status} />
        </div>
      </Link>
    </li>
  );
}
