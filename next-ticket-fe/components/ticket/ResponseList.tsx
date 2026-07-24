import { TicketResponse } from '@/types/ticket';

export function ResponseList({ responses }: { responses: TicketResponse[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-900 mb-3">
        Responses {responses.length > 0 && `(${responses.length})`}
      </h2>
      {responses.length === 0 ? (
        <p className="text-sm text-gray-500">No responses yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {responses.map((response) => (
            <li
              key={response.id}
              className="p-3 bg-gray-50 rounded-md border border-gray-200"
            >
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {response.message}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {response.user?.name ?? 'Support Team'} &middot;{' '}
                {new Date(response.created_at).toLocaleString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
