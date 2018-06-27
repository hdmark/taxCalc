// config/database.js
var mysql = require('mysql');

var connection = mysql.createConnection({
   	host:       'localhost',
    user:       'root',
    password: 	'pass',
    database: 	'tax_0'

});

connection.connect(function(err){
	if(err) throw err;
});

module.exports = connection;
