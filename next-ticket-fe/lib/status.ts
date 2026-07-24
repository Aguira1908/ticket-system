export const STATUS_STYLES: Record<
  string,
  { label: string; className: string }
> = {
  open: { label: 'Open', className: 'bg-blue-100 text-blue-800' },
  in_progress: {
    label: 'In Progress',
    className: 'bg-amber-100 text-amber-800',
  },
  resolved: { label: 'Resolved', className: 'bg-green-100 text-green-800' },
};
