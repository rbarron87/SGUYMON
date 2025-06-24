const express = require('express');
const router = express.Router();
const { Stage, Project } = require('../models');

router.get('/', async (req, res) => {
  try {
    const items = await Stage.findAll({
      include: [
        {
          model: Project,
          as: 'Project',
          attributes: ['id', 'projectName', 'projectNumber']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(items);
  } catch (error) {
    console.error('Error fetching stages:', error);
    res.status(500).json({ error: 'Error al cargar las etapas' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Stage.findByPk(req.params.id, {
      include: [
        {
          model: Project,
          as: 'Project',
          attributes: ['id', 'projectName', 'projectNumber']
        }
      ]
    });
    if (!item) return res.status(404).json({ error: 'Etapa no encontrada' });
    res.json(item);
  } catch (error) {
    console.error('Error fetching stage:', error);
    res.status(500).json({ error: 'Error al cargar la etapa' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, projectId, targetDate, description, assignedDesigners } = req.body;
    
    // Validar campos requeridos
    if (!name || !projectId || !targetDate) {
      return res.status(400).json({ 
        error: 'Los campos nombre, proyecto y fecha objetivo son requeridos' 
      });
    }

    // Verificar que el proyecto existe
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(400).json({ error: 'El proyecto especificado no existe' });
    }

    const item = await Stage.create({
      name,
      projectId,
      targetDate,
      description: description || null,
      assignedDesigners: assignedDesigners || []
    });

    // Retornar la etapa creada con la relación del proyecto
    const createdStage = await Stage.findByPk(item.id, {
      include: [
        {
          model: Project,
          as: 'Project',
          attributes: ['id', 'projectName', 'projectNumber']
        }
      ]
    });

    res.status(201).json(createdStage);
  } catch (error) {
    console.error('Error creating stage:', error);
    res.status(400).json({ error: error.message || 'Error al crear la etapa' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await Stage.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Etapa no encontrada' });

    const { name, projectId, targetDate, description, assignedDesigners } = req.body;
    
    // Validar campos requeridos
    if (!name || !projectId || !targetDate) {
      return res.status(400).json({ 
        error: 'Los campos nombre, proyecto y fecha objetivo son requeridos' 
      });
    }

    // Verificar que el proyecto existe
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(400).json({ error: 'El proyecto especificado no existe' });
    }

    await item.update({
      name,
      projectId,
      targetDate,
      description: description || null,
      assignedDesigners: assignedDesigners || []
    });

    // Retornar la etapa actualizada con la relación del proyecto
    const updatedStage = await Stage.findByPk(item.id, {
      include: [
        {
          model: Project,
          as: 'Project',
          attributes: ['id', 'projectName', 'projectNumber']
        }
      ]
    });

    res.json(updatedStage);
  } catch (error) {
    console.error('Error updating stage:', error);
    res.status(400).json({ error: error.message || 'Error al actualizar la etapa' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await Stage.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Etapa no encontrada' });
    
    await item.destroy();
    res.json({ success: true, message: 'Etapa eliminada correctamente' });
  } catch (error) {
    console.error('Error deleting stage:', error);
    res.status(500).json({ error: 'Error al eliminar la etapa' });
  }
});

module.exports = router; 