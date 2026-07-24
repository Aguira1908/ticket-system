import { STATUS_STYLES } from '@/lib/status';
import { TicketStatus } from '@/types/ticket';

export function StatusBadge({ status }: { status: TicketStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${style.className}`}
    >
      {style.label}
    </span>
  );
}
