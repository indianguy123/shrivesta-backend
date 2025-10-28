import { Request, Response } from "express";
import prisma from "../config/prisma";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
type UploadedImage = {
  url: string;
  publicId: string;
};
export const createProduct = async (req: Request, res: Response) => {
  try {
    console.log("=== Product Creation Request ===");
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    console.log("Request headers:", req.headers);

    // Check for multer errors in the request
    if ((req as any).fileValidationError) {
      return res.status(400).json({
        message: "File validation error",
        error: (req as any).fileValidationError,
      });
    }

    const {
      product,
      subtitle,
      oldPrice,
      salePrice,
      rating,
      ratingCount,
      subcategory,
    } = req.body;

    const files = req.files as Express.Multer.File[];
    console.log("Files received:", files);

    if (!files || files.length === 0) {
      console.log("No files uploaded");
      return res
        .status(400)
        .json({ message: "Please upload at least one image" });
    }

    const uploadPromises: Promise<UploadedImage>[] = files.map(async (file) => {
      console.log(
        `Uploading file: ${file.originalname}, path: ${file.path}, size: ${file.size}`
      );
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
        console.log(
          `Successfully uploaded to Cloudinary: ${result.secure_url}`
        );
        fs.unlinkSync(file.path);
        return { url: result.secure_url, publicId: result.public_id };
      } catch (uploadError) {
        console.error(`Failed to upload ${file.originalname}:`, uploadError);
        throw uploadError;
      }
    });

    const uploadedImages: UploadedImage[] = await Promise.all(uploadPromises);
    console.log("All images uploaded successfully:", uploadedImages);

    const imageUrls = uploadedImages.map((img) => img.url);
    const imagePublicIds = uploadedImages.map((img) => img.publicId);
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
        imagePublicIds,
      },
    });

    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error: any) {
    console.error("Error creating product:", error);
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.imagePublicIds && product.imagePublicIds.length > 0) {
      const deletePromises = product.imagePublicIds.map(async (publicId) => {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error(`Failed to delete Cloudinary image: ${publicId}`, err);
        }
      });
      await Promise.all(deletePromises);
    }

    await prisma.product.delete({ where: { id: Number(id) } });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
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
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

export const getProductByIdAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error: any) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
};
