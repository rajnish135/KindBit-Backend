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
import { chatBot } from "../controllers/chatbot.js";
import { isDonor } from '../middleware/isDonor.js';
import { isReciever } from '../middleware/isReciever.js';

export const router = express.Router();

router.post('/login',login);

router.post('/registerUser',registerUser);                                       

router.post('/donate',authMiddleware,isDonor,upload.single('image'),donate);     //This route is for donors to donate food items

router.get('/allDonations',authMiddleware,allDonations);                         //This route is to get all available donations for receivers

router.get('/userDetails',authMiddleware,userDetails);                           //This route is to get details of logged in user and to display on profile page in frontend just after login

router.get('/donations',authMiddleware,donations);                               //This route is for donors to see their donations

router.post('/claim/:id', authMiddleware,isReciever,claimDonation);              //This route is for receivers to claim a donation

router.post('/submitReview', authMiddleware,isReciever,submitReview);            //This route is for receivers to submit reviews for donors

router.get('/reviews/:donorId', getRecieverReviews);                             //This route is to get all reviews of a particular donor

router.get('/admin/donations', authMiddleware, isAdmin, getAllDonationsForAdmin);  //This route is for admin to get all donations

router.delete('/admin/deleteStaleDonations',authMiddleware,isAdmin,deleteStaleFood);  //This route is for admin to delete stale food items

router.delete('/admin/donations/:foodId',authMiddleware,isAdmin,deleteSingleFoodItem);  //This route is for admin to delete a single food item

router.get('/verify-email',verifyEmail);

router.post('/markReceived/:receiverId',authMiddleware,isReciever,markRecieved);

router.patch('/donations/:id/delete',authMiddleware,isDonor,donorFoodDeleting);   //This route is for donor to delete his/her food item

router.patch('/admin/suspend-user/:userId', authMiddleware,isAdmin, suspendUser);  //This route is for admin to suspend a user

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

router.get('/notifications/:userId',getAllNotifications);

router.put('/notifications/mark-read/:userId',markAsRead);

router.post("/chat", authMiddleware, chatBot);


