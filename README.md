## CRUD simple con Next.js y MongoDB

Este proyecto incluye un ejemplo sencillo de ecommerce con:

- `mongoose`
- conexion a MongoDB con `MONGODB_URI`
- modelo `Product`
- endpoints CRUD en `src/app/api/products`
- interfaz basica para probar el CRUD desde la pagina principal

## Configuracion

El archivo `.env` ya incluye una conexion local de ejemplo:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce-clase
```

Si usas MongoDB Atlas o otra base, reemplaza ese valor por tu cadena real.

## Ejecutar

```bash
npm run dev
```

Abrir `http://localhost:3000`.

## Endpoints

- `GET /api/products` lista todos los productos
- `POST /api/products` crea un producto
- `GET /api/products/:id` obtiene un producto por id
- `PUT /api/products/:id` actualiza un producto
- `DELETE /api/products/:id` elimina un producto

## Estructura principal

- `src/lib/mongodb.js`: conexion reutilizable a MongoDB
- `src/models/Product.js`: esquema de producto
- `src/app/api/products/route.js`: `GET` y `POST`
- `src/app/api/products/[id]/route.js`: `GET`, `PUT` y `DELETE` por id
- `src/components/ProductManager.js`: componente cliente para probar el CRUD

## Ejemplo de body para crear o actualizar

```json
{
  "name": "Notebook",
  "description": "Notebook de 14 pulgadas",
  "price": 1500,
  "stock": 8,
  "image": "https://ejemplo.com/notebook.jpg"
}
```

Con eso ya podes consumir el backend desde componentes con `fetch`.
