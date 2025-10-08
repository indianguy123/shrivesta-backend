//currently only customer specific fuctionality is added
//admin will be added later

import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    //have to add sortBy in the frontend so it comes as parmas
    const {  subcategory, sortBy } = req.query;
    const filters: any = {};
    if (subcategory) filters.subcategory = subcategory;
    let orderBy: any = {};
    if (sortBy === "price_low_to_high") {
      orderBy = { price: "asc" };
    } else if (sortBy === "price_high_to_low") {
      orderBy = { price: "desc" };
    } else if (sortBy === "rating_low_to_high") {
      orderBy = { rating: "asc" };
    } else if (sortBy === "rating_high_to_low") {
      orderBy = { rating: "desc" };
    } else {
      orderBy = { createdAt: "desc" };
    }
    const products = await prisma.product.findMany({
      where: filters,
      orderBy,
    });

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//id will be from params
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error: any) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};