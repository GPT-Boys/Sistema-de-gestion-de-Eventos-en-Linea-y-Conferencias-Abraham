const { DataTypes } = require("sequelize");
const sequelize = require("../../database/db");
const AsistenteConferenciaENT = require("./AsistenteConferenciaENT");
const VotacionENT = require("./VotacionENT");

const AsistenteConferenciaVotacionENT = sequelize.define(
  "AsistenteConferenciaVotacion",
  {
    idAsistenteConferenciaVotacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    idAsistenteConferencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idVotacion: {
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
  foreignKey: "ID_ASISTENTE_CONFERENCIA",
  as: "ASISTENTE_CONFERENCIA",
  targetKey: "ID_ASISTENTE_CONFERENCIA",
});

AsistenteConferenciaVotacionENT.belongsTo(VotacionENT, {
  foreignKey: "ID_VOTACION",
  as: "VOTACION",
  targetKey: "ID_VOTACION",
});

module.exports = AsistenteConferenciaVotacionENT;
