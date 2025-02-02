import db from "../../../lib/db";

export async function GET() {
    try{
        const [rows]=await db.query('SELECT * FROM staff');
        return Response.json(rows,{status:200});
    }catch(error){
        return Response.json({message:'Error fetching staff',error})
    }
}

export async function POST(request) {
    try {
      const { email, passwords, role } = await request.json();
      console.log(email,passwords)
  
      // Check if all fields are provided
      if (!email || !passwords || !role) {
        return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
      }
  
      // Query the database for the user
      const [rows] = await db.query(
        'SELECT * FROM staff WHERE StaffEmail = ? AND StaffRole = ? LIMIT 1',
        [email, role]
      );
  
      if (rows.length === 0) {
        return new Response(JSON.stringify({ error: 'Staff not found or role mismatch' }), { status: 404 });
      }
  
      const staff = rows[0];
  
      // Verify the password
     if (passwords !== staff.StaffPasswords) {
      return new Response(
        JSON.stringify({ error: 'Invalid password' }),
        { status: 401 }
      );
    }
  
      // Authentication successful
      return new Response(
        JSON.stringify({ 
            message: 'Authentication successful', 
            staff: { id: staff.StaffID, name: staff.StaffName, role }
        }),
        { status: 200 }
    );
    } catch (error) {
      console.error('Error during authentication:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
  }
