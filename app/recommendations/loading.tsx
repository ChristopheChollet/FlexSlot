export default function RecommendationsLoading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Chargement des recommandations">
      <div className="flex gap-4">
        <div className="skeleton h-11 w-11 shrink-0" />
        <div className="space-y-2">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-6 w-56" />
          <div className="skeleton h-4 w-80" />
        </div>
      </div>

      <div className="section-card space-y-4">
        <div className="skeleton h-5 w-40" />
        <div className="skeleton h-24 w-full" />
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-full" />
        </div>
      </div>

      <div className="section-card space-y-3">
        <div className="skeleton h-5 w-48" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-8 w-full" />
        ))}
      </div>
    </div>
  );
}
