import db from '../../../../lib/db'
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function DELETE(req,{ params }) {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing product ID" }), { status: 400 });
  }
  try {
    // Delete staff member
    const deleteQuery = "DELETE FROM products WHERE ProductID = ?";
    const [result] = await db.execute(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Product deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}


export async function GET(req, { params }) {
  if (!params || !params.id) {
    return new Response(JSON.stringify({ error: "Missing promotion ID" }), { status: 400 });
  }

  const { id } = params;

  try {
    // Search for the promotion by ID
    const searchQuery = "SELECT * FROM products WHERE ProductID = ?";
    const [result] = await db.execute(searchQuery, [id]);

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: "Promotion not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(result[0]), { status: 200 }); // Returning promotion data
  } catch (error) {
    console.error("Error fetching promotion:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}




export async function PUT(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const description=formData.get('description')
    const price = formData.get("price");
    const gender = formData.get("gender");
    const colors = formData.get("colors");
    const sizes= formData.get('sizes')
    const stocks = formData.get("stocks");
    const categoryID = formData.get("categoryID");
    const promotionID = formData.get("promotionID");
    const imageFile = formData.get("image");
    let imagePath = null;

    // Check if the title already exists (excluding the current product)
    const checkQuery = `
      SELECT * FROM products WHERE ProductTitle = ? AND ProductID != ?
    `;
    const [existingProduct] = await db.execute(checkQuery, [title, id]);

    if (existingProduct.length > 0) {
      return NextResponse.json({ error: "Product with the same title already exists" }, { status: 409 });
    }

    // Handle image upload
    if (imageFile && imageFile.name) {
      const fileExtension = path.extname(imageFile.name);
      const fileName = `${Date.now()}${fileExtension}`; // Unique file name based on timestamp
      const uploadPath = path.join(process.cwd(), "public", "uploads", fileName);

      const dir = path.dirname(uploadPath);
      try {
        await fs.access(dir);
      } catch (error) {
        await fs.mkdir(dir, { recursive: true });
      }

      const fileBuffer = await imageFile.arrayBuffer();
      await fs.writeFile(uploadPath, Buffer.from(fileBuffer));
      imagePath = `/uploads/${fileName}`;
    }

    // Prepare the update query based on whether the image exists
    let updateQuery;
    let values;

    if (imagePath) {
      updateQuery = `
        UPDATE products 
        SET ProductTitle = ?, Description=?, ProductPrice = ?, Gender = ?, ProductColors = ?,Sizes=?, Stock = ?, Image = ?, CategoryID = ?, PromotionID = ?
        WHERE ProductID = ?
      `;
      values = [title,description, price, gender, colors,sizes, stocks, imagePath, categoryID, promotionID, id];
    } else {
      updateQuery = `
        UPDATE products 
        SET ProductTitle = ?,Description=?, ProductPrice = ?, Gender = ?, ProductColors = ?, Stock = ?, CategoryID = ?, PromotionID = ?
        WHERE ProductID = ?
      `;
      values = [title,description, price, gender, colors,sizes, stocks, categoryID, promotionID, id];
    }

    const [result] = await db.execute(updateQuery, values);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product updated successfully", imagePath }, { status: 200 });
  } catch (error) {
    console.error("Error during product update:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

