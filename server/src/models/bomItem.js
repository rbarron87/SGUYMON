const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const BOMItem = sequelize.define('BOMItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  bomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'BOMs',
      key: 'id',
    },
    onDelete: 'CASCADE',
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
  quantity: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    defaultValue: 1,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  isOptional: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  estimatedCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium',
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['bomId', 'giaCodeId']
    },
    {
      fields: ['bomId']
    },
    {
      fields: ['giaCodeId']
    }
  ]
});

// Define associations
BOMItem.associate = (models) => {
  BOMItem.belongsTo(models.BOM, {
    foreignKey: 'bomId',
    as: 'bom'
  });
  BOMItem.belongsTo(models.GIACode, {
    foreignKey: 'giaCodeId',
    as: 'giaCode'
  });
};

module.exports = BOMItem; 