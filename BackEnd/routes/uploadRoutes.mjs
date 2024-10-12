// Import Multer and XLSX
import multer from "multer";
import xlsx from "xlsx";
import Phone from "../models/phoneModel.mjs"; // מודל Mongoose לשמירת מספרי טלפון

// Multer setup for file upload
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage });

const uploadExcelFile = async (req, res) => {
  try {
    // Verify the file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Process the Excel file using xlsx
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0]; // First sheet
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet to JSON format
    const data = xlsx.utils.sheet_to_json(sheet);

    // Map data to phone model and save to MongoDB
    const phoneData = data.map((row) => ({
      name: row["name"], // "name" חייב להיות בדיוק כמו בעמודת האקסל
      phoneNumber: row["phone number"], // "phone number" חייב להתאים בדיוק לעמודה
    }));

    await Phone.insertMany(phoneData); // שמירת הנתונים במונגו

    // Send the extracted data as a response
    res.status(200).json({ message: "File uploaded and data saved", data });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ message: "Error processing file" });
  }
};

export default uploadExcelFile;
