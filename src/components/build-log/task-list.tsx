import type { tasks } from "@/content/build-log/tasks";

export function TaskList({ items, showPhase = false }: { items: typeof tasks; showPhase?: boolean }) {
  return <div className="log-table">
    <table>
      <thead><tr>{showPhase && <th scope="col">단계</th>}<th scope="col">작업</th><th scope="col">상태</th><th scope="col">완료 기준 / 결과물</th></tr></thead>
      <tbody>{items.map((task) => <tr key={task.id}>
        {showPhase && <td className="log-phase">{task.phase}</td>}
        <th scope="row">{task.title}</th>
        <td><span className="log-status" data-status={task.status}>{task.status}</span></td>
        <td className="muted">{task.result}</td>
      </tr>)}</tbody>
    </table>
  </div>;
}
