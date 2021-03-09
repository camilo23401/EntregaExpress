const { Sequelize } = require('sequelize')


const sequelize = new Sequelize('message_db','','',{
    dialect: 'sqlite', 
    storage: './database/messages.sqlite'
});

sequelize.authenticate().then(()=>console.log("DB está funcionando"))

module.exports = sequelize;