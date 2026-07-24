'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTicket, ApiError } from '@/lib/api';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/TextArea';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';

interface FormValues {
  requester_name: string;
  requester_email: string;
  subject: string;
  description: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  requester_name: '',
  requester_email: '',
  subject: '',
  description: '',
};

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.requester_name.trim())
    errors.requester_name = 'Name is required.';

  if (!values.requester_email.trim()) {
    errors.requester_email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.requester_email)) {
    errors.requester_email = 'Enter a valid email address.';
  }

  if (!values.subject.trim()) {
    errors.subject = 'Subject is required.';
  } else if (values.subject.length > 255) {
    errors.subject = 'Subject must be under 255 characters.';
  }

  if (!values.description.trim())
    errors.description = 'Description is required.';

  return errors;
}

export function TicketForm() {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const { ticket } = await createTicket(values);
      router.push(`/tickets/${ticket.id}`);
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        const fieldErrors: FormErrors = {};
        for (const [field, messages] of Object.entries(err.errors)) {
          fieldErrors[field as keyof FormValues] = messages[0];
        }
        setErrors(fieldErrors);
      } else if (err instanceof ApiError) {
        setSubmitError(err.message);
      } else {
        setSubmitError(
          'Failed to create ticket. Please check your connection and try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {submitError && <Alert variant="error">{submitError}</Alert>}

      <Input
        label="Your Name"
        name="requester_name"
        value={values.requester_name}
        onChange={(e) => handleChange('requester_name', e.target.value)}
        error={errors.requester_name}
        disabled={isSubmitting}
      />
      <Input
        label="Email"
        name="requester_email"
        type="email"
        value={values.requester_email}
        onChange={(e) => handleChange('requester_email', e.target.value)}
        error={errors.requester_email}
        disabled={isSubmitting}
      />
      <Input
        label="Subject"
        name="subject"
        value={values.subject}
        onChange={(e) => handleChange('subject', e.target.value)}
        error={errors.subject}
        disabled={isSubmitting}
      />
      <Textarea
        label="Description"
        name="description"
        value={values.description}
        onChange={(e) => handleChange('description', e.target.value)}
        error={errors.description}
        disabled={isSubmitting}
      />

      <Button type="submit" isLoading={isSubmitting} className="self-start">
        Submit Ticket
      </Button>
    </form>
  );
}
