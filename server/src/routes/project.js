const express = require('express');
const router = express.Router();
const { Project, Client } = require('../models');

// GET all projects
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all projects...');
    const projects = await Project.findAll({ 
      include: [{
        model: Client,
        as: 'client',
        attributes: ['id', 'name', 'email', 'phone', 'address']
      }],
      order: [['createdAt', 'DESC']]
    });
    console.log(`Successfully fetched ${projects.length} projects`);
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ 
      error: 'Failed to fetch projects', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// GET one project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, { 
      include: [{
        model: Client,
        as: 'client',
        attributes: ['id', 'name', 'email', 'phone', 'address']
      }]
    });
    
    if (!project) {
      return res.status(404).json({ 
        error: 'Project not found',
        id: req.params.id
      });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ 
      error: 'Failed to fetch project',
      details: error.message
    });
  }
});

// POST create project
router.post('/', async (req, res) => {
  try {
    console.log('Received project creation request:', req.body);
    
    // Validate required fields
    const requiredFields = ['projectNumber', 'projectName', 'projectManager', 'clientId'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Check if project number already exists
    const existingProject = await Project.findOne({
      where: { projectNumber: req.body.projectNumber }
    });

    if (existingProject) {
      return res.status(400).json({
        error: 'Project number already exists',
        projectNumber: req.body.projectNumber
      });
    }

    const project = await Project.create(req.body);
    console.log('Project created successfully:', project.id);
    
    // Fetch the created project with client information
    const createdProject = await Project.findByPk(project.id, {
      include: [{
        model: Client,
        as: 'client',
        attributes: ['id', 'name', 'email', 'phone', 'address']
      }]
    });

    res.status(201).json(createdProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ 
      error: 'Failed to create project',
      details: error.message,
      validationErrors: error.errors ? error.errors.map(err => ({
        field: err.path,
        message: err.message
      })) : undefined
    });
  }
});

// PUT update project
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    
    if (!project) {
      return res.status(404).json({ 
        error: 'Project not found',
        id: req.params.id
      });
    }

    // If project number is being updated, check for duplicates
    if (req.body.projectNumber && req.body.projectNumber !== project.projectNumber) {
      const existingProject = await Project.findOne({
        where: { projectNumber: req.body.projectNumber }
      });

      if (existingProject) {
        return res.status(400).json({
          error: 'Project number already exists',
          projectNumber: req.body.projectNumber
        });
      }
    }

    await project.update(req.body);
    
    // Fetch the updated project with client information
    const updatedProject = await Project.findByPk(project.id, {
      include: [{
        model: Client,
        as: 'client',
        attributes: ['id', 'name', 'email', 'phone', 'address']
      }]
    });

    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(400).json({ 
      error: 'Failed to update project',
      details: error.message
    });
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    
    if (!project) {
      return res.status(404).json({ 
        error: 'Project not found',
        id: req.params.id
      });
    }

    await project.destroy();
    res.json({ 
      success: true,
      message: 'Project deleted successfully',
      id: req.params.id
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ 
      error: 'Failed to delete project',
      details: error.message
    });
  }
});

module.exports = router; 