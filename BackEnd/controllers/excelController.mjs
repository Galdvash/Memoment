// Import Multer and XLSX
import multer from "multer";
import xlsx from "xlsx";
import Phone from "../models/phoneModel.mjs"; // Your MongoDB model for saving phone numbers

// Multer setup for file upload
const storage = multer.memoryStorage(); // Store file in memory
export const upload = multer({ storage });

// Controller for uploading and processing Excel files
export const uploadExcelFile = async (req, res) => {
  try {
    // Verify if a file is uploaded
    if (!req.file || !req.file.mimetype.includes("spreadsheet")) {
      return res.status(400).json({ message: "Invalid file type" });
    }

    // Process the Excel file using xlsx
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0]; // First sheet
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet to JSON format
    const data = xlsx.utils.sheet_to_json(sheet);
    console.log("Excel Data:", data); // Log for debug

    // Map data to phone model and save to MongoDB
    const phoneData = data.map((row) => ({
      name: row["name"], // Assumes Hebrew key for "name"
      phoneNumber: row["phone number"], // Assumes Hebrew key for "phone number"
    }));

    await Phone.insertMany(phoneData); // Save to MongoDB

    // Send the extracted data as a response
    res.status(200).json({ message: "File uploaded and data saved", data });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ message: "Error processing file" });
  }
};
