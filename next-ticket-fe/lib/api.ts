import { Ticket, PaginatedResponse } from '@/types/ticket';
import { LoginResponse, AdminUser } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
    ((this.status = status), (this.errors = errors));
  }
}

interface FetchOptions extends RequestInit {
  token?: string;
}

async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, headers, ...rest } = options;

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: 'no-store',
  });

  let body: any = null;
  try {
    body = await res.json();
  } catch (error) {
    // Response tanpa body (mis, 204)
  }

  if (!res.ok) {
    throw new ApiError(
      body?.message ?? 'Something went wrong, Please try again',
      res.status,
      body?.errors
    );
  }

  return body as T;
}

// Tickets

export function getTickets(status?: string) {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return apiFetch<PaginatedResponse<Ticket>>(`/tickets${query}`);
}

export function getTicket(id: number | string) {
  return apiFetch<{ ticket: Ticket }>(`/tickets/${id}`);
}

export interface CreateTicketPayload {
  requester_name: string;
  requester_email: string;
  subject: string;
  description: string;
}

export function createTicket(payload: CreateTicketPayload) {
  return apiFetch<{ message: string; ticket: Ticket }>('/tickets', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateTicketStatus(
  id: number | string,
  status: string,
  token: string
) {
  return apiFetch<{ message: string; ticket: Ticket }>(
    `/tickets/${id}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      token,
    }
  );
}

export function addTicketResponse(
  id: number | string,
  message: string,
  token: string
) {
  return apiFetch<{ message: string; response: unknown }>(
    `/tickets/${id}/responses`,
    {
      method: 'POST',
      body: JSON.stringify({ message }),
      token,
    }
  );
}

export function login(email: string, password: string) {
  return apiFetch<LoginResponse>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function logout(token: string) {
  return apiFetch<{ message: string }>('/logout', {
    method: 'POST',
    token,
  });
}

export function getMe(token: string) {
  return apiFetch<{ user: AdminUser }>('/me', { token });
}
