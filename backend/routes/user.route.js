// routes/user.route.js
import express from 'express';
import { signupUser, loginUser, logoutUser, adminLogin, logoutAdmin, requestPasswordReset,  resetPassword} from '../controllers/user.controller.js';
import { getDashboardData, getPaymentsOverview } from '../controllers/data.controller.js';
import isAdmin from '../middlewares/isAdmin.js'; // Admin-only access middleware

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/logout',logoutUser);
router.post('/admin-login',adminLogin);
router.get('/admin-logout', logoutAdmin);
router.get('/dashboard-data',isAdmin,getDashboardData);
router.get('/payments-data',isAdmin, getPaymentsOverview);
router.post('/request-password-reset',requestPasswordReset);
router.post('/reset-password',resetPassword);
export default router;
