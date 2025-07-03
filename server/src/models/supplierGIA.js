const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const SupplierGIA = sequelize.define('SupplierGIA', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Suppliers',
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
    onDelete: 'CASCADE',
  },
  supplierPartNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  supplierDescription: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'USD',
  },
  leadTime: {
    type: DataTypes.INTEGER, // días
    allowNull: true,
  },
  minimumOrderQuantity: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: true,
  },
  isPreferred: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  lastPriceUpdate: {
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
      fields: ['supplierId', 'giaCodeId']
    },
    {
      fields: ['supplierId']
    },
    {
      fields: ['giaCodeId']
    },
    {
      fields: ['isPreferred']
    },
    {
      fields: ['isActive']
    }
  ]
});

// Define associations
SupplierGIA.associate = (models) => {
  SupplierGIA.belongsTo(models.Supplier, {
    foreignKey: 'supplierId',
    as: 'supplier'
  });
  SupplierGIA.belongsTo(models.GIACode, {
    foreignKey: 'giaCodeId',
    as: 'giaCode'
  });
};

module.exports = SupplierGIA; 