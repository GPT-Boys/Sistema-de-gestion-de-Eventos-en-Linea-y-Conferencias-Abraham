const { DataTypes } = require("sequelize");
const sequelize = require("../../database/db");
const ConferenciaENT = require("./ConferenciaENT");

const ConferenciaNotificacionENT = sequelize.define(
  "ConferenciaNotificacion",
  {
    idConferenciaNotificacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    idConferencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notificacion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "CONFERENCIA_NOTIFICACION",
    timestamps: false,
  }
);

ConferenciaNotificacionENT.belongsTo(ConferenciaENT, {
  foreignKey: "ID_CONFERENCIA",
  as: "CONFERENCIA",
  targetKey: "ID_CONFERENCIA",
});

module.exports = ConferenciaNotificacionENT;
