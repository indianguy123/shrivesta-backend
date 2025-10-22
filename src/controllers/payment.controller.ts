import { Request, Response } from "express";
import { stripe } from "../config/stripe";

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "inr",
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ message: "Payment creation failed", error: error.message });
  }
};
//payment is working
