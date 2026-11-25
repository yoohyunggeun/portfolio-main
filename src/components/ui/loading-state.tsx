export function LoadingState({ label = "화면을 불러오는 중입니다." }: { label?: string }) {
  return <section className="ui-loading" role="status" aria-label={label} aria-busy="true">
    <span className="loading-caption"><span className="loading-indicator" aria-hidden="true" />{label}</span>
    <div className="loading-skeleton-grid" aria-hidden="true">{[0, 1, 2, 3].map(index => <div className="panel loading-skeleton" key={index}><span /><span /><span /></div>)}</div>
  </section>;
}
