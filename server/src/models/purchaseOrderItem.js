const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const PurchaseOrderItem = sequelize.define('PurchaseOrderItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  purchaseOrderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'PurchaseOrders',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  purchaseRequestItemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'PurchaseRequestItems',
      key: 'id',
    },
    onDelete: 'RESTRICT',
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
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('ordered', 'confirmed', 'in_production', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'ordered',
  },
  expectedDeliveryDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  actualDeliveryDate: {
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
  },
  qualityCheck: {
    type: DataTypes.ENUM('pending', 'passed', 'failed', 'partial'),
    defaultValue: 'pending',
  },
  qualityNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['purchaseOrderId']
    },
    {
      fields: ['purchaseRequestItemId']
    },
    {
      fields: ['giaCodeId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['qualityCheck']
    }
  ]
});

// Define associations
PurchaseOrderItem.associate = (models) => {
  PurchaseOrderItem.belongsTo(models.PurchaseOrder, {
    foreignKey: 'purchaseOrderId',
    as: 'purchaseOrder'
  });
  PurchaseOrderItem.belongsTo(models.PurchaseRequestItem, {
    foreignKey: 'purchaseRequestItemId',
    as: 'purchaseRequestItem'
  });
  PurchaseOrderItem.belongsTo(models.GIACode, {
    foreignKey: 'giaCodeId',
    as: 'giaCode'
  });
};

module.exports = PurchaseOrderItem; 