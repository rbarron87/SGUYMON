const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models');
const macroPlanRoutes = require('./routes/macroPlan');
const clientRoutes = require('./routes/client');
const projectRoutes = require('./routes/project');
const typologyRoutes = require('./routes/typology');
const faseRoutes = require('./routes/fase');
const stageRoutes = require('./routes/stage');
const designerRoutes = require('./routes/designer');
const taskRoutes = require('./routes/task');
const planningRoutes = require('./routes/planning');
const realProgressRoutes = require('./routes/realProgress');
const excelRoutes = require('./routes/excel');

// Configuración de manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: sequelize.authenticate() ? 'connected' : 'disconnected'
  });
});

// Routes
app.use('/api/macro-plan', macroPlanRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/typologies', typologyRoutes);
app.use('/api/fases', faseRoutes);
app.use('/api/stages', stageRoutes);
app.use('/api/designers', designerRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/planning', planningRoutes);
app.use('/api/real-progress', realProgressRoutes);
app.use('/api/excel', excelRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err);
  res.status(err.status || 500).json({
    error: err.message || 'Something broke!',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    path: req.url,
    method: req.method
  });
});

const PORT = process.env.PORT || 4000;

// Función para iniciar el servidor
async function startServer() {
  try {
    // Sincronizar la base de datos
    console.log('Synchronizing database...');
    await sequelize.sync({ 
      alter: true,
      logging: console.log
    });
    console.log('Database synchronized successfully');

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check available at http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Iniciar el servidor
startServer(); 