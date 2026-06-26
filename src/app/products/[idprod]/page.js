import Link from "next/link";
import { notFound } from "next/navigation";

import { getProductById } from "@/lib/products";

export default async function ProductsDetailPage({ params }) {
  const { idprod } = await params;
  const product = await getProductById(idprod);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold">
            {product.name}
          </h1>
      </div>
    </main>
  );
}
