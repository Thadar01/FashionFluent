import db from "../../../lib/db";

export async function POST(request) {
  try {
    const { customerName, customerEmail, customerPasswords} = await request.json();


    // Check if all fields are provided
    if (!customerName || !customerPasswords || !customerEmail) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    const getLastIdQuery = "SELECT CustomerID FROM customers ORDER BY CustomerID DESC LIMIT 1";
    const [lastRecord] = await db.execute(getLastIdQuery);

    let newCustomerID = "C-001"; // Default ID if no records exist

    if (lastRecord.length > 0) {
      const lastId = lastRecord[0].CustomerID; // Example: "S-009"
      const numericPart = parseInt(lastId.split("-")[1], 10) + 1; // Extract number and increment
      newCustomerID = `C-${numericPart.toString().padStart(3, "0")}`; // Format as "S-XXX"
    }




    const checkEmail="SELECT * FROM customers WHERE CustomerEmail=?";
    const [existingEmail]=await db.execute(checkEmail,[customerEmail]);



    if (existingEmail.length > 0) {
      return new Response(
        JSON.stringify({ error: "This email is already registered." }),
        { status: 409 } // Conflict status code
      );
    }

    // Proceed with insertion if the user doesn't exist
    const insertQuery =
      "INSERT INTO customers (CustomerID,CustomerName,CustomerEmail,CustomerPasswords) VALUES (?,?, ?, ?)";
    const values = [newCustomerID,customerName,customerEmail,customerPasswords];
    await db.execute(insertQuery, values);

    return new Response(
      JSON.stringify({ message: "Register successful" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during sign up:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}


export async function GET(req) {
    try {
      const { searchParams } = new URL(req.url);
      const query = searchParams.get("q"); // Search term
  
      let searchQuery = "SELECT * FROM customers WHERE 1=1";
      let queryParams = [];
  
      if (query) {
        searchQuery += " AND CustomerName LIKE ?";
        queryParams.push(`%${query}%`);
      }

      const [rows] = await db.execute(searchQuery, queryParams);
  
      return new Response(JSON.stringify(rows), { status: 200 });
    } catch (error) {
      console.error("Error fetching Customers:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
  }