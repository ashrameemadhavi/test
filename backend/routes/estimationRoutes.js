const express = require('express');
const { body } = require('express-validator');
const estimationController = require('../controllers/estimationController');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/estimate',
  [
    body('project_type_id').isInt({ min: 1 }).withMessage('Valid project type is required'),
    body('feature_ids').optional().isArray().withMessage('Feature IDs must be an array'),
    body('client_name').optional().trim().notEmpty(),
    body('email').optional().isEmail(),
    body('save').optional().isBoolean(),
  ],
  estimationController.createEstimate
);

router.get('/estimations', authenticate, requireAdmin, estimationController.getAll);
router.get('/estimations/:id', estimationController.getById);

module.exports = router;
