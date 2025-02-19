import db from "../../../lib/db";

export async function GET(req) {
  try {
    // Extract search query from request URL
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q"); // `q` will be the search term (e.g., name or email)

    let searchQuery = "SELECT * FROM staff";
    let queryParams = [];

    if (query) {
      searchQuery += " WHERE StaffName LIKE ? OR StaffEmail LIKE ?";
      queryParams = [`%${query}%`, `%${query}%`];
    }

    const [rows] = await db.execute(searchQuery, queryParams);
    
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching staff:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
