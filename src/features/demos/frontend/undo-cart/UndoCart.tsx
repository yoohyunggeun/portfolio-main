"use client";

import { useState } from "react";

const products = [
  { id: "mug", name: "머그", price: 12000 },
  { id: "notebook", name: "노트", price: 8000 },
  { id: "bag", name: "에코백", price: 16000 },
];
const money = new Intl.NumberFormat("ko-KR");

export function UndoCart() {
  const [cart, setCart] = useState({
    items: products,
    removed: null as { item: (typeof products)[number]; position: number } | null,
  });
  const total = cart.items.reduce((sum, item) => sum + item.price, 0);

  function remove(id: string) {
    setCart((current) => {
      const position = current.items.findIndex((item) => item.id === id);
      if (position < 0) return current;
      return {
        items: current.items.filter((item) => item.id !== id),
        removed: { item: current.items[position], position },
      };
    });
  }

  function undo() {
    setCart((current) => {
      if (!current.removed) return current;
      const { item, position } = current.removed;
      const items = [...current.items];
      items.splice(position, 0, item);
      return { items, removed: null };
    });
  }

  return <div className="panel concept-card demo-panel frontend-example">
    <h2>장바구니</h2>
    {!cart.items.length && <p className="muted">장바구니가 비어 있습니다.</p>}
    <ul className="example-cart">
      {cart.items.map(({ id, name, price }) => <li key={id} className="example-surface">
        <div><strong>{name}</strong><p className="muted">{money.format(price)}원</p></div>
        <button type="button" className="button" aria-label={`${name} 삭제`} onClick={() => remove(id)}>삭제</button>
      </li>)}
    </ul>
    <p role="status">합계 {money.format(total)}원{cart.removed && ` · ${cart.removed.item.name} 삭제됨`}</p>
    <div className="demo-actions">
      <button type="button" className="button primary" disabled={!cart.removed} onClick={undo}>되돌리기</button>
      <button type="button" className="button" onClick={() => setCart({ items: products, removed: null })}>초기화</button>
    </div>
  </div>;
}
