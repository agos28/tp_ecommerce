import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });

    return Response.json(products);
  } catch (error) {
    return Response.json(
      { message: "Error al obtener los productos", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();

    const product = await Product.create({
      name: body.name,
      description: body.description,
      price: body.price,
      stock: body.stock,
      image: body.image,
    });

    return Response.json(product, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: "Error al crear el producto", error: error.message },
      { status: 400 }
    );
  }
}
