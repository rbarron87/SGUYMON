const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const PurchaseRequest = sequelize.define('PurchaseRequest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  requestNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Suppliers',
      key: 'id',
    },
    onDelete: 'SET NULL',
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
  equipmentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Equipments',
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending_approval', 'approved', 'sent_to_supplier', 'quoted', 'ordered', 'received', 'cancelled'),
    defaultValue: 'draft',
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
  },
  requestedBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  requestedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  requiredDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  approvedBy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  sentToSupplierAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  expectedDeliveryDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  actualDeliveryDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  totalEstimatedCost: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
  },
  totalActualCost: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  cancellationReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['requestNumber']
    },
    {
      fields: ['supplierId']
    },
    {
      fields: ['projectId']
    },
    {
      fields: ['equipmentId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['requestedDate']
    }
  ]
});

// Define associations
PurchaseRequest.associate = (models) => {
  PurchaseRequest.belongsTo(models.Supplier, {
    foreignKey: 'supplierId',
    as: 'supplier'
  });
  PurchaseRequest.belongsTo(models.Project, {
    foreignKey: 'projectId',
    as: 'project'
  });
  PurchaseRequest.belongsTo(models.Equipment, {
    foreignKey: 'equipmentId',
    as: 'equipment'
  });
  PurchaseRequest.hasMany(models.PurchaseRequestItem, { foreignKey: 'purchaseRequestId' });
  PurchaseRequest.hasMany(models.PurchaseOrder, { foreignKey: 'purchaseRequestId' });
};

module.exports = PurchaseRequest; 