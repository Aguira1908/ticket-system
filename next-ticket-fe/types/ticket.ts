export type TicketStatus = 'open' | 'in_progress' | 'resolved';

export interface TicketResponse {
  id: number;
  ticket_id: number;
  message: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface Ticket {
  id: number;
  requester_name: string;
  requester_email: string;
  subject: string;
  description: string;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
  responses?: TicketResponse[];
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
}
