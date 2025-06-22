const express = require('express');
const router = express.Router();
const { RealProgress, Task, Designer } = require('../models');

router.get('/', async (req, res) => {
  const items = await RealProgress.findAll({ include: [Task, Designer] });
  res.json(items);
});

router.get('/:id', async (req, res) => {
  const item = await RealProgress.findByPk(req.params.id, { include: [Task, Designer] });
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

router.post('/', async (req, res) => {
  try {
    const item = await RealProgress.create(req.body);
    res.status(201).json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/:id', async (req, res) => {
  const item = await RealProgress.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  try {
    await item.update(req.body);
    res.json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  const item = await RealProgress.findByPk(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  await item.destroy();
  res.json({ success: true });
});

module.exports = router; 