const sequelize = require('../../config/database');

// Import models
const Project = require('./project');
const Task = require('./task');
const Designer = require('./designer');
const Planning = require('./planning');
const RealProgress = require('./realProgress');
const Typology = require('./typology');
const Fase = require('./fase');
const Stage = require('./stage');
const Client = require('./client');

// Initialize models object
const models = {
  Project,
  Task,
  Designer,
  Planning,
  RealProgress,
  Typology,
  Fase,
  Stage,
  Client
};

// Set up associations
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });

module.exports = {
  sequelize,
  ...models
}; 