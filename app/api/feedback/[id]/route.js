import db from '../../../../lib/db'

export async function DELETE(req,{ params }) {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing Feedback ID" }), { status: 400 });
  }
  try {
    // Delete staff member
    const deleteQuery = "DELETE FROM feedbacks WHERE FeedbackID = ?";
    const [result] = await db.execute(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "Feedback not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Feedback deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}



// PUT - Edit staff information by ID
export async function PUT(req, { params }) {
  const { id } = params; // ✅ Access ID correctly

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing Feedback ID" }), { status: 400 });
  }

  // Parse the request body
  let requestBody;
  try {
    requestBody = await req.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
  }

  const { feedback, userID } = requestBody;

  // Check for missing data
  if (!feedback  || !userID) {
    return new Response(JSON.stringify({ error: "Missing feedback data (feedback, or userID)" }), { status: 400 });
  }

  try {


    // Update feedback data
    const updateQuery = `
      UPDATE feedbacks
      SET Feedback = ?, CustomerID = ?
      WHERE FeedbackID = ?
    `;
    const [result] = await db.execute(updateQuery, [feedback, userID, id]);

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "Feedback not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Feedback updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error updating feedback:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}


