import fs from "fs";
import path from "path";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false, // Disable built-in bodyParser to handle FormData manually
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), "public/uploads"); // Save to public/uploads
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing form data" });
    }

    const imageFile = files.image;
    if (imageFile) {
      // Get the path of the uploaded file
      const tempPath = imageFile.filepath; // Temporary upload path
      const newFilePath = path.join(process.cwd(), "public", "uploads", imageFile.newFilename);

      // Move the file to the desired directory
      fs.rename(tempPath, newFilePath, (renameErr) => {
        if (renameErr) {
          return res.status(500).json({ error: "Error moving the uploaded image" });
        }

        // Store the relative file path in the database
        const filePath = `/uploads/${imageFile.newFilename}`;
        const newProduct = {
          ...fields,
          image: filePath, // Store relative path
        };

        // Store `newProduct` in your database

        return res.status(201).json({ message: "Product created successfully", product: newProduct });
      });
    } else {
      return res.status(400).json({ error: "Image upload failed" });
    }
  });
}
