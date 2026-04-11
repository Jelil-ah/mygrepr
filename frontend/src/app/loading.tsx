export default function DashboardLoading() {
  return (
    <div className="font-sans">
      {/* Editorial top half */}
      <div className="bg-[var(--editorial-bg)]">
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
          <div className="h-10 w-48 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse mb-3" />
          <div className="h-4 w-72 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse mb-6" />
          <div className="flex gap-6">
            <div className="h-5 w-20 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse" />
            <div className="h-5 w-20 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse" />
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-10 border-t border-[var(--warm-border)]">
          <div className="h-3 w-24 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse mb-6" />
          <div className="flex gap-8">
            <div className="w-32 h-10 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse hidden sm:block" />
            <div className="flex-1 space-y-2">
              <div className="h-7 w-3/4 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse" />
              <div className="h-4 w-full rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse" />
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="h-3 w-28 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse mb-4" />
          <div className="divide-y divide-[var(--warm-divider)]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-4">
                <div className="w-32 h-6 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse hidden sm:block" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-5 w-3/4 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse" />
                  <div className="h-3 w-1/2 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Seam */}
      <div className="w-full h-px bg-indigo-600/40" />
      {/* Cockpit bottom half */}
      <div className="bg-[var(--cockpit-bg)]">
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-8">
          <div className="h-3 w-20 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse mb-4" />
          <div className="flex gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-2 w-16 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse" />
                <div className="h-6 w-12 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="h-3 w-24 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse mb-4" />
          <div className="bg-[var(--paper-bg)] border border-[var(--warm-border)] rounded-sm p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-2.5">
                <div className="w-8 h-4 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse" />
                <div className="w-14 h-5 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse" />
                <div className="flex-1 h-4 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse" />
                <div className="w-10 h-4 rounded-sm bg-stone-200 dark:bg-stone-800 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
