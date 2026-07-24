import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="max-w-md mx-auto px-4 py-16 text-center flex flex-col items-center gap-4">
      <h1 className="text-lg font-semibold text-gray-900">Page Not Found</h1>
      <p className="text-sm text-gray-500">
        The page you're looking for doesn't exist.
      </p>
      <Link href="/">
        <Button>Go Home</Button>
      </Link>
    </main>
  );
}
