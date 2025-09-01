const { DataTypes } = require("sequelize");
const sequelize = require("../../database/db");
const ConferenciaENT = require("./ConferenciaENT");

const ConferenciaNotificacionENT = sequelize.define(
  "ConferenciaNotificacion",
  {
    id_conferencia_notificacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_conferencia: {
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
  foreignKey: "id_conferencia",
  as: "conferencia",
  targetKey: "id_conferencia",
});

module.exports = ConferenciaNotificacionENT;
