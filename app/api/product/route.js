import db from "../../../lib/db";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const description=formData.get('description')
    const price = formData.get("price");
    const gender = formData.get("gender");
    const colors = formData.get("colors");
    const sizes=formData.get('sizes')
    const stocks = formData.get("stocks");
    const categoryID = formData.get("categoryID");
    const promotionID=formData.get('promotionID')

    // Handle image file upload
    const imageFile = formData.get("image");
    let imagePath = null;

    if (imageFile && imageFile.name) {
      const fileExtension = path.extname(imageFile.name);
      const fileName = `${Date.now()}${fileExtension}`; // Unique file name based on timestamp
      const uploadPath = path.join(process.cwd(), "public", "uploads", fileName);

      // Ensure the directory exists using fs.promises.access (async)
      const dir = path.dirname(uploadPath);
      try {
        await fs.access(dir); // Check if the directory exists
      } catch (error) {
        // If the directory doesn't exist, create it
        await fs.mkdir(dir, { recursive: true });
      }

      const fileBuffer = await imageFile.arrayBuffer();

      // Save the image to the server
      await fs.writeFile(uploadPath, Buffer.from(fileBuffer));
      imagePath = `/uploads/${fileName}`; // Path to be stored in DB
    }

    // Get the last ProductID
    const getLastIdQuery = "SELECT ProductID FROM products ORDER BY ProductID DESC LIMIT 1";
    const [rows] = await db.execute(getLastIdQuery);

    let newProductID = "P-001"; // Default ID if no records exist

    if (rows.length > 0) {
      const lastId = rows[0].ProductID;
      const numericPart = parseInt(lastId.split("-")[1], 10) + 1;
      newProductID = `P-${numericPart.toString().padStart(3, "0")}`;
    }

    // Insert the new product
    const insertQuery = `INSERT INTO products (ProductID, ProductTitle,Description, ProductPrice, Gender, ProductColors,Sizes, Stock, Image, CategoryID,PromotionID) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)`;
    const values = [newProductID, title,description, price, gender, colors,sizes, stocks, imagePath, categoryID,promotionID];

    await db.execute(insertQuery, values);

    return NextResponse.json({ message: "Product added successfully", imagePath }, { status: 200 });
  } catch (error) {
    console.error("Error during product creation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const productID=searchParams.get('productID')
    const query = searchParams.get("q"); // Search term
    const gender = searchParams.get("gender"); // Gender filter

    let searchQuery = "SELECT * FROM products WHERE 1=1";
    let queryParams = [];


    if (productID) {
      searchQuery += " AND ProductID = ?";
      queryParams.push(productID);
    }

    if (query) {
      searchQuery += " AND ProductTitle LIKE ?";
      queryParams.push(`%${query}%`);
    }

    if (gender) {
      searchQuery += " AND Gender = ?";
      queryParams.push(gender);
    }

    const [rows] = await db.execute(searchQuery, queryParams);

    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching Products:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

