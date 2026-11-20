export function LoadingPanel({ title, description, list = false }: {
  title: string; description: string; list?: boolean;
}) {
  return <section className="page-section access-shell">
    <div className="panel concept-card access-card" role="status">
      <h1>{title}</h1><p className="muted">{description}</p>
      <div className="access-card" aria-hidden="true">
        {Array.from({ length: list ? 3 : 1 }, (_, index) => <div className="access-placeholder" key={index} />)}
      </div>
    </div>
  </section>;
}
