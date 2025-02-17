import db from "../../../lib/db";

export async function POST(request) {
  try {
    const { region,city,cost } = await request.json();


    // Check if all fields are provided
    if (!region || !city || !cost ) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    const getLastIdQuery = "SELECT DeliveryID FROM deliveries ORDER BY DeliveryID DESC LIMIT 1";
    const [lastRecord] = await db.execute(getLastIdQuery);

    let newDeliveryID = "D-001"; // Default ID if no records exist

    if (lastRecord.length > 0) {
      const lastId = lastRecord[0].DeliveryID; // Example: "S-009"
      const numericPart = parseInt(lastId.split("-")[1], 10) + 1; // Extract number and increment
      newDeliveryID = `D-${numericPart.toString().padStart(3, "0")}`; // Format as "S-XXX"
    }

    // Check if the user already exists
    const checkQuery = "SELECT * FROM deliveries WHERE DeliveryRegion = ?";
    const [existingUser] = await db.execute(checkQuery, [region]);


   

    if (existingUser.length > 0) {
      return new Response(
        JSON.stringify({ error: "This region already exists" }),
        { status: 409 } // Conflict status code
      );
    }


    // Proceed with insertion if the user doesn't exist
    const insertQuery =
      "INSERT INTO deliveries (DeliveryID,DeliveryRegion,DeliveryCity,DeliveryCost) VALUES (?,?, ?, ? )";
    const values = [newDeliveryID,region,city,cost];
    await db.execute(insertQuery, values);

    return new Response(
      JSON.stringify({ message: "Adding data successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during sign up:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
