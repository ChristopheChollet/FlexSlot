export default function HistoryLoading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Chargement de l'historique">
      <div className="flex gap-4">
        <div className="skeleton h-11 w-11 shrink-0" />
        <div className="space-y-2">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-6 w-40" />
          <div className="skeleton h-4 w-96" />
        </div>
      </div>

      <ul className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="section-card space-y-3">
            <div className="skeleton h-3 w-32" />
            <div className="skeleton h-5 w-52" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="skeleton h-8 w-full" />
              <div className="skeleton h-8 w-full" />
              <div className="skeleton h-8 w-full" />
              <div className="skeleton h-8 w-full" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
