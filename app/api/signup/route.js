import db from "../../../lib/db";

export async function POST(request) {
  try {
    const { staffName,email,phone, passwords, role } = await request.json();

    console.log(role);

    // Check if all fields are provided
    if (!staffName || !passwords || !role) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    const getLastIdQuery = "SELECT StaffID FROM staff ORDER BY StaffID DESC LIMIT 1";
    const [lastRecord] = await db.execute(getLastIdQuery);

    let newStaffID = "S-001"; // Default ID if no records exist

    if (lastRecord.length > 0) {
      const lastId = lastRecord[0].StaffID; // Example: "S-009"
      const numericPart = parseInt(lastId.split("-")[1], 10) + 1; // Extract number and increment
      newStaffID = `S-${numericPart.toString().padStart(3, "0")}`; // Format as "S-XXX"
    }

    // Check if the user already exists
    const checkQuery = "SELECT * FROM staff WHERE StaffName = ?";
    const [existingUser] = await db.execute(checkQuery, [staffName]);


    const checkEmail="SELECT * FROM staff WHERE StaffEmail=?";
    const [existingEmail]=await db.execute(checkEmail,[email]);

    if (existingUser.length > 0) {
      return new Response(
        JSON.stringify({ error: "User with the same name already exists" }),
        { status: 409 } // Conflict status code
      );
    }

    if (existingEmail.length > 0) {
      return new Response(
        JSON.stringify({ error: "User with the same email already exists" }),
        { status: 409 } // Conflict status code
      );
    }

    // Proceed with insertion if the user doesn't exist
    const insertQuery =
      "INSERT INTO staff (StaffID,StaffName,StaffEmail,StaffPhoneNo,StaffPasswords, StaffRole) VALUES (?,?, ?, ? , ? ,? )";
    const values = [newStaffID,staffName,email,phone, passwords, role];
    await db.execute(insertQuery, values);

    return new Response(
      JSON.stringify({ message: "Sign Up successful" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during sign up:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
