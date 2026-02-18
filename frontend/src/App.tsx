import { useEffect, useState } from "react";

type SizeOption = {
  id: number;
  label: string;
};

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  imageURL: string;
  sizeOptions: SizeOption[];
};

function App() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetch("/api/product");
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const data = (await response.json()) as Product;
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    void loadProduct();
  }, []);

  if (loading) {
    return <main>Loading...</main>;
  }

  if (error) {
    return <main>Error: {error}</main>;
  }

  if (!product) {
    return <main>Error: no product returned</main>;
  }

  return (
    <main>
      <h1>{product.title}</h1>
      <pre>{JSON.stringify(product, null, 2)}</pre>
    </main>
  );
}

export default App;
