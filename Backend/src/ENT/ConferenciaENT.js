const { DataTypes } = require("sequelize");
const sequelize = require("../../database/db");
const MarcaConferenciaENT = require("./MarcaConferenciaENT");
const OradorENT = require("./OradorENT");
const TipoConferenciaENT = require("./TipoConferenciaENT");

const ConferenciaENT = sequelize.define(
  "Conferencia",
  {
    id_conferencia: {
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
    id_marca_conferencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_orador: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_tipo_conferencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    votos_a_favor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    votos_en_contra: {
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
    hora_empieza: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    hora_termina: {
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
  foreignKey: "id_marca_conferencia",
  as: "marca_conferencia",
  targetKey: "id_marca_conferencia",
});

ConferenciaENT.belongsTo(OradorENT, {
  foreignKey: "id_orador",
  as: "orador",
  targetKey: "id_orador",
});

ConferenciaENT.belongsTo(TipoConferenciaENT, {
  foreignKey: "id_tipo_conferencia",
  as: "tipo_conferencia",
  targetKey: "id_tipo_conferencia",
});

module.exports = ConferenciaENT;
