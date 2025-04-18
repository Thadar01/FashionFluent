import db from '../../../lib/db';

export async function POST(request) {
    try {
        const { orderDate, totalQuantity, totalPrice, deliveryID, address, phoneNo, email, orderStatus, carts } = await request.json();

        // Validate products array
        for (const cart of carts) {
            if (!cart.ProductID || !cart.quantity || !cart.price || !cart.totalPrice) {
                return new Response(JSON.stringify({ error: "Invalid product data" }), {
                    status: 400,
                });
            }
        }

        // Start transaction
        await db.query('START TRANSACTION');

        try {
            // Generate new OrderID
            const getLastIdQuery = "SELECT OrderID FROM orders ORDER BY OrderID DESC LIMIT 1";
            const [lastRecord] = await db.execute(getLastIdQuery);

            let newOrderID = "Or-0001"; // Default ID if no records exist

            if (lastRecord.length > 0) {
                const lastId = lastRecord[0].OrderID;
                const numericPart = parseInt(lastId.split("-")[1], 10) + 1;
                newOrderID = `Or-${numericPart.toString().padStart(4, "0")}`;
            }

            // Insert the order data into the orders table
            const insertOrderQuery = `
                INSERT INTO orders (OrderID, OrderDate, TotalQuantity, TotalPrice, DeliveryID, Address, PhoneNo, Email, OrderStatus)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const orderValues = [newOrderID, orderDate, totalQuantity, totalPrice, deliveryID, address, phoneNo, email, orderStatus];
            await db.execute(insertOrderQuery, orderValues);

            // Insert the ordered products into the orderdetails table
            for (const cart of carts) {
                // Generate new OrderDetailID
                const getLastDetailIdQuery = "SELECT OrderDetailID FROM orderdetails ORDER BY OrderDetailID DESC LIMIT 1";
                const [lastDetailRecord] = await db.execute(getLastDetailIdQuery);

                let newOrderDetailID = "OD-0001";

                if (lastDetailRecord.length > 0) {
                    const lastDetailId = lastDetailRecord[0].OrderDetailID;
                    const numericPart = parseInt(lastDetailId.split("-")[1], 10) + 1;
                    newOrderDetailID = `OD-${numericPart.toString().padStart(4, "0")}`;
                }

                const insertProductQuery = `
                    INSERT INTO orderdetails (OrderDetailID, ProductID, UnitQuantity, UnitPrice, SubTotal, OrderID)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
                const productValues = [
                    newOrderDetailID,
                    cart.ProductID,
                    cart.quantity,
                    cart.price,
                    cart.totalPrice,
                    newOrderID,
                ];
                await db.execute(insertProductQuery, productValues);

                // Update product quantity in the products table
                const updateProductQuery = `
                    UPDATE products 
                    SET Stock = Stock - ? 
                    WHERE ProductID = ? AND Stock >= ?
                `;
                const updateValues = [cart.quantity, cart.ProductID, cart.quantity];
                const [result] = await db.execute(updateProductQuery, updateValues);

                if (result.affectedRows === 0) {
                    throw new Error(`Insufficient stock or product not found for ProductID: ${cart.ProductID}`);
                }
            }

            // Commit transaction
            await db.query('COMMIT');

            return new Response(
                JSON.stringify({ message: "Order recorded successfully" }),
                { status: 200 }
            );

        } catch (error) {
            // Rollback transaction on error
            await db.query('ROLLBACK');
            console.error("Error during order processing:", error);

            return new Response(
                JSON.stringify({
                    error: error.message || "Failed to process order",
                    details: error.message.includes("Insufficient stock")
                        ? "One or more products don't have sufficient stock"
                        : null
                }),
                { status: 400 }
            );
        }

    } catch (error) {
        console.error("Error during order recording:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
        });
    }
}


export async function GET(req) {
    try {
      const { searchParams } = new URL(req.url);
      const date = searchParams.get("date"); // Search for a specific date
  
      let searchQuery = "SELECT * FROM orders";
      let queryParams = [];
      let conditions = [];
  
      // Search by a specific date
      if (date) {
        conditions.push("OrderDate = ?");
        queryParams.push(date);
      }
  
      // Append conditions if any exist
      if (conditions.length > 0) {
        searchQuery += " WHERE " + conditions.join(" AND ");
      }
  
      const [rows] = await db.execute(searchQuery, queryParams);
  
      return new Response(JSON.stringify(rows), { status: 200 });
    } catch (error) {
      console.error("Error fetching purchases:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
  }
  
