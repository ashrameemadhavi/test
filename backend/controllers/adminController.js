const projectTypeModel = require('../models/projectTypeModel');
const featureModel = require('../models/featureModel');
const estimationModel = require('../models/estimationModel');
const technologyStackModel = require('../models/technologyStackModel');

const getDashboard = async (req, res, next) => {
  try {
    const [totalEstimations, totalFeatures, totalProjectTypes] = await Promise.all([
      estimationModel.count(),
      featureModel.count(),
      projectTypeModel.count(),
    ]);

    res.json({
      success: true,
      data: {
        total_estimations: totalEstimations,
        total_features: totalFeatures,
        total_project_types: totalProjectTypes,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTechnologyStacks = async (req, res, next) => {
  try {
    const stacks = await technologyStackModel.findAll();
    res.json({ success: true, data: stacks });
  } catch (error) {
    next(error);
  }
};

const updateTechnologyStack = async (req, res, next) => {
  try {
    const stack = await technologyStackModel.upsert(req.body);
    res.json({ success: true, data: stack });
  } catch (error) {
    next(error);
  }
};

const getStackFeatureRules = async (req, res, next) => {
  try {
    const rules = await technologyStackModel.getFeatureRules();
    res.json({ success: true, data: rules });
  } catch (error) {
    next(error);
  }
};

const upsertStackFeatureRule = async (req, res, next) => {
  try {
    const rule = await technologyStackModel.upsertFeatureRule(req.body);
    res.json({ success: true, data: rule });
  } catch (error) {
    next(error);
  }
};

const deleteStackFeatureRule = async (req, res, next) => {
  try {
    const deleted = await technologyStackModel.deleteFeatureRule(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Rule not found.' });
    }
    res.json({ success: true, message: 'Rule deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getTechnologyStacks,
  updateTechnologyStack,
  getStackFeatureRules,
  upsertStackFeatureRule,
  deleteStackFeatureRule,
};
