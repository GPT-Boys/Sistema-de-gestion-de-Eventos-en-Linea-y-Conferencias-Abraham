const { DataTypes } = require("sequelize");
const sequelize = require("../../database/db");
const ConferenciaENT = require("./ConferenciaENT");
const AsistenteENT = require("./AsistenteENT");

const AsistenteConferenciaENT = sequelize.define(
  "AsistenteConferencia",
  {
    idAsistenteConferencia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    idConferencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idAsistente: {
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
  foreignKey: "ID_CONFERENCIA",
  as: "CONFERENCIA",
  targetKey: "ID_CONFERENCIA",
});

AsistenteConferenciaENT.belongsTo(AsistenteENT, {
  foreignKey: "ID_ASISTENTE",
  as: "ASISTENTE",
  targetKey: "ID_ASISTENTE",
});

module.exports = AsistenteConferenciaENT;
