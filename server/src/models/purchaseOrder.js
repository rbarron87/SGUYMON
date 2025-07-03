const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const PurchaseOrder = sequelize.define('PurchaseOrder', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  purchaseRequestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'PurchaseRequests',
      key: 'id',
    },
    onDelete: 'RESTRICT',
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Suppliers',
      key: 'id',
    },
    onDelete: 'RESTRICT',
  },
  status: {
    type: DataTypes.ENUM('draft', 'sent', 'confirmed', 'in_production', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'draft',
  },
  orderDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  expectedDeliveryDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  actualDeliveryDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  confirmedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  shippedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'USD',
  },
  paymentTerms: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  billingAddress: {
    type: DataTypes.TEXT,
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
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  shippingMethod: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  approvedBy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['orderNumber']
    },
    {
      fields: ['purchaseRequestId']
    },
    {
      fields: ['supplierId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['orderDate']
    }
  ]
});

// Define associations
PurchaseOrder.associate = (models) => {
  PurchaseOrder.belongsTo(models.PurchaseRequest, {
    foreignKey: 'purchaseRequestId',
    as: 'purchaseRequest'
  });
  PurchaseOrder.belongsTo(models.Supplier, {
    foreignKey: 'supplierId',
    as: 'supplier'
  });
  PurchaseOrder.hasMany(models.PurchaseOrderItem, { foreignKey: 'purchaseOrderId' });
};

module.exports = PurchaseOrder; 