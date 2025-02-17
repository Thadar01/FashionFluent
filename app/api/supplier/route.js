import db from "../../../lib/db";

export async function POST(request) {
  try {
    const { supplierName,email,phone, address } = await request.json();


    // Check if all fields are provided
    if (!supplierName || !email || !phone || !address) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    const getLastIdQuery = "SELECT SupplierID FROM suppliers ORDER BY SupplierID DESC LIMIT 1";
    const [lastRecord] = await db.execute(getLastIdQuery);

    let newSupplierID = "Sup-001"; // Default ID if no records exist

    if (lastRecord.length > 0) {
      const lastId = lastRecord[0].SupplierID; // Example: "S-009"
      const numericPart = parseInt(lastId.split("-")[1], 10) + 1; // Extract number and increment
      newSupplierID = `Sup-${numericPart.toString().padStart(3, "0")}`; // Format as "S-XXX"
    }

    // Check if the user already exists
    const checkQuery = "SELECT * FROM suppliers WHERE SupplierName = ?";
    const [existingUser] = await db.execute(checkQuery, [supplierName]);


   

    if (existingUser.length > 0) {
      return new Response(
        JSON.stringify({ error: "User with the same name already exists" }),
        { status: 409 } // Conflict status code
      );
    }


    // Proceed with insertion if the user doesn't exist
    const insertQuery =
      "INSERT INTO suppliers (SupplierID,SupplierName,SupplierEmail,SupplierPhoneNo,SupplierAddress) VALUES (?,?, ?, ? , ? )";
    const values = [newSupplierID,supplierName,email,phone,address];
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
