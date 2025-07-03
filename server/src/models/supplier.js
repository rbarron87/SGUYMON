const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Supplier = sequelize.define('Supplier', {
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
  contactPerson: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active',
  },
  paymentTerms: {
    type: DataTypes.STRING,
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
    }
  ]
});

// Define associations
Supplier.associate = (models) => {
  Supplier.hasMany(models.PurchaseRequest, { foreignKey: 'supplierId' });
  Supplier.hasMany(models.SupplierGIA, { foreignKey: 'supplierId' });
};

module.exports = Supplier; 