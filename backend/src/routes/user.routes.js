const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { validateUserInput } = require('../middleware/validation.middleware');
const asyncHandler = require('../middleware/async.middleware');

// CRUD Routes with validation and async handling
router.post('/', validateUserInput, asyncHandler(userController.createUser));
router.get('/', asyncHandler(userController.getAllUsers));
router.get('/:id', asyncHandler(userController.getUserById));
router.put('/:id', validateUserInput, asyncHandler(userController.updateUser));
router.delete('/:id', asyncHandler(userController.deleteUser));

module.exports = router; 