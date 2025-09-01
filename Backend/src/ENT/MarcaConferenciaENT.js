const { DataTypes } = require("sequelize");
const sequelize = require("../../database/db");

const MarcaConferenciaENT = sequelize.define(
  "MarcaConferencia",
  {
    id_marca_conferencia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    marca_conferencia: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "MARCA_CONFERENCIA",
    timestamps: false,
  }
);

module.exports = MarcaConferenciaENT;
