const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Clients',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  projectNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  projectName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  projectManager: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'on_hold'),
    defaultValue: 'active'
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['projectNumber']
    }
  ]
});

// Define associations
Project.associate = (models) => {
  Project.belongsTo(models.Client, {
    foreignKey: 'clientId',
    as: 'client'
  });
  Project.hasMany(models.Task, { foreignKey: 'projectId' });
  Project.hasMany(models.Fase, { foreignKey: 'projectId' });
  Project.hasMany(models.Stage, { foreignKey: 'projectId' });
};

module.exports = Project; 