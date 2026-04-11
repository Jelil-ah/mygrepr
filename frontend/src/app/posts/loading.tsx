export default function PostsLoading() {
  return (
    <div className="min-h-screen bg-[var(--editorial-bg)]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="h-7 w-48 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse mb-6" />
        <div className="flex gap-8">
          {/* Sidebar skeleton */}
          <div className="hidden lg:block w-60 shrink-0 space-y-7">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="h-3 w-16 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse mb-3" />
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="h-6 w-16 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Feed skeleton */}
          <div className="flex-1 min-w-0">
            <div className="h-10 w-full rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse mb-6" />
            <div className="h-8 w-64 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse mb-5" />
            <div className="divide-y divide-[var(--warm-divider)]">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-4">
                  <div className="w-32 h-6 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse hidden sm:block" />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-20 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse" />
                      <div className="h-5 w-3/4 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse" />
                    </div>
                    <div className="h-3 w-2/3 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse" />
                  </div>
                  <div className="h-3 w-20 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
