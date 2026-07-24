export default function TicketDetailLoading() {
  return (
    <main className="w-3xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded" />
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="h-5 w-2/3 bg-gray-200 rounded" />
          <div className="h-3 w-1/3 bg-gray-200 rounded mt-2" />
        </div>
        <div className="h-5 w-16 bg-gray-200 rounded-full" />
      </div>
      <div className="h-3 w-full bg-gray-200 rounded mt-4" />
      <div className="h-3 w-5/6 bg-gray-200 rounded mt-2" />
      <div className="h-3 w-2/3 bg-gray-200 rounded mt-2" />
    </main>
  );
}
