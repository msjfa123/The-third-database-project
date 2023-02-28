const database = require('./database');
const {DataTypes} = require('sequelize');
const register = require('./register');

let childeren = database.define("childeren",{
    
    id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    nationalCode:{
        type:DataTypes.STRING,
        allowNull:false
    },
    gender:{
        type:DataTypes.STRING,
        allowNull:false
    },
});

childeren.belongsTo(register)
register.hasMany(childeren)

database.sync().then(() => {
    console.log('phone table created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });   

module.exports = childeren

