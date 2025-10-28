import express from "express";
import { protect } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/admin.middleware";
import {
  createProduct,
  deleteProduct,
  getAllProductsAdmin,
  getProductByIdAdmin,
} from "../controllers/admin.controller";
import { upload, uploadAny } from "../middlewares/upload.middleware";

const router = express.Router();

router.use(protect, isAdmin);

<<<<<<< HEAD
router.post("/products", uploadAny.any(), createProduct);
=======
router.post("/products",upload.array("images"), createProduct);
>>>>>>> 68d2a394103717dc36f9272412b8a7ee8e162415
router.delete("/products/:id", deleteProduct);
router.get("/products", getAllProductsAdmin);
router.get("/products/:id", getProductByIdAdmin);

export default router;
