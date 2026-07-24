import Link from 'next/link';
import { ApiError, getTicket } from '@/lib/api';
import { StatusBadge } from '@/components/ui/Badge';
import { ResponseList } from '@/components/ticket/ResponseList';
import { AdminActions } from '@/components/admin/AdminActions';
import { Ticket } from '@/types/ticket';
import { notFound } from 'next/navigation';

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // const { ticket } = await getTicket(id);

  let ticket: Ticket;
  try {
    const res = await getTicket(id);
    ticket = res.ticket;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  return (
    <main className="w-3xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        Back to tickets
      </Link>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            {ticket.subject}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {ticket.requester_name} &middot; {ticket.requester_email}
          </p>
        </div>
        <StatusBadge status={ticket.status} />
      </div>

      <p className="text-sm text-gray-700 mt-4 whitespace-pre-wrap">
        {ticket.description}
      </p>

      <hr className="my-6 border-gray-200" />

      <ResponseList responses={ticket.responses ?? []} />

      <AdminActions ticketId={ticket.id} currentStatus={ticket.status} />
    </main>
  );
}
