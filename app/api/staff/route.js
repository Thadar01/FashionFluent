import db from "../../../lib/db";

export async function GET(request) {
  try {
    // Extract name from the query parameters
    const url = new URL(request.url, `http://${request.headers.host}`);
    const name = url.searchParams.get('name'); // Get the name to search for

    console.log('Name:', name); // Log for debugging

    // Prepare the SQL query
    let query = 'SELECT * FROM staff';
    let queryParams = [];

    // If a name is provided, add it to the query to filter by name
    if (name) {
      query += ' WHERE StaffName LIKE ?';
      queryParams.push(`%${name}%`); // Use wildcard for partial matches
    }

    // Execute the query
    const [rows] = await db.query(query, queryParams);

    // Return the staff data
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error('Error fetching staff:', error);
    return new Response(
      JSON.stringify({ message: 'Error fetching staff', error }),
      { status: 500 }
    );
  }
}
