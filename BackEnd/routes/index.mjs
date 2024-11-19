// routes/index.mjs
import express from "express";
import userRoutes from "./userRoutes.mjs";
import imageRoutes from "./imageRoutes.mjs";
import selfieRoutes from "./selfieRoutes.mjs";
import excelRoutes from "./excelRoutes.mjs";
import twilioRoutes from "./twilioRoutes.mjs";
import albumRoutes from "./albumRoutes.mjs";
import eventRoutes from "./eventRoutes.mjs";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/images", imageRoutes);
router.use("/selfies", selfieRoutes);
router.use("/excel", excelRoutes);
router.use("/twilio", twilioRoutes);
router.use("/albums", albumRoutes);
router.use("/events", eventRoutes);

export default router;
