import { STATUS_STYLES } from '@/lib/status';

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? {
    label: status,
    className: 'bg-gray-100 text-gray-800',
  };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${style.className}`}
    >
      {style.label}
    </span>
  );
}
