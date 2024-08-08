var  mysql2 = require('mysql2');
var setting = {
    database : 'Paylect',
    user : 'root',
    password : '',
    port :  3306,
    host : 'localhost'
}

var DB = mysql2.createConnection(setting)
DB.connect(function(err){
    if(err){
        console.log('err in establishing connection');
        console.log(err);
    }
    else
        console.log('Connected to Database');
})
module.exports.DB = DB;