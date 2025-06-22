const express = require('express');
const router = express.Router();
const Client = require('../models/client');

// GET all clients
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all clients...');
    const clients = await Client.findAll();
    console.log('Clients fetched successfully:', clients.length);
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients', details: error.message });
  }
});

// GET one client
router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching client:', req.params.id);
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      console.log('Client not found:', req.params.id);
      return res.status(404).json({ error: 'Client not found' });
    }
    console.log('Client fetched successfully:', client.id);
    res.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Failed to fetch client', details: error.message });
  }
});

// POST create client
router.post('/', async (req, res) => {
  try {
    console.log('Creating new client:', req.body);
    const client = await Client.create(req.body);
    console.log('Client created successfully:', client.id);
    res.status(201).json(client);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(400).json({ 
      error: 'Failed to create client',
      details: error.errors ? error.errors.map(err => err.message) : error.message
    });
  }
});

// PUT update client
router.put('/:id', async (req, res) => {
  try {
    console.log('Updating client:', req.params.id);
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      console.log('Client not found:', req.params.id);
      return res.status(404).json({ error: 'Client not found' });
    }
    await client.update(req.body);
    console.log('Client updated successfully:', client.id);
    res.json(client);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(400).json({ 
      error: 'Failed to update client',
      details: error.errors ? error.errors.map(err => err.message) : error.message
    });
  }
});

// DELETE client
router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting client:', req.params.id);
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      console.log('Client not found:', req.params.id);
      return res.status(404).json({ error: 'Client not found' });
    }
    await client.destroy();
    console.log('Client deleted successfully:', req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client', details: error.message });
  }
});

module.exports = router; 