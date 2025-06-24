const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Stage = sequelize.define('Stage', {
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
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    assignedDesigners: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
    },
}, {
    timestamps: true,
});

// Define associations
Stage.associate = (models) => {
    Stage.belongsTo(models.Project, { foreignKey: 'projectId', as: 'Project' });
    Stage.hasMany(models.Task, { foreignKey: 'stageId' });
};

module.exports = Stage; 