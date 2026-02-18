import { useEffect, useMemo, useState } from "react";
import "./ProductPage.css";
import SizeSelector from "../components/SizeSelector";
import { addToCart } from "../cart/addToCart";
import MiniCart from "../components/MiniCart";
import type { Cart } from "../types";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number | string;
  imageURL: string;
  sizeOptions: { id: number; label?: string; long?: string }[];
};

export default function ProductPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{
    message: string;
    detail?: string;
  } | null>(null);

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [cart, setCart] = useState<Cart>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  const loadProduct = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/product");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Product = await res.json();
      setProduct(data);
    } catch (e: unknown) {
      const raw = e instanceof Error ? e.message : "Unknown error";
      console.log("loadProduct error:", e);
      setError({
        message: "Failed to load product. Is the backend running on :3001?",
        detail: raw,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProduct();
  }, []);

  const formattedPrice = useMemo(() => {
    const n = Number(product?.price);
    if (!Number.isFinite(n)) return "$0.00";
    return `$${n.toFixed(2)}`;
  }, [product?.price]);

  if (loading) {
    return (
      <div className="page">
        <header className="header">
          <div className="headerInner">
            <div className="brand">Mini Ecommerce</div>
            <div style={{ opacity: 0.6 }}>Loading...</div>
          </div>
        </header>

        <main className="main">
          <div className="loadingBox">Loading...</div>
        </main>
      </div>
    );
  }

  // 2) Error UI + Retry
  if (error) {
    return (
      <div className="page">
        <header className="header">
          <div className="headerInner">
            <div className="brand">Mini Ecommerce</div>
          </div>
        </header>

        <main className="main">
          <div className="errorBox" role="alert">
            <div className="errorTitle">Something went wrong</div>
            <div className="errorMsg">{error.message}</div>
            {error.detail ? (
              <div className="errorDetail">{error.detail}</div>
            ) : null}
            <button className="retryButton" type="button" onClick={loadProduct}>
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }
  if (!product) {
    return <div className="page">No product.</div>;
  }
  return (
    <div className="page">
      <header className="header">
        <div className="headerInner">
          <div className="brand">Mini Ecommerce</div>
          <MiniCart cart={cart} product={product} />
        </div>
      </header>

      <main className="main" aria-label="Product page">
        <div className="grid">
          {/* Left: Image */}
          <div className="imageWrap">
            <img className="image" src={product.imageURL} alt={product.title} />
          </div>

          {/* Right: Details */}
          <div>
            <h1 className="title">{product.title}</h1>
            <div className="price">{formattedPrice}</div>

            <p className="desc">{product.description}</p>

            <div className="sectionLabel">
              Size <span className="requiredStar">*</span>
            </div>

            <SizeSelector
              options={product.sizeOptions}
              selectedId={selectedSizeId}
              onSelect={(id) => {
                setSelectedSizeId(id);
                setErrorMessage("");
              }}
            />

            <button
              className="button"
              type="button"
              onClick={() => {
                if (selectedSizeId == null) {
                  setErrorMessage("Please select a size");
                  return;
                }

                const opt = product?.sizeOptions?.find(
                  (s) => s.id === selectedSizeId,
                );
                const label = opt?.label ?? opt?.long ?? "";
                if (!label) {
                  setErrorMessage("Please select a size");
                  return;
                }

                setErrorMessage("");
                setCart((prev) =>
                  addToCart(prev, { id: selectedSizeId, label }, product),
                );
              }}
            >
              Add to Cart
            </button>
            {errorMessage ? (
              <div className="errorText">{errorMessage}</div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
