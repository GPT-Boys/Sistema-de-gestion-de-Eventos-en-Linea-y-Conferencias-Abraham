const { DataTypes } = require("sequelize");
const sequelize = require("../../database/db");
const UsuarioENT = require("./UsuarioENT");

const OradorENT = sequelize.define(
  "Orador",
  {
    idOrador: {
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
    experiencia: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    contacto: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "ORADOR",
    timestamps: false,
  }
);

OradorENT.belongsTo(UsuarioENT, {
  foreignKey: "ID_USUARIO",
  as: "USUARIO",
  targetKey: "ID_USUARIO",
});

module.exports = OradorENT;
