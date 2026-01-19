export default function BookingSkeleton() {
  return (
    <div className="bg-white rounded-[51px] shadow p-6 space-y-6 animate-pulse">
      <div className="flex gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 w-24 bg-gray-200 rounded-lg" />
        ))}
      </div>

      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-4 w-40 bg-gray-200 rounded" />
          <div className="flex gap-3 flex-wrap">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="h-10 w-24 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      ))}

      <div className="h-12 bg-gray-300 rounded-xl" />
    </div>
  );
}
