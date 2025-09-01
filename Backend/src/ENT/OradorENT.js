const { DataTypes } = require("sequelize");
const sequelize = require("../../database/db");
const UsuarioENT = require("./UsuarioENT");

const OradorENT = sequelize.define(
  "Orador",
  {
    id_orador: {
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
  foreignKey: "id_usuario",
  as: "usuario",
  targetKey: "id_usuario",
});

module.exports = OradorENT;
