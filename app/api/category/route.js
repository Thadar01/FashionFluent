import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name } = await request.json();


    // Check if all fields are provided
    if (!name) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    const getLastIdQuery = "SELECT CategoryID FROM categories ORDER BY CategoryID DESC LIMIT 1";
    const [lastRecord] = await db.execute(getLastIdQuery);

    let newCategoryID = "Ca-01"; // Default ID if no records exist

    if (lastRecord.length > 0) {
      const lastId = lastRecord[0].CategoryID; // Example: "S-009"
      const numericPart = parseInt(lastId.split("-")[1], 10) + 1; // Extract number and increment
      newCategoryID = `Ca-${numericPart.toString().padStart(2, "0")}`; // Format as "S-XXX"
    }

    // Check if the user already exists
    const checkQuery = "SELECT * FROM categories WHERE CategoryName = ?";
    const [existingUser] = await db.execute(checkQuery, [name]);


   

    if (existingUser.length > 0) {
      return new Response(
        JSON.stringify({ error: "The Category already existes." }),
        { status: 409 } // Conflict status code
      );
    }


    // Proceed with insertion if the user doesn't exist
    const insertQuery =
      "INSERT INTO categories (CategoryID,CategoryName) VALUES (?,?)";
    const values = [newCategoryID,name];
    await db.execute(insertQuery, values);

    return new Response(
      JSON.stringify({ message: "Adding category successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during sign up:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    const query = "SELECT * FROM categories"; // Query to get all staff
    const [categoryData] = await db.execute(query); // Execute the query to fetch staff data

    // If no staff are found, return a message
    if (categoryData.length === 0) {
      return NextResponse.json({ message: "No Category found" }, { status: 404 });
    }

    // Return the staff data as JSON response
    return NextResponse.json(categoryData, { status: 200 });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
