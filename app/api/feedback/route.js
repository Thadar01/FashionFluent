import db from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { feedback ,userID} = await request.json();


    // Check if all fields are provided
   

    const getLastIdQuery = "SELECT FeedbackID FROM feedbacks ORDER BY FeedbackID DESC LIMIT 1";
    const [lastRecord] = await db.execute(getLastIdQuery);

    let newFeedbackID = "F-0001"; // Default ID if no records exist

    if (lastRecord.length > 0) {
      const lastId = lastRecord[0].FeedbackID; // Example: "S-009"
      const numericPart = parseInt(lastId.split("-")[1], 10) + 1; // Extract number and increment
      newFeedbackID = `F-${numericPart.toString().padStart(4, "0")}`; // Format as "S-XXX"
    }

    


    // Proceed with insertion if the user doesn't exist
    const insertQuery =
      "INSERT INTO feedbacks (FeedbackID,Feedback,CustomerID) VALUES (?,?,?)";
    const values = [newFeedbackID,feedback,userID];
    await db.execute(insertQuery, values);

    return new Response(
      JSON.stringify({ message: "Your feedback is successfully posted." }),
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

    let searchQuery = "SELECT * FROM feedbacks";
    let queryParams = [];

    if (query) {
      searchQuery += " WHERE Feedback LIKE ?";
      queryParams = [`%${query}%`];
    }

    const [rows] = await db.execute(searchQuery, queryParams);
    
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
