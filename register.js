const database = require('./database');
const {DataTypes} = require('sequelize');

let register = database.define("register",{

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
    lastName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    nationalCode:{
        type:DataTypes.STRING,
        allowNull:false
    },
    phoneNumber:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    birthday:{
        type:DataTypes.DATE,
        allowNull:false
    }
})

database.sync().then(() => {
    console.log('register table created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });   


module.exports= register