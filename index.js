const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mysql = require('mysql');
const myConnection = require('express-myconnection');

const app = express();

//importando rutas
const customerRoutes = require('./src/ruotes/customers');

//configuracion
app.set('port', process.env.PORT || 4002);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/views'));

//middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
//middleware: connection DDBB
app.use(myConnection(mysql, {
    host: 'den1.mysql4.gear.host',
    user: 'bruno',
    password: 'Batman241.',
    port: 3306
}, 'single'));

//rutas
app.use('/', customerRoutes);

//static files
app.use(express.static(path.join(__dirname, 'public')));

//conexion servidor
app.listen(app.get('port'), () => {
    console.log('Servidor en puerto 4002')
});