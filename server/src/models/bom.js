const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const BOM = sequelize.define('BOM', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  version: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '1.0',
  },
  equipmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Equipments',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Projects',
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'obsolete', 'archived'),
    defaultValue: 'draft',
  },
  approvalStatus: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  approvedBy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  effectiveDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  totalEstimatedCost: {
    type: DataTypes.DECIMAL(12, 2),
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
      fields: ['equipmentId']
    },
    {
      fields: ['projectId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['approvalStatus']
    }
  ]
});

// Define associations
BOM.associate = (models) => {
  BOM.belongsTo(models.Equipment, {
    foreignKey: 'equipmentId',
    as: 'equipment'
  });
  BOM.belongsTo(models.Project, {
    foreignKey: 'projectId',
    as: 'project'
  });
  BOM.hasMany(models.BOMItem, { foreignKey: 'bomId' });
  BOM.hasMany(models.BOMVersion, { foreignKey: 'originalBomId' });
};

module.exports = BOM; 