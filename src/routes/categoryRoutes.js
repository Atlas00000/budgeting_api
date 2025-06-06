const express = require('express');
const { body, param } = require('express-validator');
const CategoryController = require('../controllers/categoryController');

const router = express.Router();

// Enhanced validation rules
const categoryValidation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .trim()
    .escape(),
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
    .trim()
    .escape()
];

// ID validation middleware
const validateId = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid category ID')
];

router.get('/', CategoryController.getAll);
router.get('/:id', validateId, CategoryController.getById);
router.post('/', categoryValidation, CategoryController.create);
router.put('/:id', [...validateId, ...categoryValidation], CategoryController.update);
router.delete('/:id', validateId, CategoryController.delete);

module.exports = router; 