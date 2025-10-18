import express from "express";    

import AuthController from '../controllers/auth.controller';

import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);
router.get('/profile', protect, AuthController.getProfile);
router.put('/change-password', protect, AuthController.changePassword);

export default router;