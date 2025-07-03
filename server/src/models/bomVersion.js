const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const BOMVersion = sequelize.define('BOMVersion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  originalBomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'BOMs',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  version: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  changeReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  changeDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  changedBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  effectiveDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['originalBomId', 'version']
    },
    {
      fields: ['originalBomId']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['approvalStatus']
    }
  ]
});

// Define associations
BOMVersion.associate = (models) => {
  BOMVersion.belongsTo(models.BOM, {
    foreignKey: 'originalBomId',
    as: 'originalBom'
  });
};

module.exports = BOMVersion; 