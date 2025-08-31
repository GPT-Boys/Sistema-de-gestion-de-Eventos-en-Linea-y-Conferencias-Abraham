const { DataTypes } = require("sequelize");
const sequelize = require("../../database/db");
const ConferenciaNotificacionENT = require("./ConferenciaNotificacionENT");
const AsistenteENT = require("./AsistenteENT");

const NotificacionAsistenteENT = sequelize.define(
  "NotificacionAsistente",
  {
    idNotificacionAsistente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    idConferenciaNotificacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idAsistente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "NOTIFICACION_ASISTENTE",
    timestamps: false,
  }
);

NotificacionAsistenteENT.belongsTo(ConferenciaNotificacionENT, {
  foreignKey: "ID_CONFERENCIA_NOTIFICACION",
  as: "CONFERENCIA_NOTIFICACION",
  targetKey: "ID_CONFERENCIA_NOTIFICACION",
});

NotificacionAsistenteENT.belongsTo(AsistenteENT, {
  foreignKey: "ID_ASISTENTE",
  as: "ASISTENTE",
  targetKey: "ID_ASISTENTE",
});

module.exports = NotificacionAsistenteENT;
