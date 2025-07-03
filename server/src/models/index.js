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

// Import new purchase tracking models
const Supplier = require('./supplier');
const GIACode = require('./giaCode');
const Equipment = require('./equipment');
const BOM = require('./bom');
const BOMItem = require('./bomItem');
const BOMVersion = require('./bomVersion');
const PurchaseRequest = require('./purchaseRequest');
const PurchaseRequestItem = require('./purchaseRequestItem');
const PurchaseOrder = require('./purchaseOrder');
const PurchaseOrderItem = require('./purchaseOrderItem');
const SupplierGIA = require('./supplierGIA');
const StockMovement = require('./stockMovement');

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
  Client,
  // New purchase tracking models
  Supplier,
  GIACode,
  Equipment,
  BOM,
  BOMItem,
  BOMVersion,
  PurchaseRequest,
  PurchaseRequestItem,
  PurchaseOrder,
  PurchaseOrderItem,
  SupplierGIA,
  StockMovement
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