const { DataTypes } = require("sequelize");
const sequelize = require("../../database/db");

const VotacionENT = sequelize.define(
  "Votacion",
  {
    idVotacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    votacion: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "VOTACION",
    timestamps: false,
  }
);

module.exports = VotacionENT;
