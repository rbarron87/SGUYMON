const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Fase = sequelize.define('Fase', {
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
  targetDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

// Define associations
Fase.associate = (models) => {
  Fase.belongsTo(models.Project, { foreignKey: 'projectId' });
  Fase.hasMany(models.Task, { foreignKey: 'faseId' });
};

module.exports = Fase; 