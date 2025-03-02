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


export async function GET(req, { params }) {
  const { id } = params; // ✅ Access ID correctly
  
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing catehory ID" }), { status: 400 });
  }

  try {
    // Search for the staff by ID
    const searchQuery = "SELECT * FROM categories WHERE CategoryID = ?";
    const [result] = await db.execute(searchQuery, [id]);

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: "Supplier not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(result[0]), { status: 200 }); // Returning staff data
  } catch (error) {
    console.error("Error fetching category:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

// PUT - Edit staff information by ID
export async function PUT(req, { params }) {
  const { id } = params; // ✅ Access ID correctly

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing category ID" }), { status: 400 });
  }

  // Parse the request body
  let requestBody;
  try {
    requestBody = await req.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
  }

  const { CategoryName } = requestBody;

  // Check for missing data
  if (!CategoryName) {
    return new Response(JSON.stringify({ error: "Missing category name" }), { status: 400 });
  }

  try {
    // Check if the CategoryName already exists (excluding the current category)
    const checkQuery = `
      SELECT * FROM categories WHERE CategoryName = ? AND CategoryID != ?
    `;
    const [existingCategory] = await db.execute(checkQuery, [CategoryName, id]);

    if (existingCategory.length > 0) {
      return new Response(JSON.stringify({ error: "Category name already exists" }), { status: 409 });
    }

    // Update category data
    const updateQuery = `
      UPDATE categories
      SET CategoryName = ?
      WHERE CategoryID = ?
    `;
    const [result] = await db.execute(updateQuery, [CategoryName, id]);

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "Category not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Category updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error updating category:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

