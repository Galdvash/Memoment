import express from "express";
import { upload, uploadExcelFile } from "../controllers/excelController.mjs";

const router = express.Router();

// Route for uploading Excel file
router.post("/upload", upload.single("file"), uploadExcelFile);
export default router;
