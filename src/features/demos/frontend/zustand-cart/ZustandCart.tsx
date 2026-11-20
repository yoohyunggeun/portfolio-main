"use client";

import { useState } from "react";
import { createStore, useStore } from "zustand";

const products = [
  { id: "mug", name: "머그", price: 12000 },
  { id: "note", name: "노트", price: 8000 },
  { id: "bag", name: "에코백", price: 16000 },
];
const money = new Intl.NumberFormat("ko-KR");
type Product = (typeof products)[number];
type CartState = {
  quantities: Record<string, number>;
  changeQuantity: (id: string, delta: 1 | -1) => void;
};

function createCartStore() {
  return createStore<CartState>()((set) => ({
    quantities: {},
    changeQuantity: (id, delta) => set((state) => {
      const quantity = (state.quantities[id] ?? 0) + delta;
      if (quantity < 0) return state;
      const quantities = { ...state.quantities };
      if (quantity === 0) delete quantities[id];
      else quantities[id] = quantity;
      return { quantities };
    }),
  }));
}
type CartStore = ReturnType<typeof createCartStore>;

function CartBadge({ store }: { store: CartStore }) {
  const count = useStore(store, (state) =>
    Object.values(state.quantities).reduce((sum, quantity) => sum + quantity, 0));
  return <p className="zustand-badge" role="status">장바구니 {count}개</p>;
}

function ProductRow({ store, product }: { store: CartStore; product: Product }) {
  const { id, name, price } = product;
  const quantity = useStore(store, (state) => state.quantities[id] ?? 0);
  const changeQuantity = useStore(store, (state) => state.changeQuantity);

  return <li className="example-surface">
    <div><strong>{name}</strong><p className="muted">{money.format(price)}원</p></div>
    <div className="demo-actions">
      <button type="button" className="button" aria-label={`${name} 수량 줄이기`}
        disabled={quantity === 0} onClick={() => changeQuantity(id, -1)}>−</button>
      <span aria-label={`${name} 수량`}>{quantity}</span>
      <button type="button" className="button primary" aria-label={`${name} 수량 늘리기`}
        onClick={() => changeQuantity(id, 1)}>+</button>
    </div>
  </li>;
}

function CartSummary({ store }: { store: CartStore }) {
  const quantities = useStore(store, (state) => state.quantities);
  const selected = products.filter(({ id }) => quantities[id] > 0);
  const total = selected.reduce((sum, { id, price }) => sum + quantities[id] * price, 0);

  return <section className="example-surface zustand-summary">
    <h3>장바구니 내역</h3>
    {selected.length ? <ul className="detail-list">
      {selected.map(({ id, name }) => <li key={id}>{name} {quantities[id]}개</li>)}
    </ul> : <p className="muted">담은 상품이 없습니다.</p>}
    <p><strong>합계 {money.format(total)}원</strong></p>
  </section>;
}

export function ZustandCart() {
  const [store] = useState(createCartStore);

  return <div className="panel concept-card demo-panel frontend-example zustand-cart">
    <div className="shell-heading"><h2>상품 목록</h2><CartBadge store={store} /></div>
    <ul className="example-cart">
      {products.map((product) => <ProductRow key={product.id} store={store} product={product} />)}
    </ul>
    <CartSummary store={store} />
  </div>;
}
