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
export async function GET() {
  try {
    const query = "SELECT * FROM promotions"; // Query to get all staff
    const [promotionData] = await db.execute(query); // Execute the query to fetch staff data

    // If no staff are found, return a message
    if (promotionData.length === 0) {
      return NextResponse.json({ message: "No promotion found" }, { status: 404 });
    }

    // Return the staff data as JSON response
    return NextResponse.json(promotionData, { status: 200 });
  } catch (error) {
    console.error("Error fetching promotion:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}