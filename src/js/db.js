var brick = require('brick');
var tables = require('./db-tables');
var db = window.openDatabase('flightlog','1.0','Freeflight Log',5*1024*1024);
