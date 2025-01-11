const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); 

router.get('/', settingsController.getSettings);
router.patch('/profile', settingsController.updateProfile);
router.patch('/password', settingsController.updatePassword);
router.patch('/general', settingsController.updateSettings);
router.patch('/two-factor', settingsController.toggleTwoFactor);
router.get('/sessions', settingsController.getActiveSessions);
router.delete('/sessions/:sessionId', settingsController.terminateSession);

module.exports = router; 