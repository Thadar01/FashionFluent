import db from '../../../../lib/db'

export async function DELETE(req,{ params }) {
  const { id } = params;

  if (!id) {
    console.log('no id')
    return new Response(JSON.stringify({ error: "Missing category ID" }), { status: 400 });
  }
  try {
    // Delete staff member
    const deleteQuery = "DELETE FROM orders WHERE OrderID = ?";
    const [result] = await db.execute(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Order deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
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
  
    const { OrderStatus } = requestBody;
  
    // Check for missing data
    if (!OrderStatus) {
      return new Response(JSON.stringify({ error: "Missing order name" }), { status: 400 });
    }
  
    try {
      // Check if the OrderStatus already exists (excluding the current category)
      const checkQuery = `
        SELECT * FROM orders WHERE OrderStatus = ? AND OrderID != ?
      `;
      const [existingCategory] = await db.execute(checkQuery, [OrderStatus, id]);
  
      // Update category data
      const updateQuery = `
        UPDATE orders
        SET OrderStatus = ?
        WHERE OrderID = ?
      `;
      const [result] = await db.execute(updateQuery, [OrderStatus, id]);
  
      if (result.affectedRows === 0) {
        return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
      }
  
      return new Response(JSON.stringify({ message: "Order updated successfully" }), { status: 200 });
    } catch (error) {
      console.error("Error updating Order:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
  }
  