//order can be placed only from the cart.



import { Request, Response } from "express";
import { PrismaClient } from '../generated/prisma';


const prisma = new PrismaClient();
export const createOrderFromCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { shippingAddress, paymentMethod } = req.body;
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Your cart is empty." });
    }
    const totalAmount = cartItems.reduce(
      (acc:any, item:any) => acc + item.product.price * item.quantity,
      0
    );
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        shippingAddress,
        paymentMethod,
        status: "pending",
      },
    });

    const orderItemsData = cartItems.map((item:any) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));

    await prisma.orderItem.createMany({ data: orderItemsData });

    await prisma.cartItem.deleteMany({ where: { userId } });

    return res.status(201).json({
      message: "Order placed successfully.",
      orderId: order.id,
    });
  } catch (error: any) {
    console.error("Error creating order from cart:", error);
    res.status(500).json({
      message: "Failed to place order.",
      error: error.message,
    });
  }
};

//after plcaing the order , we would show this.
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
 
    if (!order) return res.status(404).json({ message: "Order not found." });
    if (order.userId !== userId)
      return res.status(403).json({ message: "Not authorized." });

    res.status(200).json(order);
  } catch (error: any) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      message: "Failed to fetch order.",
      error: error.message,
    });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
    });

    if (!order) return res.status(404).json({ message: "Order not found." });
    if (order.userId !== userId)
      return res.status(403).json({ message: "Not authorized." });
    if (order.status !== "pending")
      return res
        .status(400)
        .json({ message: "Cannot cancel order that is already processed." });

    await prisma.order.update({
      where: { id: Number(id) },
      data: { status: "cancelled" },
    });

    res.status(200).json({ message: "Order cancelled successfully." });
  } catch (error: any) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      message: "Failed to cancel order.",
      error: error.message,
    });
  }
};

//add admin here.