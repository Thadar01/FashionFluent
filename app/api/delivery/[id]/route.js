import db from '../../../../lib/db'

export async function DELETE(req,{ params }) {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing Delivery ID" }), { status: 400 });
  }
  try {
    // Delete staff member
    const deleteQuery = "DELETE FROM deliveries WHERE DeliveryID = ?";
    const [result] = await db.execute(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "Delivery not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Delivery deleted successfully" }), { status: 200 });
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
    const searchQuery = "SELECT * FROM deliveries WHERE DeliveryID = ?";
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
    return new Response(JSON.stringify({ error: "Missing delivery ID" }), { status: 400 });
  }

  // Parse the request body
  let requestBody;
  try {
    requestBody = await req.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
  }

  const { region, cost } = requestBody;

  // Check for missing data
  if (!region  || !cost) {
    return new Response(JSON.stringify({ error: "Missing delivery data (region, or cost)" }), { status: 400 });
  }

  try {
    const checkQuery = `
      SELECT * FROM deliveries WHERE DeliveryRegion = ?  AND DeliveryID != ?
    `;
    const [existingDelivery] = await db.execute(checkQuery, [region, id]);

    if (existingDelivery.length > 0) {
      return new Response(JSON.stringify({ error: "Same region already exist" }), { status: 409 });
    }

    // Update delivery data
    const updateQuery = `
      UPDATE deliveries
      SET DeliveryRegion = ?, DeliveryCost = ?
      WHERE DeliveryID = ?
    `;
    const [result] = await db.execute(updateQuery, [region, cost, id]);

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "Delivery not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Delivery updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error updating delivery:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}


