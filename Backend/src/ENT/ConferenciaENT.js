const { DataTypes } = require("sequelize");
const sequelize = require("../../database/db");
const MarcaConferenciaENT = require("./MarcaConferenciaENT");
const OradorENT = require("./OradorENT");
const TipoConferenciaENT = require("./TipoConferenciaENT");

const ConferenciaENT = sequelize.define(
  "Conferencia",
  {
    idConferencia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    idMarcaConferencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idOrador: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idTipoConferencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    votosAFavor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    votosEnContra: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    horaEmpieza: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    horaTermina: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    sala: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    evaluacion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    material: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
    },
  },
  {
    tableName: "CONFERENCIA",
    timestamps: false,
  }
);

ConferenciaENT.belongsTo(MarcaConferenciaENT, {
  foreignKey: "ID_MARCA_CONFERENCIA",
  as: "MARCA_CONFERENCIA",
  targetKey: "ID_MARCA_CONFERENCIA",
});

ConferenciaENT.belongsTo(OradorENT, {
  foreignKey: "ID_ORADOR",
  as: "ORADOR",
  targetKey: "ID_ORADOR",
});

ConferenciaENT.belongsTo(TipoConferenciaENT, {
  foreignKey: "ID_TIPO_CONFERENCIA",
  as: "TIPO_CONFERENCIA",
  targetKey: "ID_TIPO_CONFERENCIA",
});

module.exports = ConferenciaENT;
