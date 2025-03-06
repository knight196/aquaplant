const mysql = require('mysql')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config({path:path.resolve(__dirname,'./.env')})

const db = mysql.createPool({
    host:process.env.host,
    user:process.env.user,
    password:process.env.password,
    database:process.env.database,
    multipleStatement:true,
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0

})

module.exports = db