// routes/user.route.js
import express from 'express';
import { signupUser, loginUser, logoutUser, adminLogin, logoutAdmin } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/logout',logoutUser);
router.post('/admin-login',adminLogin);
router.get('/admin-logout', logoutAdmin);

export default router;
