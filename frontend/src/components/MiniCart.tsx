import { useEffect, useMemo, useRef, useState } from "react";
import type { Cart } from "../types";

type ProductSummary = {
  title: string;
  price: number | string;
  imageURL: string;
};

type Props = {
  cart: Cart;
  product: ProductSummary;
};

export default function MiniCart({ cart, product }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const items = useMemo(() => Object.values(cart), [cart]);
  const totalQty = useMemo(
    () => items.reduce((sum, it) => sum + it.qty, 0),
    [items],
  );

  const formattedPrice = useMemo(() => {
    const n = Number(product?.price);
    if (!Number.isFinite(n)) return "$0.00";
    return `$${n.toFixed(2)}`;
  }, [product?.price]);

  // Click outside to close
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
                  <img
                    className="miniCartThumb"
                    src={product.imageURL}
                    alt={product.title}
                  />
                  <div className="miniCartRowInfo">
                    <div className="miniCartRowTitle">{product.title}</div>
                    <div className="miniCartRowMeta">
                      <span className="miniCartRowPrice">{formattedPrice}</span>
                      <span className="miniCartRowSize">
                        Size: {item.sizeLabel}
                      </span>
                      <span className="miniCartRowQty">Qty: {item.qty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
