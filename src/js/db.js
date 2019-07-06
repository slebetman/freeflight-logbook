var tables = require('./db-tables');
var db = window.openDatabase('flightlog','1.0','Freeflight Log',20*1024*1024);

tables.setDB(db);

module.exports = tables;