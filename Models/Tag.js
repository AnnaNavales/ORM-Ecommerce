const { Model, DataTypes } = require('sequelize');
// const { Tag } = require('.');
const sequelize = require('../config/connection');

// create our User model
 class Tag extends Model { }

// create fields/columns for User model
Tag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    

    tag_name: {
      type: DataTypes.STRING
    }
      
    },
    

  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'tag'
  }
);

module.exports = Tag;