import { TicketForm } from '@/components/ticket/TicketForm';
import Link from 'next/link';

export default function NewTicketPage() {
  return (
    <main className="w-3xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-blue-600  hover:underline">
        Back to tickets
      </Link>

      <h1 className="text-lg font-semibold text-gray-900 mt-2 mb-6 ">
        Create a new Ticket
      </h1>

      <TicketForm />
    </main>
  );
}
