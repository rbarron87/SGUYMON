const express = require('express');
const router = express.Router();
const { Task, Project, Typology, Fase, Stage, Planning, Designer } = require('../models');
const { Op } = require('sequelize');

// GET /api/tasks
router.get('/', async (req, res) => {
  const items = await Task.findAll({ include: [Project, Typology, Fase, Stage] });
  res.json(items);
});

// GET /api/tasks/weekly
router.get('/weekly', async (req, res) => {
  try {
    const { week, projects, users } = req.query;
    
    // Parse the week to get start and end dates
    const startDate = new Date(week);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    // Build the where clause
    const whereClause = {};
    if (projects) {
      whereClause.projectId = {
        [Op.in]: projects.split(',')
      };
    }

    // Get tasks with their planning for the week
    const tasks = await Task.findAll({
      where: whereClause,
      include: [
        {
          model: Project,
          attributes: ['id', 'projectName']
        },
        {
          model: Planning,
          where: {
            week: {
              [Op.between]: [startDate, endDate]
            }
          },
          include: [{
            model: Designer,
            attributes: ['id', 'name'],
            where: users ? {
              id: {
                [Op.in]: users.split(',')
              }
            } : {}
          }],
          required: false
        }
      ]
    });

    // Transform the data to match the expected format
    const weeklyTasks = tasks.map(task => ({
      id: task.id,
      name: task.name,
      project: task.Project,
      user: task.Plannings[0]?.Designer,
      plannedHours: task.Plannings[0]?.plannedProgress || 0,
      productiveValue: task.productiveValue,
      expectedProgress: task.Plannings[0]?.plannedProgress || 0
    }));

    res.json(weeklyTasks);
  } catch (error) {
    console.error('Error fetching weekly tasks:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  const item = await Task.findByPk(req.params.id, { include: [Project, Typology, Fase, Stage] });
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const item = await Task.create(req.body);
    res.status(201).json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  const item = await Task.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  try {
    await item.update(req.body);
    res.json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  const item = await Task.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  await item.destroy();
  res.json({ success: true });
});

// POST /api/tasks/import
router.post('/import', async (req, res) => {
  try {
    const { tasks } = req.body;
    const results = {
      success: [],
      errors: []
    };

    for (const taskData of tasks) {
      try {
        // Buscar o crear proyecto
        const [project] = await Project.findOrCreate({
          where: { projectName: taskData.Proyecto },
          defaults: { projectName: taskData.Proyecto }
        });

        // Buscar o crear tipología
        const [typology] = await Typology.findOrCreate({
          where: { name: taskData.Tipología },
          defaults: { name: taskData.Tipología }
        });

        // Buscar o crear fase
        const [fase] = await Fase.findOrCreate({
          where: { 
            name: taskData.Fase,
            projectId: project.id
          },
          defaults: { 
            name: taskData.Fase,
            projectId: project.id
          }
        });

        // Buscar o crear etapa
        const [stage] = await Stage.findOrCreate({
          where: { 
            name: taskData.Etapa,
            projectId: project.id
          },
          defaults: { 
            name: taskData.Etapa,
            projectId: project.id
          }
        });

        // Verificar si ya existe una tarea con el mismo TAG en el proyecto
        const existingTask = await Task.findOne({
          where: {
            tag: taskData.TAG,
            projectId: project.id
          }
        });

        if (existingTask) {
          results.errors.push({
            task: taskData,
            error: `Ya existe una tarea con el TAG ${taskData.TAG} en el proyecto ${taskData.Proyecto}`
          });
          continue;
        }

        // Crear la tarea
        const task = await Task.create({
          name: taskData.Nombre,
          tag: taskData.TAG,
          projectId: project.id,
          typologyId: typology.id,
          faseId: fase.id,
          stageId: stage.id,
          hoursRequired: Number(taskData['Horas Requeridas']),
          productiveValue: Number(taskData['Valor Productivo'])
        });

        results.success.push({
          task: taskData,
          id: task.id
        });
      } catch (error) {
        results.errors.push({
          task: taskData,
          error: error.message
        });
      }
    }

    res.json({
      message: `Importación completada. ${results.success.length} tareas importadas, ${results.errors.length} errores.`,
      results
    });
  } catch (error) {
    console.error('Error importing tasks:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 