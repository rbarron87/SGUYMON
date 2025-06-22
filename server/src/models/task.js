const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Projects',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  typologyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Typologies',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  faseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Fases',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  stageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Stages',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  productiveValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  targetDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'default_tag'
  },
  plannedHours: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  expectedProgress: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
    defaultValue: 'pending'
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['tag', 'projectId'],
      name: 'task_tag_project_unique'
    }
  ]
});

// Define associations
Task.associate = (models) => {
  Task.belongsTo(models.Project, { foreignKey: 'projectId' });
  Task.belongsTo(models.Typology, { foreignKey: 'typologyId' });
  Task.belongsTo(models.Fase, { foreignKey: 'faseId' });
  Task.belongsTo(models.Stage, { foreignKey: 'stageId' });
  Task.hasMany(models.Planning, { foreignKey: 'taskId' });
};

module.exports = Task; 