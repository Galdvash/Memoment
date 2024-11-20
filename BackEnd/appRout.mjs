// routes/index.mjs
import express from "express";
import userRoutes from "./routes/userRoutes.mjs";
import imageRoutes from "./routes/imageRoutes.mjs";
import selfieRoutes from "./routes/selfieRoutes.mjs";
import excelRoutes from "./routes/excelRoutes.mjs";
import twilioRoutes from "./routes/twilioRoutes.mjs";
import albumRoutes from "./routes/albumRoutes.mjs";
import eventRoutes from "./routes/eventRoutes.mjs";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/images", imageRoutes);
router.use("/selfies", selfieRoutes);
router.use("/excel", excelRoutes);
router.use("/twilio", twilioRoutes);
router.use("/albums", albumRoutes);
router.use("/events", eventRoutes);

export default router;
