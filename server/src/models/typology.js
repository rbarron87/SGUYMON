const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Typology = sequelize.define('Typology', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  DM: { type: DataTypes.FLOAT, allowNull: false },
  DE: { type: DataTypes.FLOAT, allowNull: false },
  IA: { type: DataTypes.FLOAT, allowNull: false },
  EP: { type: DataTypes.FLOAT, allowNull: false },
  PA: { type: DataTypes.FLOAT, allowNull: false },
  BL: { type: DataTypes.FLOAT, allowNull: false },
  AFM: { type: DataTypes.FLOAT, allowNull: false },
  AFE: { type: DataTypes.FLOAT, allowNull: false },
  EN: { type: DataTypes.FLOAT, allowNull: false },
}, {
  timestamps: false,
  validate: {
    sumIs100() {
      const sum = this.DM + this.DE + this.IA + this.EP + this.PA + this.BL + this.AFM + this.AFE + this.EN;
      if (sum !== 100) {
        throw new Error('La suma de las ponderaciones debe ser 100');
      }
    }
  }
});

module.exports = Typology; 