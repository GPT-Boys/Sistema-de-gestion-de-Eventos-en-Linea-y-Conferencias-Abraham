const { DataTypes } = require("sequelize");
const sequelize = require("../../database/db");
const AsistenteConferenciaENT = require("./AsistenteConferenciaENT");
const VotacionENT = require("./VotacionENT");

const AsistenteConferenciaVotacionENT = sequelize.define(
  "AsistenteConferenciaVotacion",
  {
    id_asistente_conferencia_votacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_asistente_conferencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_votacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "ASISTENTE_CONFERENCIA_VOTACION",
    timestamps: false,
  }
);

AsistenteConferenciaVotacionENT.belongsTo(AsistenteConferenciaENT, {
  foreignKey: "id_asistente_conferencia",
  as: "asistente_conferencia",
  targetKey: "id_asistente_conferencia",
});

AsistenteConferenciaVotacionENT.belongsTo(VotacionENT, {
  foreignKey: "id_votacion",
  as: "votacion",
  targetKey: "id_votacion",
});

module.exports = AsistenteConferenciaVotacionENT;
