export type TicketStatus = 'open' | 'in_progress' | 'resolved';

export interface TicketSample {
  id: number;
  status: TicketStatus;
  created_at: string;
  responses_count: number;
}

export interface TicketStats {
  total: number;
  by_status: Record<TicketStatus, number>;
  average_responses_per_ticket: number;
  resolution_rate_percent: number;
}
