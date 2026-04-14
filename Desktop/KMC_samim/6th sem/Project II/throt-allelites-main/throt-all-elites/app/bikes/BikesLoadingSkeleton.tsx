// app/bikes/BikesLoadingSkeleton.tsx
export default function BikesLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      {/* Title */}
      <div className="h-14 w-4/5 max-w-2xl bg-gray-200 rounded-xl mx-auto mb-12 animate-pulse" />

      {/* Filter bar */}
      <div className="mb-10 h-16 bg-gray-200 rounded-xl animate-pulse" />

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow overflow-hidden animate-pulse"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="aspect-[4/3] w-full bg-gray-300" />
            <div className="p-5 space-y-4">
              <div className="h-5 bg-gray-300 rounded w-4/5" />
              <div className="h-4 bg-gray-300 rounded w-2/5" />
              <div className="h-7 bg-gray-300 rounded w-1/3 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}