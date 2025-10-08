
import { Request, Response } from "express";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken";

class AuthController {
  async registerUser(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 5);
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      const token = generateToken(newUser.id);
      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
        token,
      });
    } catch (error) {
      console.error("Error in registerUser:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = generateToken(user.id);
      res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      console.error("Error in loginUser:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async changePassword(req: Request, res: Response) {
    try{
      const userId = (req as any).user.id;
      const { oldPassword, newPassword } = req.body;

      if(!oldPassword || !newPassword) {
        return res.status(400).json({ message: "both password are required" });
      }
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if(!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if(!isOldPasswordValid) {
        return res.status(401).json({ message: "Old password is incorrect" });
      }
      const hashedNewPassword = await bcrypt.hash(newPassword, 5);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword }
      });
      res.status(200).json({ message: "Password changed successfully" });
    }
    catch(error) {
      console.error("Error in changePassword:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  //used to verify if token is valid and then return to client.
  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, createdAt: true },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ user });
    } catch (error) {
      console.error("Error in getProfile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new AuthController();
