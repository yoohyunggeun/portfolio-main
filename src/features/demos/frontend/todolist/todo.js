export function createTodo(text) {
  return { id: crypto.randomUUID(), text, done: false };
}

export function updateTodo(items, id, changes) {
  return items.map((item) => item.id === id ? { ...item, ...changes } : item);
}

export function filterTodos(items, filter) {
  return filter === "all" ? items : items.filter((item) => item.done === (filter === "done"));
}
