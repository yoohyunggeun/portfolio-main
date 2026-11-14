"use client";

import { useState, type FormEvent } from "react";
import { useStoredState } from "../use-stored-state";
import { createTodo, filterTodos, updateTodo } from "./todo";

type Todo = { id: string; text: string; done: boolean };
const filters = { all: "전체", open: "진행 중", done: "완료" };

export function TodoList() {
  const [items, setItems, ready] = useStoredState<Todo[]>("career-code:todos:v1", []);
  const [filter, setFilter] = useState<keyof typeof filters>("all");
  const [text, setText] = useState("");
  const [editing, setEditing] = useState<string | null>(null);

  function resetEditor() {
    setText("");
    setEditing(null);
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    if (editing) setItems((current) => updateTodo(current, editing, { text: trimmed }));
    else {
      const item = createTodo(trimmed);
      setItems((current) => [...current, item]);
    }
    resetEditor();
  }

  const visible: Todo[] = filterTodos(items, filter);

  return <div className="panel concept-card demo-panel">
    <form className="demo-form" onSubmit={save}>
      <label htmlFor="todo-text">{editing ? "할 일 수정" : "새 할 일"}</label>
      <div className="demo-actions">
        <input id="todo-text" value={text} onChange={(event) => setText(event.target.value)} required maxLength={120} />
        <button className="button primary" disabled={!ready || !text.trim()}>{editing ? "저장" : "추가"}</button>
        {editing && <button type="button" className="button" onClick={resetEditor}>취소</button>}
      </div>
    </form>
    <div className="demo-actions" aria-label="할 일 상태 필터">
      {(Object.keys(filters) as (keyof typeof filters)[]).map((key) =>
        <button key={key} className="button" aria-pressed={filter === key} onClick={() => setFilter(key)}>{filters[key]}</button>)}
    </div>
    <p className="muted" role="status">{ready ? `전체 ${items.length}개 · 완료 ${items.filter((item) => item.done).length}개` : "목록 불러오는 중"}</p>
    {ready && !visible.length && <p className="muted">표시할 할 일이 없습니다.</p>}
    <ul className="todo-list">
      {visible.map((item) => <li key={item.id}>
        <label><input type="checkbox" checked={item.done} onChange={(event) => {
          const done = event.target.checked;
          setItems((current) => updateTodo(current, item.id, { done }));
        }} /><span>{item.text}</span></label>
        <div className="demo-actions">
          <button className="button" onClick={() => { setEditing(item.id); setText(item.text); document.getElementById("todo-text")?.focus(); }}>수정</button>
          <button className="button" onClick={() => {
            setItems((current) => current.filter((todo) => todo.id !== item.id));
            if (editing === item.id) resetEditor();
          }}>삭제</button>
        </div>
      </li>)}
    </ul>
  </div>;
}
