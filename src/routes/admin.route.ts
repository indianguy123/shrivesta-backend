import express from "express";
import { protect } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/admin.middleware";
import {
  createProduct,
  deleteProduct,
  getAllProductsAdmin,
  getProductByIdAdmin,
} from "../controllers/admin.controller";

const router = express.Router();

router.use(protect, isAdmin);

router.post("/products", createProduct);
router.delete("/products/:id", deleteProduct);
router.get("/products", getAllProductsAdmin);
router.get("/products/:id", getProductByIdAdmin);

export default router;
