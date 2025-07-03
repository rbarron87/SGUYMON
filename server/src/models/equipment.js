const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Equipment = sequelize.define('Equipment', {
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
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  manufacturer: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  specifications: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'maintenance', 'retired'),
    defaultValue: 'active',
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
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
    },
    {
      fields: ['projectId']
    }
  ]
});

// Define associations
Equipment.associate = (models) => {
  Equipment.belongsTo(models.Project, {
    foreignKey: 'projectId',
    as: 'project'
  });
  Equipment.hasMany(models.BOM, { foreignKey: 'equipmentId' });
};

module.exports = Equipment; 