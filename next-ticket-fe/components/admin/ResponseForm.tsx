'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addTicketResponse, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Textarea } from '../ui/TextArea';

interface ResponseFormProps {
  ticketId: number;
  token: string;
}

export function ResponseForm({ ticketId, token }: ResponseFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!message.trim()) {
      setError('Response message cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addTicketResponse(ticketId, message, token);
      setMessage('');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to add response.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {error && <Alert variant="error">{error}</Alert>}
      <Textarea
        label="Add a Response"
        name="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isSubmitting}
      />
      <Button type="submit" isLoading={isSubmitting} className="self-start">
        Send Response
      </Button>
    </form>
  );
}
