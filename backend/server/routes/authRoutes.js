import express from 'express';
import {
  signupUser,
  verifyUserEmail,
  loginUser,
  resendVerificationEmail,
  requestPasswordResetLink,
  resetUserPassword,
  handleGoogleSignIn,
  changeUserPassword
} from '../services/authServiceInternal.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const result = await signupUser(email, password, name);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    const result = await verifyUserEmail(token);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.status(200).json(result);
  } catch (error) {
    const responseJson = { message: error.message };
    if (error.needsVerification) responseJson.needsVerification = true;
    if (error.emailForResend) responseJson.emailForResend = error.emailForResend;
    if (error.useGoogleSignIn) responseJson.useGoogleSignIn = true;
    res.status(error.statusCode || 500).json(responseJson);
  }
});

router.post('/resend-verification-email', async (req, res) => {
    try {
        const { email } = req.body;
        const result = await resendVerificationEmail(email);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

router.post('/request-password-reset', async (req, res) => {
    try {
        const { email } = req.body;
        const result = await requestPasswordResetLink(email);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const result = await resetUserPassword(token, newPassword);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

router.post('/google-signin', async (req, res) => {
  try {
    const { idToken } = req.body;
    const result = await handleGoogleSignIn(idToken);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.post('/change-password', async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body; 
        const result = await changeUserPassword(userId, currentPassword, newPassword);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

export default router;
