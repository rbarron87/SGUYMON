const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const GIACode = sequelize.define('GIACode', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  standardCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  minStock: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  maxStock: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  currentStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  leadTime: {
    type: DataTypes.INTEGER, // días
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'discontinued'),
    defaultValue: 'active',
  },
  specifications: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['code']
    },
    {
      fields: ['category']
    },
    {
      fields: ['status']
    }
  ]
});

// Define associations
GIACode.associate = (models) => {
  GIACode.hasMany(models.BOMItem, { foreignKey: 'giaCodeId' });
  GIACode.hasMany(models.PurchaseRequestItem, { foreignKey: 'giaCodeId' });
  GIACode.hasMany(models.SupplierGIA, { foreignKey: 'giaCodeId' });
  GIACode.hasMany(models.StockMovement, { foreignKey: 'giaCodeId' });
};

module.exports = GIACode; 