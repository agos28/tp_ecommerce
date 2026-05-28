import ProductManager from "@/components/ProductManager";
import { getProducts } from "@/lib/products";

export default async function ProductDashboardContainer() {
  const products = await getProducts();

  return <ProductManager initialProducts={products} />;
}
