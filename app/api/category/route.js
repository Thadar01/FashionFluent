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

export async function GET(req) {
  try {
    // Extract search query from request URL
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q"); // `q` will be the search term (e.g., name or email)

    let searchQuery = "SELECT * FROM categories";
    let queryParams = [];

    if (query) {
      searchQuery += " WHERE CategoryName LIKE ?";
      queryParams = [`%${query}%`, `%${query}%`];
    }

    const [rows] = await db.execute(searchQuery, queryParams);
    
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching category:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
