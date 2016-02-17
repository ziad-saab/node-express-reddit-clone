var db = require('mysql-promise')();
var username = require('./config.json').username;

db.configure({
	"host": "localhost",
	"user": username,
	"password": "",
	"database": ""
});
//create database if it doesn't already exist
var dbInit = db.query('create database reminderbot')
.catch(function(e) {
	if (e.code === 'ER_DB_CREATE_EXISTS')
	console.log('reminderbot database already exists');

	else throw e;
})

module.exports = {
}
