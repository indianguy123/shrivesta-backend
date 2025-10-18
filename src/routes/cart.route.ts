import express from "express";
import { addToCart,getCart,updateCartItem,removeCartItem } from "../controllers/cart.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(protect);    

router.post("/", addToCart);
router.get("/", getCart);
router.put("/:id", updateCartItem);
router.delete("/:id", removeCartItem);

export default router;