const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const PurchaseRequestItem = sequelize.define('PurchaseRequestItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  purchaseRequestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'PurchaseRequests',
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
  bomItemId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'BOMItems',
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estimatedUnitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  estimatedTotalPrice: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
  },
  actualUnitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  actualTotalPrice: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'quoted', 'ordered', 'received', 'cancelled'),
    defaultValue: 'pending',
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium',
  },
  requiredDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  receivedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  receivedQuantity: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  supplierNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['purchaseRequestId']
    },
    {
      fields: ['giaCodeId']
    },
    {
      fields: ['bomItemId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['priority']
    }
  ]
});

// Define associations
PurchaseRequestItem.associate = (models) => {
  PurchaseRequestItem.belongsTo(models.PurchaseRequest, {
    foreignKey: 'purchaseRequestId',
    as: 'purchaseRequest'
  });
  PurchaseRequestItem.belongsTo(models.GIACode, {
    foreignKey: 'giaCodeId',
    as: 'giaCode'
  });
  PurchaseRequestItem.belongsTo(models.BOMItem, {
    foreignKey: 'bomItemId',
    as: 'bomItem'
  });
  PurchaseRequestItem.hasMany(models.PurchaseOrderItem, { foreignKey: 'purchaseRequestItemId' });
};

module.exports = PurchaseRequestItem; 