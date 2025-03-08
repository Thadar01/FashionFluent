import db from '../../../../lib/db'

export async function DELETE(req,{ params }) {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing promotion ID" }), { status: 400 });
  }
  try {
    // Delete staff member
    const deleteQuery = "DELETE FROM promotions WHERE PromotionID = ?";
    const [result] = await db.execute(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "Promotion not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Promotion deleted successfully" }), { status: 200 });
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
    const searchQuery = "SELECT * FROM promotions WHERE PromotionID = ?";
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


export async function PUT(req, { params }) {
  const { id } = params;

  // Check if the ID is provided
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing promotion ID" }), { status: 400 });
  }

  let requestBody;
  try {
    // Parse the request body
    requestBody = await req.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
  }

  const { percent, title, description, startDate, endDate, staffID } = requestBody;

  // Validate the required fields
  if (!percent || !title || !description || !startDate || !endDate || !staffID) {
    return new Response(JSON.stringify({ error: "Missing promotion data (percent, title, description, startDate, endDate, or staffID)" }), { status: 400 });
  }

  try {
    // Update promotion query
    const updateQuery = `
      UPDATE promotions
      SET PromotionPercent = ?, PromotionTitle = ?, PromoDes = ?, StartDate = ?, EndDate = ?, StaffID = ?
      WHERE PromotionID = ?
    `;

    // Execute the query
    const [result] = await db.execute(updateQuery, [percent, title, description, startDate, endDate, staffID, id]);

    // Check if any row was updated
    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "Promotion not found or no changes made" }), { status: 404 });
    }

    // Successfully updated the promotion
    return new Response(JSON.stringify({ message: "Promotion updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error updating promotion:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}