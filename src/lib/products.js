import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

function serializeProduct(product) {
  return {
    _id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    image: product.image,
    createdAt: product.createdAt?.toISOString(),
    updatedAt: product.updatedAt?.toISOString(),
  };
}

export async function getProducts() {
  await connectDB();

  const products = await Product.find().sort({ createdAt: -1 }).lean();

  return products.map(serializeProduct);
}
