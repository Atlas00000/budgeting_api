const { validationResult } = require('express-validator');
const CategoryService = require('../services/categoryService');

const CategoryController = {
  async getAll(req, res, next) {
    try {
      const categories = await CategoryService.getAll();
      res.json(categories);
    } catch (err) {
      next(err);
    }
  },
  async getById(req, res, next) {
    try {
      const category = await CategoryService.getById(req.params.id);
      if (!category) return res.status(404).json({ message: 'Category not found' });
      res.json(category);
    } catch (err) {
      next(err);
    }
  },
  async create(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const category = await CategoryService.create(req.body);
      res.status(201).json(category);
    } catch (err) {
      next(err);
    }
  },
  async update(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      
      const category = await CategoryService.update(req.params.id, req.body);
      if (!category) {
        return res.status(404).json({ 
          status: 'error',
          message: 'Category not found' 
        });
      }
      
      res.json({
        status: 'success',
        data: category
      });
    } catch (err) {
      next(err);
    }
  },
  async delete(req, res, next) {
    try {
      const category = await CategoryService.delete(req.params.id);
      if (!category) return res.status(404).json({ message: 'Category not found' });
      res.json({ 
        status: 'success',
        message: 'Category deleted',
        data: category 
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = CategoryController; 