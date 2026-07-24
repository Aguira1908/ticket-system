import { ReactNode } from 'react';

type AlertVariant = 'error' | 'success' | 'info';

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  error: 'bg-red-50 text-red-800 border-red-200',
  success: 'bg-green-50 text-green-800 border-green-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
};

export function Alert({
  variant = 'error',
  children,
}: {
  variant?: AlertVariant;
  children: ReactNode;
}) {
  return (
    <div
      role="alert"
      className={`px-4 py-3 rounded-md border text-sm ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </div>
  );
}
