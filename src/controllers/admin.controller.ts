import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { product, subtitle, oldPrice, salePrice, rating, ratingCount, subcategory, imageUrls } = req.body;

    if (!Array.isArray(imageUrls)) {
      return res.status(400).json({ message: "imageUrls must be an array of strings" });
    }

    const newProduct = await prisma.product.create({
      data: {
        product,
        subtitle,
        oldPrice: parseFloat(oldPrice),
        salePrice: parseFloat(salePrice),
        rating: parseFloat(rating),
        ratingCount: parseInt(ratingCount),
        subcategory,
        imageUrls,
      },
    });

    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error: any) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};



export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({ where: { id: Number(id) } });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

export const getAllProductsAdmin = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: "desc" },
    });
    res.status(200).json({ count: products.length, products });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

export const getProductByIdAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id: Number(id) } });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error: any) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};
