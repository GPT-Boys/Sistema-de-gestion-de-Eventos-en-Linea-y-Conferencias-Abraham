const { DataTypes } = require("sequelize");
const sequelize = require("../../database/db");
const ConferenciaENT = require("./ConferenciaENT");
const AsistenteENT = require("./AsistenteENT");

const AsistenteConferenciaENT = sequelize.define(
  "AsistenteConferencia",
  {
    id_asistente_conferencia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_conferencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_asistente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "ASISTENTE_CONFERENCIA",
    timestamps: false,
  }
);

AsistenteConferenciaENT.belongsTo(ConferenciaENT, {
  foreignKey: "id_conferencia",
  as: "conferencia",
  targetKey: "id_conferencia",
});

AsistenteConferenciaENT.belongsTo(AsistenteENT, {
  foreignKey: "id_asistente",
  as: "asistente",
  targetKey: "id_asistente",
});

module.exports = AsistenteConferenciaENT;
