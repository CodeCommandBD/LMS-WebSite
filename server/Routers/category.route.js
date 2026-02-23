import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../Controller/category.controller.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", authenticate, authorize("admin", "teacher"), createCategory);
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "teacher"),
  deleteCategory,
);

export default router;
