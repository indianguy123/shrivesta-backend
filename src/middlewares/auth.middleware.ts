import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";

export interface AuthRequest extends Request {
  user?: any;
}


export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    req.user = await prisma.user.findUnique({ where: { id: decoded.id } });
    next();
  } catch {
    res.status(401).json({ message: "Token failed or expired" });
  }
};