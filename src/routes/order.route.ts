import express from "express";
import { createOrderFromCart,getOrderById,cancelOrder } from "../controllers/order.controller";
import { protect } from "../middlewares/auth.middleware";


const router = express.Router();

router.use(protect);

router.post("/", createOrderFromCart);
router.get("/:id", getOrderById);
router.delete("/:id", cancelOrder);

export default router;