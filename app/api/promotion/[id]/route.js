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

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing promotion ID" }), { status: 400 });
  }

  let requestBody;
  try {
    requestBody = await req.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
  }

  const { percent, title, staffID } = requestBody;

  if (!percent || !title || !staffID) {
    return new Response(JSON.stringify({ error: "Missing promotion data (percent, title, or staffID)" }), { status: 400 });
  }

  try {
    const updateQuery = `
      UPDATE promotions
      SET PromotionPercent = ?, PromotionTitle = ?, StaffID = ?
      WHERE PromotionID = ?
    `;
    const [result] = await db.execute(updateQuery, [percent, title, staffID, id]);

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "Promotion not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Promotion updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error updating promotion:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}