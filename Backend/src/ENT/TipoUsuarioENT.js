const { DataTypes } = require("sequelize");
const sequelize = require("../../database/db");

const TipoUsuarioENT = sequelize.define(
  "TipoUsuario",
  {
    id_tipo_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    tipo_usuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "TIPO_USUARIO",
    timestamps: false,
  }
);

module.exports = TipoUsuarioENT;
