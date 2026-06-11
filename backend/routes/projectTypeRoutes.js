const express = require('express');
const { body } = require('express-validator');
const projectTypeController = require('../controllers/projectTypeController');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', projectTypeController.getAll);
router.get('/:id', projectTypeController.getById);

router.post(
  '/',
  authenticate,
  requireAdmin,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('base_cost').isFloat({ min: 0 }).withMessage('Base cost must be a positive number'),
    body('base_days').isInt({ min: 0 }).withMessage('Base days must be a positive integer'),
  ],
  projectTypeController.create
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  [
    body('name').optional().trim().notEmpty(),
    body('base_cost').optional().isFloat({ min: 0 }),
    body('base_days').optional().isInt({ min: 0 }),
  ],
  projectTypeController.update
);

router.delete('/:id', authenticate, requireAdmin, projectTypeController.remove);

module.exports = router;
