// app/api/staff/route.js
import { NextResponse } from "next/server";
import db from '../../../../lib/db'

export async function GET() {
  try {
    const query = "SELECT * FROM staffs WHERE StaffRole='Admin'"; // Query to get all staff
    const [staffData] = await db.execute(query); // Execute the query to fetch staff data

    // If no staff are found, return a message
    if (staffData.length === 0) {
      return NextResponse.json({ message: "No staff found" }, { status: 404 });
    }

    // Return the staff data as JSON response
    return NextResponse.json(staffData, { status: 200 });
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
