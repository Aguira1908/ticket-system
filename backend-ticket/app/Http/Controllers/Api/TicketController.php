<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TicketController extends Controller
{
  /**
   * List all tickets. Supports optional status filter.
   *
   * GET /api/tickets?status=open
   */
  public function index(Request $request): JsonResponse
  {
    $request->validate([
      'status' => ['sometimes', Rule::in(['open', 'in_progress', 'resolved'])],
    ]);

    $tickets = Ticket::query()
      ->when($request->query('status'), fn($query, $status) => $query->status($status))->latest()
      ->paginate(15);

    return response()->json($tickets);
  }

  /**
   * Create a new ticket (public — no auth required).
   *
   * POST /api/tickets
   */
  public function store(Request $request): JsonResponse
  {
    $validated = $request->validate([
      'requester_name' => 'required|string|max:255',
      'requester_email' => 'required|email|max:255',
      'subject' => 'required|string|max:255',
      'description' => 'required|string',
    ]);

    $ticket = Ticket::create($validated);

    return response()->json([
      'message' => 'Ticket created successfully.',
      'ticket' => $ticket,
    ], 201);
  }

  /**
   * Show a single ticket with its responses.
   *
   * GET /api/tickets/{ticket}
   */
  public function show(Ticket $ticket): JsonResponse
  {
    $ticket->load('responses.user:id,username,email');

    return response()->json(['ticket' => $ticket]);
  }

  /**
   * Update ticket status (admin only — auth required).
   *
   * PATCH /api/tickets/{ticket}/status
   */
  public function updateStatus(Request $request, Ticket $ticket): JsonResponse
  {
    $validated = $request->validate([
      'status' => ['required', Rule::in(['open', 'in_progress', 'resolved'])],
    ]);

    $ticket->update($validated);

    return response()->json([
      'message' => 'Ticket status updated.',
      'ticket' => $ticket,
    ]);
  }


  /**
   * Add a response to a ticket (admin only — auth required).
   *
   * POST /api/tickets/{ticket}/responses
   */
  public function storeResponse(Request $request, Ticket $ticket): JsonResponse
  {
    $validated = $request->validate([
      'message' => 'required|string',
    ]);

    $response = $ticket->responses()->create([
      'user_id' => $request->user()->id,
      'message' => $validated['message'],
    ]);

    $response->load('user:id,username,email');

    return response()->json([
      'message' => 'Response added successfully.',
      'response' => $response,
    ], 201);
  }
}
