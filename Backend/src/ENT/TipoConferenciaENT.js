const { DataTypes } = require("sequelize");
const sequelize = require("../../database/db");

const TipoConferenciaENT = sequelize.define(
  "TipoConferencia",
  {
    id_tipo_conferencia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    tipo_conferencia: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "TIPO_CONFERENCIA",
    timestamps: false,
  }
);

module.exports = TipoConferenciaENT;
