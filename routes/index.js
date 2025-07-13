import express from 'express';
import { login } from '../controllers/login.js';
import {registerUser}  from '../controllers/registerUser.js';
import {donate}  from '../controllers/donate.js'
import {allDonations} from '../controllers/allDonations.js'
import {upload} from '../middleware/multer.js'
import { userDetails } from '../controllers/userDetails.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { donations } from '../controllers/donations.js';
import { claimDonation } from '../controllers/claimDonation.js';
import { submitReview, getRecieverReviews } from '../controllers/reviews.js';
import { getAllDonationsForAdmin } from '../controllers/admin.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { deleteStaleFood } from '../controllers/deleteStaleFood.js';
import { verifyEmail } from '../controllers/verifyEmail.js';
import { markRecieved } from '../controllers/markReceived.js';
import { deleteSingleFoodItem } from '../controllers/deleteSingleFoodItem.js';
import { donorFoodDeleting } from '../controllers/donorFoodDeletion.js';
import { suspendUser } from '../controllers/suspendUser.js';
import { forgotPassword } from '../controllers/forgotPassword.js';
import { resetPassword } from '../controllers/resetPassword.js';
import { getAllNotifications, markAsRead } from '../controllers/notifications.js';


export const router = express.Router();

router.post('/login',login);

router.post('/registerUser',registerUser);

router.post('/donate',authMiddleware,upload.single('image'),donate);

router.get('/allDonations',authMiddleware,allDonations);

router.get('/userDetails',authMiddleware,userDetails);

router.get('/donations',authMiddleware,donations);

router.post('/claim/:id', authMiddleware, claimDonation);

router.post('/submitReview', authMiddleware, submitReview);

router.get('/reviews/:donorId', getRecieverReviews);

router.get('/admin/donations', authMiddleware, isAdmin, getAllDonationsForAdmin);

router.delete('/admin/deleteStaleDonations',authMiddleware,isAdmin,deleteStaleFood)

router.delete('/admin/donations/:foodId',authMiddleware,isAdmin,deleteSingleFoodItem)

router.get('/verify-email',verifyEmail)

router.post('/markReceived/:receiverId',authMiddleware,markRecieved);

router.patch('/donations/:id/delete',authMiddleware,donorFoodDeleting);

router.patch('/admin/suspend-user/:userId', authMiddleware,isAdmin, suspendUser);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

router.get('/notifications/:userId',getAllNotifications);

router.put('/notifications/mark-read/:userId',markAsRead);


