const { DataTypes } = require("sequelize");
const sequelize = require("../../database/db");
const ConferenciaNotificacionENT = require("./ConferenciaNotificacionENT");
const AsistenteENT = require("./AsistenteENT");

const NotificacionAsistenteENT = sequelize.define(
  "NotificacionAsistente",
  {
    id_notificacion_asistente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_conferencia_notificacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_asistente: {
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
  foreignKey: "id_conferencia_notificacion",
  as: "conferencia_notificacion",
  targetKey: "id_conferencia_notificacion",
});

NotificacionAsistenteENT.belongsTo(AsistenteENT, {
  foreignKey: "id_asistente",
  as: "asistente",
  targetKey: "id_asistente",
});

module.exports = NotificacionAsistenteENT;
