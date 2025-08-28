const { DataTypes } = require("sequelize");
const sequelize = require("../../database/db");
const TipoUsuarioENT = require("./TipoUsuarioENT");
const CiudadENT = require("./CiudadENT");

const UsuarioENT = sequelize.define(
  "Usuario",
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    usuario: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    contrasenia: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    id_tipo_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombres: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    apellidos: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    id_ciudad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    telefono: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1000000,
        max: 999999999,
      },
    },
    correo_electronico: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: true,
      },
    },
  },
  {
    tableName: "USUARIO",
    timestamps: false,
  }
);

UsuarioENT.belongsTo(TipoUsuarioENT, {
  foreignKey: "id_tipo_usuario",
  as: "tipo_usuario",
  targetKey: "id_tipo_usuario",
});

UsuarioENT.belongsTo(CiudadENT, {
  foreignKey: "id_ciudad",
  as: "ciudad",
  targetKey: "id_ciudad",
});

module.exports = UsuarioENT;
