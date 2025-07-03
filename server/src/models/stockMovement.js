const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const StockMovement = sequelize.define('StockMovement', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  giaCodeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'GIACodes',
      key: 'id',
    },
    onDelete: 'RESTRICT',
  },
  movementType: {
    type: DataTypes.ENUM('in', 'out', 'adjustment', 'transfer', 'return'),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  referenceType: {
    type: DataTypes.ENUM('purchase_order', 'production', 'adjustment', 'transfer', 'return', 'manual'),
    allowNull: false,
  },
  referenceId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  referenceNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  previousStock: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
  },
  newStock: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
  },
  unitCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  totalCost: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  batchNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['giaCodeId']
    },
    {
      fields: ['movementType']
    },
    {
      fields: ['referenceType', 'referenceId']
    },
    {
      fields: ['createdAt']
    },
    {
      fields: ['location']
    }
  ]
});

// Define associations
StockMovement.associate = (models) => {
  StockMovement.belongsTo(models.GIACode, {
    foreignKey: 'giaCodeId',
    as: 'giaCode'
  });
};

module.exports = StockMovement; 