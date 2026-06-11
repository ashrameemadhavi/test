const express = require('express');
const { body } = require('express-validator');
const adminController = require('../controllers/adminController');
const featureController = require('../controllers/featureController');
const projectTypeController = require('../controllers/projectTypeController');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, requireAdmin);

router.get('/dashboard', adminController.getDashboard);

router.post(
  '/feature',
  [
    body('feature_name').trim().notEmpty(),
    body('cost').isFloat({ min: 0 }),
    body('days').isInt({ min: 0 }),
    body('complexity_weight').isFloat({ min: 0 }),
  ],
  featureController.create
);

router.put(
  '/feature/:id',
  [
    body('feature_name').optional().trim().notEmpty(),
    body('cost').optional().isFloat({ min: 0 }),
    body('days').optional().isInt({ min: 0 }),
    body('complexity_weight').optional().isFloat({ min: 0 }),
  ],
  featureController.update
);

router.delete('/feature/:id', featureController.remove);

router.post(
  '/project-type',
  [
    body('name').trim().notEmpty(),
    body('base_cost').isFloat({ min: 0 }),
    body('base_days').isInt({ min: 0 }),
  ],
  projectTypeController.create
);

router.put(
  '/project-type/:id',
  [
    body('name').optional().trim().notEmpty(),
    body('base_cost').optional().isFloat({ min: 0 }),
    body('base_days').optional().isInt({ min: 0 }),
  ],
  projectTypeController.update
);

router.delete('/project-type/:id', projectTypeController.remove);

router.get('/technology-stacks', adminController.getTechnologyStacks);
router.put('/technology-stack', adminController.updateTechnologyStack);
router.get('/stack-feature-rules', adminController.getStackFeatureRules);
router.post('/stack-feature-rule', adminController.upsertStackFeatureRule);
router.delete('/stack-feature-rule/:id', adminController.deleteStackFeatureRule);

module.exports = router;
