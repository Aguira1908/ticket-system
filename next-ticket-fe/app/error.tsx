'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto mt-12 flex flex-col gap-4">
      <Alert variant="error">
        {error.message || 'Something went wrong while loading tickets.'}
      </Alert>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
