import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function TicketNotFound() {
  return (
    <main className="max-w-md mx-auto px-4 py-16 text-center flex flex-col items-center gap-4">
      <h1 className="text-lg font-semibold text-gray-900">Ticket Not Found</h1>
      <p className="text-sm text-gray-500">
        This ticket doesn't exist or may have been removed.
      </p>
      <Link href="/">
        <Button>Back to Tickets</Button>
      </Link>
    </main>
  );
}
