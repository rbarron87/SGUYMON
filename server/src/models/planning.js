const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Task = require('./task');
const Designer = require('./designer');

const Planning = sequelize.define('Planning', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  taskId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Task,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  designerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Designer,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  week: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  plannedProgress: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
}, {
  timestamps: true,
  createdAt: true,
  updatedAt: false,
});

Planning.belongsTo(Task, { foreignKey: 'taskId' });
Planning.belongsTo(Designer, { foreignKey: 'designerId' });
Task.hasMany(Planning, { foreignKey: 'taskId' });
Designer.hasMany(Planning, { foreignKey: 'designerId' });

module.exports = Planning; 