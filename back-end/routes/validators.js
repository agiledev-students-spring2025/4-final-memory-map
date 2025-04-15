import { body } from 'express-validator';

export const validateUser = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character')
];

export const validateLogin = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required'),
    
    body('password')
        .notEmpty().withMessage('Password is required')
];

export const validatePin = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 100 }).withMessage('Title cannot be more than 100 characters'),
    
    body('description')
        .trim()
        .isLength({ max: 500 }).withMessage('Description cannot be more than 500 characters'),
    
    body('latitude')
        .isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
    
    body('longitude')
        .isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
    
    body('tags')
        .optional()
        .isArray().withMessage('Tags must be an array')
        .custom((tags) => {
            if (tags && tags.length > 10) {
                throw new Error('Cannot have more than 10 tags');
            }
            return true;
        })
];

export const validateRegistration = [
    ...validateUser,
    body('confirmPassword')
        .notEmpty().withMessage('Please confirm your password')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
]; 