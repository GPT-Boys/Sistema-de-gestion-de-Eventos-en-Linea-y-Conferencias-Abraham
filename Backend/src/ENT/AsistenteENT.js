const { DataTypes } = require("sequelize");
const sequelize = require("../../database/db");
const UsuarioENT = require("./UsuarioENT");

const AsistenteENT = sequelize.define(
  "Asistente",
  {
    idAsistente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    idUsuario: {
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
  foreignKey: "ID_USUARIO",
  as: "USUARIO",
  targetKey: "ID_USUARIO",
});

module.exports = AsistenteENT;
