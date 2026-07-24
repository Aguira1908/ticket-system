import Link from 'next/link';
import { getTickets } from '@/lib/api';
import { StatusFilter } from '@/components/ticket/StatusFilter';
import { TicketCard } from '@/components/ticket/TicketCard';
import { Button } from '@/components/ui/Button';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const { data: tickets, total } = await getTickets(status);

  return (
    <main className="w-3xl mx-auto px-4 py-8">
      <div className="flex items-center  justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-900 ">
          Support Tickets
        </h1>

        <Link href="/ticket/new">
          <Button>New Ticket</Button>
        </Link>
      </div>

      <StatusFilter activeStatus={status} />

      {tickets.length === 0 ? (
        <p className="text-sm text-gray-500 mt-8 text-center">
          No tickets found{status ? ` with status "${status}"` : ''}.
        </p>
      ) : (
        <ul className="flex flex-col gap-3 mt-4">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </ul>
      )}

      <p className="text-xs text-gray-400 mt-6">
        {total} ticket{total !== 1 ? 's' : ''} total
      </p>
    </main>
  );
}
