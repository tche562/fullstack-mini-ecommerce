import { useEffect, useMemo, useRef, useState } from "react";
import type { Cart } from "../types";

type Props = {
  cart: Cart;
};

export default function MiniCart({ cart }: Props) {
  const [open, setOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);

  const items = useMemo(() => Object.values(cart), [cart]);

  const totalQty = useMemo(
    () => items.reduce((sum, it) => sum + it.qty, 0),
    [items],
  );

  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (!root.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div className="miniCart" ref={rootRef}>
      <button
        type="button"
        className="miniCartButton"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        Cart
        {totalQty > 0 ? (
          <span className="miniCartBadge">{totalQty}</span>
        ) : null}
      </button>

      {open ? (
        <div
          className="miniCartPanel"
          role="dialog"
          aria-label="Mini cart panel"
        >
          <div className="miniCartPanelHeader">
            <div className="miniCartPanelTitle">Cart</div>
            <button
              type="button"
              className="miniCartClose"
              aria-label="Close cart"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          {items.length === 0 ? (
            <div className="miniCartEmpty">Cart is empty</div>
          ) : (
            <div className="miniCartList">
              {items.map((item) => (
                <div key={item.sizeId} className="miniCartRow">
                  <span className="miniCartRowLabel">{item.sizeLabel}</span>
                  <span className="miniCartRowQty">x{item.qty}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
