import  db  from "../../../lib/db"; // Adjust path as needed

export async function GET() {
  try {
    const [staffs] = await db.execute("SELECT COUNT(*) AS count FROM staffs");
    const [customers] = await db.execute("SELECT COUNT(*) AS count FROM customers");
    const [suppliers] = await db.execute("SELECT COUNT(*) AS count FROM suppliers");
    const [orders] = await db.execute("SELECT COUNT(*) AS count FROM orders WHERE OrderStatus = 0");
    const [products]=await db.execute("SELECT COUNT(*) AS count FROM products");
    const [deliveries]=await db.execute("SELECT COUNT(*) AS count FROM deliveries");

    const summary = {
      staff: staffs[0].count,
      customers: customers[0].count,
      suppliers: suppliers[0].count,
      pendingOrders: orders[0].count,
      products:products[0].count,
      deliveries:deliveries[0].count,
    };

    return new Response(JSON.stringify(summary), { status: 200 });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch summary" }), { status: 500 });
  }
}
