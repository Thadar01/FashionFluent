import db from "../../../lib/db";
import { NextResponse } from "next/server";
export async function POST(request) {
  try {
    const { percent, title, staffID } = await request.json();

    // Check if all fields are provided
    if (!percent || !title || !staffID) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    // Get the last PromotionID
    const getLastIdQuery = "SELECT PromotionID FROM promotions ORDER BY PromotionID DESC LIMIT 1";
    const [lastRecord] = await db.execute(getLastIdQuery);

    let newPromotionID = "Pro-001"; // Default ID if no records exist

    if (lastRecord.length > 0) {
      const lastId = lastRecord[0].PromotionID; // Fix: Use PromotionID instead of SupplierID
      const numericPart = parseInt(lastId.split("-")[1], 10) + 1; // Extract number and increment
      newPromotionID = `Pro-${numericPart.toString().padStart(3, "0")}`; // Format as "Pro-XXX"
    }

    // Insert the new promotion
    const insertQuery =
      "INSERT INTO promotions (PromotionID, PromotionPercent, PromotionTitle, StaffID) VALUES (?, ?, ?, ?)";
    const values = [newPromotionID, percent, title, staffID];
    await db.execute(insertQuery, values);

    return new Response(
      JSON.stringify({ message: "Promotion added successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during promotion creation:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
export async function GET(req) {
  try {
    // Extract search query from request URL
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q"); // `q` will be the search term (e.g., name or email)

    let searchQuery = "SELECT * FROM promotions";
    let queryParams = [];

    if (query) {
      searchQuery += " WHERE PromotionTitle LIKE ?";
      queryParams = [`%${query}%`, `%${query}%`];
    }

    const [rows] = await db.execute(searchQuery, queryParams);
    
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching staff:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}