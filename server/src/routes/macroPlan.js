const express = require('express');
const router = express.Router();
const { Task, Project, Typology, Fase, Stage, Designer, Planning } = require('../models');
const { Op } = require('sequelize');

// GET /api/macro-plan
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50, weeks = 4 } = req.query;
    const offset = (page - 1) * limit;

    // Get current date and calculate week range
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - now.getDay()); // Start of current week
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + (weeks * 7)); // End of specified weeks

    // Optimize task query with specific attributes and includes
    const tasks = await Task.findAll({
      attributes: ['id', 'name', 'projectId', 'typologyId', 'faseId', 'stageId', 'productiveValue', 'plannedHours'],
      include: [
        {
          model: Project,
          attributes: ['id', 'projectName']
        },
        {
          model: Typology,
          attributes: ['id', 'name']
        },
        {
          model: Fase,
          attributes: ['id', 'name']
        },
        {
          model: Stage,
          attributes: ['id', 'name']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Get only active designers
    const designers = await Designer.findAll({
      where: { available: true },
      attributes: ['id', 'name', 'dailyHours']
    });

    // Calculate available hours for each designer (5 days per week)
    const designersWithHours = designers.map(designer => ({
      ...designer.toJSON(),
      availableHours: Array(parseInt(weeks)).fill(designer.dailyHours * 5)
    }));

    // Get planning data only for the specified weeks
    const planning = await Planning.findAll({
      where: {
        week: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: ['taskId', 'designerId', 'week', 'plannedProgress']
    });

    // Get total count for pagination
    const totalTasks = await Task.count();

    res.json({
      tasks,
      designers: designersWithHours,
      planning,
      pagination: {
        total: totalTasks,
        pages: Math.ceil(totalTasks / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching macro plan data:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/macro-plan/:taskId/:designerId/:week
router.put('/:taskId/:designerId/:week', async (req, res) => {
  const { taskId, designerId, week } = req.params;
  const { plannedProgress } = req.body;
  try {
    let planning = await Planning.findOne({
      where: { taskId, designerId, week },
    });
    if (planning) {
      planning.plannedProgress = plannedProgress;
      await planning.save();
    } else {
      planning = await Planning.create({ taskId, designerId, week, plannedProgress });
    }
    res.json(planning);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 