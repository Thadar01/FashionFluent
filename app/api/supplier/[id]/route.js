import db from '../../../../lib/db'

export async function DELETE(req,{ params }) {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing supplier ID" }), { status: 400 });
  }  try {
    // Delete staff member
    const deleteQuery = "DELETE FROM suppliers WHERE SupplierID = ?";
    const [result] = await db.execute(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "Supplier not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Supplier deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

export async function GET(req, { params }) {
  const { id } = params; // ✅ Access ID correctly
  
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing supplier ID" }), { status: 400 });
  }

  try {
    // Search for the staff by ID
    const searchQuery = "SELECT * FROM suppliers WHERE SupplierID = ?";
    const [result] = await db.execute(searchQuery, [id]);

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: "Supplier not found" }), { status: 404 });
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
    return new Response(JSON.stringify({ error: "Missing supplier ID" }), { status: 400 });
  }

  // Parse the request body
  let requestBody;
  try {
    requestBody = await req.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
  }

  const { supplierName, email, phone, address } = requestBody;

  if (!supplierName || !email || !phone || !address) {
    return new Response(JSON.stringify({ error: "Missing supplier data" }), { status: 400 });
  }

  try {
    // Update supplier data
    const updateQuery = `
      UPDATE suppliers
      SET SupplierName = ?, SupplierEmail = ?, SupplierPhoneNo = ?, SupplierAddress = ?
      WHERE SupplierID = ?
    `;
    const [result] = await db.execute(updateQuery, [supplierName, email, phone, address, id]);

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "Supplier not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Supplier updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error updating supplier:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
