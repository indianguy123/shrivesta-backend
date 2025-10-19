import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { limiter } from "./middlewares/rateLimiter.middleware";
import compression from "compression";
import authRoutes from "./routes/auth.route";
import productRoutes from "./routes/product.route";
import orderRoutes from "./routes/order.route";
import cartRoutes from "./routes/cart.route";

const app = express();
app.use(cors({
  origin: "*",
  credentials: true,
}));


const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);
//app.use(compression());
app.use(limiter);
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/cart', cartRoutes);


app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
