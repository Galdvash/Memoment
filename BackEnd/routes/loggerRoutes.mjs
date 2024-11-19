import express from "express";
import morganMiddleware from "../middleware/morganMiddleware.mjs";

const router = express.Router();

// Add Morgan middleware
router.use(morganMiddleware);

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Logger route is working!" });
});

export default router;
