const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Task = require('./task');
const Designer = require('./designer');

const RealProgress = sequelize.define('RealProgress', {
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
  realProgress: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
}, {
  timestamps: true,
  createdAt: true,
  updatedAt: false,
});

RealProgress.belongsTo(Task, { foreignKey: 'taskId' });
RealProgress.belongsTo(Designer, { foreignKey: 'designerId' });
Task.hasMany(RealProgress, { foreignKey: 'taskId' });
Designer.hasMany(RealProgress, { foreignKey: 'designerId' });

module.exports = RealProgress; 