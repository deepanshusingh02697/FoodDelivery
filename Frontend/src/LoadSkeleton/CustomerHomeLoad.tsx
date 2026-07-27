export default function CustomerHomeLoad() {
  return (
    <main className="px-4 py-5 md:px-8 md:py-10 animate-pulse">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div>
          <div className="h-4 w-40 bg-zinc-600 rounded"></div>

          <div className="mt-4 h-12 w-80 bg-zinc-600 rounded"></div>
          <div className="mt-3 h-12 w-64 bg-zinc-600 rounded"></div>

          <div className="mt-5 h-6 w-90 bg-zinc-600 rounded"></div>
        </div>
      </div>

      <div className="mt-8 h-64 rounded-2xl bg-zinc-600"></div>

      <div className="mt-8 h-12 rounded-xl bg-zinc-600"></div>
      <div className="flex justify-between">
        <div className="mt-6 flex flex-wrap gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 w-28 rounded-full bg-zinc-600" />
          ))}
        </div>

        <div className="mt-6 pt-6 h-5 w-40 bg-zinc-600 rounded"></div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-600"
          >
            <div className="h-40 bg-zinc-600"></div>

            <div className="p-4 space-y-3">
              <div className="h-5 w-2/3 bg-zinc-600 rounded"></div>

              <div className="h-4 w-1/2 bg-zinc-600 rounded"></div>

              <div className="h-4 w-full bg-zinc-600 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
