const { DataTypes } = require("sequelize");
const sequelize = require("../../database/db");
const UsuarioENT = require("./UsuarioENT");

const AsistenteENT = sequelize.define(
  "Asistente",
  {
    id_asistente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "ASISTENTE",
    timestamps: false,
  }
);

AsistenteENT.belongsTo(UsuarioENT, {
  foreignKey: "id_usuario",
  as: "usuario",
  targetKey: "id_usuario",
});

module.exports = AsistenteENT;
