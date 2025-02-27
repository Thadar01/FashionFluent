import db from "../../../../lib/db";

// DELETE - Remove staff by ID
export async function DELETE(req, { params }) {
  const { id } = params; // ✅ Access ID correctly

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing staff ID" }), { status: 400 });
  }

  try {
    // Delete staff member
    const deleteQuery = "DELETE FROM staff WHERE StaffID = ?";
    const [result] = await db.execute(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "Staff not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Staff deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting staff:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

// GET - Fetch staff by ID
export async function GET(req, { params }) {
  const { id } = params; // ✅ Access ID correctly
  
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing staff ID" }), { status: 400 });
  }

  try {
    // Search for the staff by ID
    const searchQuery = "SELECT * FROM staff WHERE StaffID = ?";
    const [result] = await db.execute(searchQuery, [id]);

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: "Staff not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(result[0]), { status: 200 }); // Returning staff data
  } catch (error) {
    console.error("Error fetching staff:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

// PUT - Edit staff information by ID
export async function PUT(req, { params }) {
  const { id } = params; // ✅ Access ID correctly

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing staff ID" }), { status: 400 });
  }

  // Parse the request body
  let requestBody;
  try {
    requestBody = await req.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
  }

  const { staffName, email, phone } = requestBody;

  if (!staffName || !email || !phone) {
    return new Response(JSON.stringify({ error: "Missing staff data" }), { status: 400 });
  }

  try {
    // Update staff data
    const updateQuery = `
      UPDATE staff
      SET StaffName = ?, StaffEmail = ?, StaffPhoneNo = ?
      WHERE StaffID = ?
    `;
    const [result] = await db.execute(updateQuery, [staffName, email, phone, id]);

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "Staff not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Staff updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error updating staff:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
