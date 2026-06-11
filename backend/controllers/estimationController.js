const { validationResult } = require('express-validator');
const projectTypeModel = require('../models/projectTypeModel');
const featureModel = require('../models/featureModel');
const estimationModel = require('../models/estimationModel');
const technologyStackModel = require('../models/technologyStackModel');
const { calculateEstimation } = require('../services/estimationEngine');

const createEstimate = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { project_type_id, feature_ids = [], client_name, email, save = false } = req.body;

    const projectType = await projectTypeModel.findById(project_type_id);
    if (!projectType || !projectType.is_active) {
      return res.status(404).json({ success: false, message: 'Project type not found.' });
    }

    const selectedFeatures = await featureModel.findByIds(feature_ids);
    if (feature_ids.length > 0 && selectedFeatures.length !== feature_ids.length) {
      return res.status(400).json({ success: false, message: 'One or more features are invalid.' });
    }

    const baseStack = await technologyStackModel.findByProjectTypeId(project_type_id);
    const featureRules = await technologyStackModel.getFeatureRulesForFeatures(feature_ids);

    const estimation = calculateEstimation({
      projectType,
      selectedFeatures,
      baseStack,
      featureRules,
    });

    let savedEstimation = null;
    if (save && client_name && email) {
      savedEstimation = await estimationModel.create({
        client_name,
        email,
        project_type_id,
        total_cost: estimation.total_cost,
        total_days: estimation.total_days,
        complexity: estimation.complexity,
        technology_stack: estimation.technology_stack,
        cost_breakdown: estimation.cost_breakdown,
        timeline_breakdown: estimation.timeline_breakdown,
        feature_ids,
      });
    }

    res.json({
      success: true,
      data: {
        ...estimation,
        selected_features: selectedFeatures,
        saved: !!savedEstimation,
        estimation_id: savedEstimation?.id || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const { search, project_type_id, complexity, page, limit } = req.query;
    const result = await estimationModel.findAll({
      search,
      project_type_id: project_type_id ? parseInt(project_type_id, 10) : undefined,
      complexity,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const estimation = await estimationModel.findById(req.params.id);
    if (!estimation) {
      return res.status(404).json({ success: false, message: 'Estimation not found.' });
    }
    res.json({ success: true, data: estimation });
  } catch (error) {
    next(error);
  }
};

module.exports = { createEstimate, getAll, getById };
