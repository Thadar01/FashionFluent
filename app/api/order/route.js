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

        // Generate new OrderID
        const getLastIdQuery = "SELECT OrderID FROM orders ORDER BY OrderID DESC LIMIT 1";
        const [lastRecord] = await db.execute(getLastIdQuery);

        let newOrderID = "Or-0001"; // Default ID if no records exist

        if (lastRecord.length > 0) {
            const lastId = lastRecord[0].OrderID; // Example: "Or-009"
            const numericPart = parseInt(lastId.split("-")[1], 10) + 1; // Extract number and increment
            newOrderID = `Or-${numericPart.toString().padStart(4, "0")}`; // Format as "Or-XXXX"
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

            let newOrderDetailID = "OD-0001"; // Default ID if no records exist

            if (lastDetailRecord.length > 0) {
                const lastDetailId = lastDetailRecord[0].OrderDetailID; // Example: "OD-009"
                const numericPart = parseInt(lastDetailId.split("-")[1], 10) + 1; // Extract number and increment
                newOrderDetailID = `OD-${numericPart.toString().padStart(4, "0")}`; // Format as "OD-XXXX"
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
                newOrderID, // Use the generated OrderID
            ];
            await db.execute(insertProductQuery, productValues);
        }

        return new Response(
            JSON.stringify({ message: "Order recorded successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error during order recording:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
        });
    }
}


  
  