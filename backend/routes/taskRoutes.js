import express from "express";
import { listTasks, createTask, updateTask } from "../controllers/taskController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, listTasks);
router.post("/", protect, authorize("admin"), createTask);
router.put("/:id", protect, authorize("admin", "field_officer"), updateTask);

export default router;
