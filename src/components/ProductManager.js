"use client";

import {
  useCallback,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";

import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/app/actions/products";

const initialForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  image: "",
};

export default function ProductManager({ initialProducts = [] }) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, startRefreshTransition] = useTransition();

  const resetForm = useCallback(() => {
    setForm(initialForm);
    setEditingId("");
  }, []);

  const refreshProducts = useCallback(() => {
    startRefreshTransition(() => {
      router.refresh();
    });
  }, [router]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    const action = editingId ? updateProduct.bind(null, editingId) : createProduct;

    try {
      const result = await action(null, formData);
      setMessage(result.message);

      if (result.ok) {
        resetForm();
        refreshProducts();
      }
    } catch {
      setMessage("Ocurrio un error al guardar el producto.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image || "",
    });
    setMessage("Editando producto.");
  }

  async function handleDelete(id) {
    const result = await deleteProduct(id);

    if (!result.ok) {
      setMessage(result.message || "No se pudo eliminar el producto.");
      return;
    }

    if (editingId === id) {
      resetForm();
    }

    setMessage(result.message);
    refreshProducts();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          {editingId ? "Editar producto" : "Nuevo producto"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Formulario simple para probar los endpoints del CRUD.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            required
          />
          <textarea
            className="min-h-28 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            name="description"
            placeholder="Descripcion"
            value={form.description}
            onChange={handleChange}
          />
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            name="price"
            placeholder="Precio"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            name="stock"
            placeholder="Stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
            required
          />
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            name="image"
            placeholder="URL de imagen"
            value={form.image}
            onChange={handleChange}
          />

          <div className="flex gap-3">
            <button
              className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
            </button>
            <button
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700"
              type="button"
              onClick={resetForm}
            >
              Limpiar
            </button>
          </div>
        </form>

        {message ? <p className="mt-4 text-sm text-slate-700">{message}</p> : null}
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Productos</h2>
            <p className="mt-2 text-sm text-slate-600">
              Lista obtenida desde el container del dashboard.
            </p>
          </div>
          <button
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700"
            disabled={isRefreshing}
            type="button"
            onClick={refreshProducts}
          >
            {isRefreshing ? "Recargando..." : "Recargar"}
          </button>
        </div>

        {initialProducts.length === 0 ? (
          <p className="mt-6 text-slate-600">Todavia no hay productos cargados.</p>
        ) : (
          <div className="mt-6 grid gap-4">
            {initialProducts.map((product) => (
              <article
                key={product._id}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{product.name}</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {product.description || "Sin descripcion"}
                    </p>
                  </div>
                  <div className="text-right text-sm text-slate-700">
                    <p>${product.price}</p>
                    <p>Stock: {product.stock}</p>
                  </div>
                </div>

                <p className="mt-3 break-all text-xs text-slate-500">
                  ID: {product._id}
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    className="rounded-xl bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900"
                    type="button"
                    onClick={() => handleEdit(product)}
                  >
                    Editar
                  </button>
                  <button
                    className="rounded-xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-900"
                    type="button"
                    onClick={() => handleDelete(product._id)}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
