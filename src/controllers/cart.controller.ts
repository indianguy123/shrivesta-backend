import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required",
      });
    }

    // Check if product already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: { userId, productId },
    });

    if (existingItem) {
      // Update quantity
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
      return res
        .status(200)
        .json({ success: true, message: "Quantity updated", data: updated });
    }

    // Add new item
    const newItem = await prisma.cartItem.create({
      data: { userId, productId, quantity },
    });

    return res
      .status(201)
      .json({ success: true, message: "Added to cart", data: newItem });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        data: { items: [], total: 0 },
      });
    }

    // Subtotal = sum of (price * quantity)
    const subtotal = cartItems.reduce(
      (acc: any, item: any) => acc + item.product.salePrice * item.quantity,
      0
    );

    const shipping = subtotal > 1000 ? 0 : 100; // free shipping above 1000
    const total = subtotal + shipping;

    return res.status(200).json({ 
      success: true,
      message: "Cart fetched successfully",
      data: {
        items: cartItems,
        summary: {
          subtotal,
          shipping,
          total,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    const cartItem = await prisma.cartItem.findFirst({
      where: { userId, productId: Number(productId) },
    });

    if (!cartItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
    });

    res
      .status(200)
      .json({ success: true, message: "Cart updated", data: updatedItem });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { productId } = req.params;

    const cartItem = await prisma.cartItem.findFirst({
      where: { userId, productId: Number(productId) },
    });

    if (!cartItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    await prisma.cartItem.delete({ where: { id: cartItem.id } });

    res.status(200).json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//cart route working
