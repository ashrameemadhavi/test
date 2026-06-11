const express = require('express');
const { body } = require('express-validator');
const featureController = require('../controllers/featureController');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', featureController.getAll);
router.get('/:id', featureController.getById);

router.post(
  '/',
  authenticate,
  requireAdmin,
  [
    body('feature_name').trim().notEmpty().withMessage('Feature name is required'),
    body('cost').isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
    body('days').isInt({ min: 0 }).withMessage('Days must be a positive integer'),
    body('complexity_weight').isFloat({ min: 0 }).withMessage('Complexity weight must be positive'),
  ],
  featureController.create
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  [
    body('feature_name').optional().trim().notEmpty(),
    body('cost').optional().isFloat({ min: 0 }),
    body('days').optional().isInt({ min: 0 }),
    body('complexity_weight').optional().isFloat({ min: 0 }),
  ],
  featureController.update
);

router.delete('/:id', authenticate, requireAdmin, featureController.remove);

module.exports = router;
