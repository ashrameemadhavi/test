const { validationResult } = require('express-validator');
const projectTypeModel = require('../models/projectTypeModel');

const getAll = async (req, res, next) => {
  try {
    const activeOnly = req.query.all !== 'true';
    const projectTypes = await projectTypeModel.findAll(activeOnly);
    res.json({ success: true, data: projectTypes });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const projectType = await projectTypeModel.findById(req.params.id);
    if (!projectType) {
      return res.status(404).json({ success: false, message: 'Project type not found.' });
    }
    res.json({ success: true, data: projectType });
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
    const projectType = await projectTypeModel.create(req.body);
    res.status(201).json({ success: true, data: projectType });
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
    const existing = await projectTypeModel.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Project type not found.' });
    }
    const projectType = await projectTypeModel.update(req.params.id, req.body);
    res.json({ success: true, data: projectType });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const deleted = await projectTypeModel.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Project type not found.' });
    }
    res.json({ success: true, message: 'Project type deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
