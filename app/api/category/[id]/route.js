import db from '../../../../lib/db'

export async function DELETE(req,{ params }) {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing category ID" }), { status: 400 });
  }
  try {
    // Delete staff member
    const deleteQuery = "DELETE FROM categories WHERE CategoryID = ?";
    const [result] = await db.execute(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "Category not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Category deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
