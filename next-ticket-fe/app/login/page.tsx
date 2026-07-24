import { LoginForm } from '@/components/ui/LoginForm';

export default function LoginPage() {
  return (
    <main className="w-md mx-auto px-4 py-12">
      <h1 className="text-lg font-semibold text-gray-900 mb-6">Admin Login</h1>
      <LoginForm />
    </main>
  );
}
