const { validationResult } = require('express-validator');
const featureModel = require('../models/featureModel');

const getAll = async (req, res, next) => {
  try {
    const activeOnly = req.query.all !== 'true';
    const features = await featureModel.findAll(activeOnly);
    res.json({ success: true, data: features });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const feature = await featureModel.findById(req.params.id);
    if (!feature) {
      return res.status(404).json({ success: false, message: 'Feature not found.' });
    }
    res.json({ success: true, data: feature });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const feature = await featureModel.create(req.body);
    res.status(201).json({ success: true, data: feature });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const existing = await featureModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Feature not found.' });
    }
    const feature = await featureModel.update(req.params.id, req.body);
    res.json({ success: true, data: feature });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const deleted = await featureModel.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Feature not found.' });
    }
    res.json({ success: true, message: 'Feature deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
