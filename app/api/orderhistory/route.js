import db from '../../../lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const customerID = searchParams.get("customerID");

    if (!customerID) {
      return new Response(JSON.stringify({ error: "Missing customerID" }), {
        status: 400,
      });
    }

    const query = `
      SELECT 
        o.OrderID, o.OrderDate, o.TotalQuantity, o.TotalPrice, o.OrderStatus,
        od.OrderDetailID, od.ProductID, od.UnitQuantity, od.UnitPrice, od.SubTotal,
        p.ProductTitle, p.Image
      FROM orders o
      LEFT JOIN orderdetails od ON o.OrderID = od.OrderID
      LEFT JOIN products p ON od.ProductID = p.ProductID
      WHERE o.CustomerID = ?
      ORDER BY o.OrderDate DESC
    `;

    const [rows] = await db.execute(query, [customerID]);

    const grouped = {};
    for (const row of rows) {
      if (!grouped[row.OrderID]) {
        grouped[row.OrderID] = {
          OrderID: row.OrderID,
          OrderDate: row.OrderDate,
          TotalQuantity: row.TotalQuantity,
          TotalPrice: row.TotalPrice,
          OrderStatus: row.OrderStatus,
          OrderDetails: [],
        };
      }

      if (row.OrderDetailID) {
        grouped[row.OrderID].OrderDetails.push({
          OrderDetailID: row.OrderDetailID,
          ProductID: row.ProductID,
          ProductName: row.ProductTitle,
          ImageURL: row.Image,
          UnitQuantity: row.UnitQuantity,
          UnitPrice: row.UnitPrice,
          SubTotal: row.SubTotal,
        });
      }
    }

    const result = Object.values(grouped);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error fetching order history:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
