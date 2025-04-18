import db from '../../../lib/db'
export async function POST(request) {
    try {
      const {  SupplierID, StaffID, Date, totalQuantity, totalPrice, products } = await request.json();
  
      // Check if all required fields are provided
      if (!SupplierID || !StaffID || !Date || !totalQuantity || !totalPrice || !products) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
        });
      }
  
      // Validate products array
      for (const product of products) {
        if (!product.ProductID || !product.quantity || !product.price || !product.totalPrice) {
          return new Response(JSON.stringify({ error: "Invalid product data" }), {
            status: 400,
          });
        }
      }
  
      // Generate new PurchaseID
      const getLastIdQuery = "SELECT PurchaseID FROM purchase ORDER BY PurchaseID DESC LIMIT 1";
      const [lastRecord] = await db.execute(getLastIdQuery);
  
      let newPurchaseID = "Pur-001"; // Default ID if no records exist
  
      if (lastRecord.length > 0) {
        const lastId = lastRecord[0].PurchaseID; // Example: "Pur-009"
        const numericPart = parseInt(lastId.split("-")[1], 10) + 1; // Extract number and increment
        newPurchaseID = `Pur-${numericPart.toString().padStart(3, "0")}`; // Format as "Pur-XXX"
      }
  
      // Insert the purchase data into the purchases table
      const insertPurchaseQuery = `
        INSERT INTO purchase (PurchaseID, TotalQuantity, TotalPrice, Date, SupplierID, StaffID)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const purchaseValues = [newPurchaseID, totalQuantity, totalPrice, Date, SupplierID, StaffID];
      await db.execute(insertPurchaseQuery, purchaseValues);
  
      // Insert the purchased products into the purchase_products table
      for (const product of products) {
        // Generate new PurchaseDetailID
        const getLastIdQuery = "SELECT PurchasedetailID FROM purchasedetails ORDER BY PurchasedetailID DESC LIMIT 1";
        const [lastRecord] = await db.execute(getLastIdQuery);
      
        let newPurchaseDetailID = "PD-001";
        if (lastRecord.length > 0) {
          const lastId = lastRecord[0].PurchasedetailID;
          const numericPart = parseInt(lastId.split("-")[1], 10) + 1;
          newPurchaseDetailID = `PD-${numericPart.toString().padStart(3, "0")}`;
        }
      
        // Insert into purchasedetails
        const insertProductQuery = `
          INSERT INTO purchasedetails (PurchaseDetailID, ProductID, UnitQuantity, UnitPrice, UnitTotalPrice, PurchaseID)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        const productValues = [
          newPurchaseDetailID,
          product.ProductID,
          product.quantity,
          product.price,
          product.totalPrice,
          newPurchaseID,
        ];
        await db.execute(insertProductQuery, productValues);
      
        // ✅ Update product quantity
        const updateProductQuantityQuery = `
          UPDATE products
          SET Stock = Stock + ?
          WHERE ProductID = ?
        `;
        await db.execute(updateProductQuantityQuery, [product.quantity, product.ProductID]);
      }
      
  
      return new Response(
        JSON.stringify({ message: "Purchase recorded successfully" }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error during purchase recording:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
      });
    }
  }

  export async function GET(req) {
    try {
      const { searchParams } = new URL(req.url);
      const date = searchParams.get("date"); // Search for a specific date
  
      let searchQuery = "SELECT * FROM purchase";
      let queryParams = [];
      let conditions = [];
  
      // Search by a specific date
      if (date) {
        conditions.push("Date = ?");
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
  
  
  
  