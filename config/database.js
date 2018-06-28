// config/database.js
var mysql = require('mysql');

var connection = mysql.createPool({
	connectionLimit: 10,
   	host:       'localhost',
    user:       'root',
    password: 	'pass',
    database: 	'tax_0'

});

connection.query('SELECT 1 + 1 AS solution', function(err, results){
	if(err){console.log('Pool Failed')};
	console.log('Pool Is Running');
})

module.exports = connection;

