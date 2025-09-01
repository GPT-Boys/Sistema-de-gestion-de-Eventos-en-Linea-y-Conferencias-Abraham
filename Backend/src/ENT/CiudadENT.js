const { DataTypes } = require("sequelize");
const sequelize = require("../../database/db");

const CiudadENT = sequelize.define(
  "Ciudad",
  {
    id_ciudad: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ciudad: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "CIUDAD",
    timestamps: false,
  }
);

module.exports = CiudadENT;
