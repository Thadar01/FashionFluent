import db from "../../../../lib/db";

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
