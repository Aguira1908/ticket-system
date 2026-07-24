import ticketsData from '../data/tickets.example.json';
import { TicketSample, TicketStats, TicketStatus } from '../types/types';

const tickets = ticketsData as TicketSample[];

export function computeTicketStats(): TicketStats {
  const total = tickets.length;

  const by_status: Record<TicketStatus, number> = {
    open: 0,
    in_progress: 0,
    resolved: 0,
  };

  let totalResponses = 0;

  for (const ticket of tickets) {
    by_status[ticket.status] += 1;
    totalResponses += ticket.responses_count;
  }

  const average_responses_per_ticket = total > 0 ? totalResponses / total : 0;
  const resolution_rate_percent =
    total > 0 ? (by_status.resolved / total) * 100 : 0;

  return {
    total,
    by_status,
    average_responses_per_ticket: Number(
      average_responses_per_ticket.toFixed(2)
    ),
    resolution_rate_percent: Number(resolution_rate_percent.toFixed(2)),
  };
}
