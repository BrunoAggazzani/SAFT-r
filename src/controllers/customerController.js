const controller = {};
const mysql = require('mysql');
var http = require('http');



controller.validacionRegAdm = (req, res) => {
    const dataRegAdm = req.body;
    console.log(dataRegAdm);

    const usuarioRegAdm = dataRegAdm.usuarioreg;
    const passwordRegAdm = dataRegAdm.passwordreg;
    const mailRegAdm = dataRegAdm.mailreg;
    var adminExist = 1;
    const direccionar = {href: "admin", mje: "El nombre de usuario ingresado ya existe. Por favor escoja otro."};

    req.getConnection((err, conn) => {
        conn.query("SELECT user FROM bruno.administrador WHERE user = " + mysql.escape(usuarioRegAdm), (err, result) => {
            console.log("El result del select es: ");
            console.log(result);
            if (result == "") {
                adminExist = 0;
                console.log('No existe el usuario, nombre de usuario administrador habilitado, adminExist cambio de valor ');
            } else {
                console.log("El nombre de usuario ingresado ya existe.");
                res.render('loginerror', {dir: direccionar});
            }

            if (adminExist == 0) {
                conn.query("INSERT INTO bruno.administrador (user, pass, mail) VALUES (" + mysql.escape(usuarioRegAdm) + ", " + mysql.escape(passwordRegAdm) + ", " + mysql.escape(mailRegAdm) + ")", () => {
                    console.log("Se cargo el nuevo administrador exitosamente");
                    res.redirect('/admin');
                })
            }
        })
    })
};

controller.validacionAdm = (req, res) => {
    const dataAdmin = req.body;
    console.log(dataAdmin);
    const usuario = dataAdmin.usuario;
    const password = dataAdmin.password;
    const direccionar = {href: "admin", mje: "Usuario y/o clave incorrectos"};

    req.getConnection((err, conn) => {
        if (usuario == "") {
            console.log('Usuario no cargado');
            res.render('loginerror', {dir: direccionar});
        } else {
            conn.query("SELECT * FROM bruno.administrador WHERE user = " + mysql.escape(usuario), (err, result) => {
                if (result == "") {
                    console.log('No existe el usuario');
                    res.render('loginerror', {dir: direccionar});
                } else {
                    console.log(result);
                    if (usuario == result[0].user && password == result[0].pass) {
                        console.log('acceso correcto');
                        conn.query("SELECT DISTINCT MONTH(fecha) as mes, YEAR(fecha) as anio FROM bruno.tickets WHERE admin = " + mysql.escape(usuario), (err, resultadoFecha) => {
                            if (err) {
                                console.log("Fallo SELECT");
                            }
                            if (resultadoFecha == ""){
                                resultadoFecha = [{mes: "No hay tickets cargados"}, {anio:"No hay tickets cargados"}];
                                console.log(resultadoFecha);
                                precargadoAdm = {
                                    admin: usuario
                                }
                                console.log(precargadoAdm);
                                res.render('cargasyconsultas', { data: precargadoAdm, 
                                                                fecha: resultadoFecha });
                            } else {
                                console.log(resultadoFecha);
                                precargadoAdm = {
                                    admin: usuario
                                }
                                console.log(precargadoAdm);
                                res.render('cargasyconsultas', { data: precargadoAdm, 
                                                                fecha: resultadoFecha }); 
                            }
                        })                        
                    } else {
                        console.log('hiciste cualquiera');
                        res.render('loginerror', {dir: direccionar});
                    }
                }
            })
        }
    })

};

controller.cargachofer = (req, res) => {
    const datacargachofer = req.body;
    console.log(datacargachofer);

    const nombre = datacargachofer.nombre;
    const movil = datacargachofer.movil;
    const turno = datacargachofer.turno;
    const comision = datacargachofer.comision;
    const usuario = datacargachofer.usuario;
    const pass = datacargachofer.pass;
    const admin = datacargachofer.admin;
    console.log(admin);
    const direccionar = {href: "admin", mje: "El usuario ya existe en la BBDD. Por favor elija otro valor para el campo 'usuario'"};

    req.getConnection((err, conn) => {

        conn.query("SELECT usuario FROM bruno.choferes WHERE usuario = " + mysql.escape(usuario) + "AND admin = " + mysql.escape(admin), (err, result) => {
            console.log("El result del select es: ");
            console.log(result);
            if (result == "") {
                var choferExist = 0;
                console.log('No existe el usuario, choferExist cambio de valor ');
            } else {
                console.log("El usuario ya existe en la BBDD");
                res.render('loginerror', {dir: direccionar});
            }
            if (choferExist == 0) {
                conn.query("INSERT INTO bruno.choferes (nombre, movil, turno, comision, usuario, pass, admin) VALUES (" + mysql.escape(nombre) + ", " + mysql.escape(movil) + ", " + mysql.escape(turno) + ", " + mysql.escape(comision) + ", " + mysql.escape(usuario) + ", " + mysql.escape(pass) + ", " + mysql.escape(admin) + ")", (err, result) => {
                    if (err) {
                        console.log("No se pudo cargar el chofer");
                    } else {
                        console.log("Se cargo el nuevo chofer");
                        conn.query("SELECT * FROM bruno.choferes WHERE admin = " + mysql.escape(admin), (err, choferes) => {
                            if (err) {
                                console.log("fallo SELECT que trae los choferes cargados");
                            } else {
                                console.log("SELECT devolvio el siguiente admin: ");
                                console.log(choferes[0].admin);
                                console.log("SELECT devolvio los siguientes choferes: ");
                                console.log(choferes);
                                var adminCargaChof = {
                                    admin: admin  
                                }
                                res.render('choferescargados', { data: choferes, admin: adminCargaChof });
                            }
                        })
                    }
                })
            }
        })
    })
};

controller.validacionChofer = (req, res) => {
    const datachofer = req.body;
    console.log(datachofer);
    const usuarioCH = datachofer.usuario;
    const password = datachofer.password;
    const direccionar = {href: "chofer", mje: "Usuario y/o clave incorrectos"};    

    req.getConnection((err, conn) => {
        if (usuarioCH == "") {
            console.log('Usuario no cargado');
            res.render('loginerror', {dir: direccionar});
        } else {
            conn.query("SELECT * FROM bruno.choferes WHERE usuario = " + mysql.escape(usuarioCH), (err, result) => {
                if (err) {
                    console.log('fallo SELECT de "validacionChofer"')
                } else {
                    console.log('resultado del SELECT de validacionChofer es: ');
                    console.log(result);                    
                }

                if (result == "") { 
                    var resSelect = 0;
                } else {
                    resSelect = result[0].usuario;
                }
                if (resSelect == 0) {
                    console.log('No existe el usuario');
                    res.render('loginerror', {dir: direccionar});
                } else {
                    console.log(result);
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth()+1; //January is 0 so need to add 1 to make it 1!
                    var yyyy = today.getFullYear();
                    if(dd<10){
                    dd='0'+dd
                    } 
                    if(mm<10){
                    mm='0'+mm
                    }
                    today = yyyy+'-'+mm+'-'+dd;

                    if (usuarioCH == result[0].usuario && password == result[0].pass) {
                        console.log('acceso correcto');
                        console.log(today);
                        const chmovil = result[0].movil;
                        const chadmin = result[0].admin;
                        var precargadoChof = {
                            user: usuarioCH,
                            movil: chmovil, 
                            chadmin: chadmin,
                            today: today
                        }
                        res.render('cargadeticket', { data: precargadoChof });
                    } else {
                        console.log('hiciste cualquiera');
                        res.render('loginerror', {dir: direccionar});
                    }
                }
            })
        }
    })
};

controller.confirmaTicket = (req, res) => {
    const datacargaticket = req.body;
    console.log(datacargaticket);

    const nroticket = datacargaticket.nroticket;
    const fecha = datacargaticket.fecha;
    const kmocupado = datacargaticket.kmocupado;
    const kmlibre = datacargaticket.kmlibre;
    const viajes = datacargaticket.viajes;
    const recaudacion = datacargaticket.recaudacion;
    const combustible = datacargaticket.combustible;
    const gastos = datacargaticket.gastos;
    const usuariochtick = datacargaticket.usuario;
    const usuariochmovil = datacargaticket.movil;
    const diachofer = datacargaticket.diachofer;
    const usuariochadmin = datacargaticket.admin;
    const today = datacargaticket.today;
    
    var ticketExist = 1;

    req.getConnection((err, conn) => {
        conn.query("SELECT nroticket FROM bruno.tickets WHERE nroticket = " + mysql.escape(nroticket) + "AND movil = " + mysql.escape(usuariochmovil)+ "AND admin = " + mysql.escape(usuariochadmin), (err, result) => {
            if (err) {
                console.log("Fallo SELECT");
            } else {
                console.log(result);
            }

            if (result == "") {
                resSelTicketExist = 0;
            } else {
                resSelTicketExist = result[0].nroticket;
            }
            console.log("El result del select es: ");
            console.log(resSelTicketExist);

            if (resSelTicketExist == 0) {
                ticketExist = 0;
                console.log('Nro de ticket aceptado, ticketExist cambio de valor ');
            } else {
                console.log("El ticket numero " + resSelTicketExist + " ya fue cargado");                
                var aviso = "Este usuario ya posee un ticket cargado con el mismo numero";
                var dataTicketerror = {
                    alert: aviso,
                    user: usuariochtick,
                    movil:usuariochmovil,
                    chadmin: usuariochadmin,
                    today: today
                }
                console.log("renderizando porcentajeserror...");
                res.render('porcentajeserror', { data: dataTicketerror });                
            }
             
            if (diachofer=="on"){
                var mje = "SI";
            } else {
                mje = "NO";
            } 
            console.log(mje);
            if (ticketExist == 0) {
                aviso = "Por favor confirme los siguientes datos antes de enviar: ";
                var dataTicketConfirm = {
                    alert: aviso,
                    nroTicket: nroticket,
                    fecha: fecha,
                    kmOcup: kmocupado,
                    kmLibres: kmlibre,
                    viajes: viajes,
                    recaud: recaudacion,
                    combustible: combustible,
                    gastos: gastos, 
                    user: usuariochtick,
                    movil:usuariochmovil,
                    diachofer: diachofer,
                    mje: mje,                    
                    chadmin: usuariochadmin,
                    today: today
                }
                console.log(dataTicketConfirm);
                console.log("renderizando confirmacion...");
                res.render('confirmacionTicket', { data: dataTicketConfirm });
                
            }
        })
    })
}

controller.cargaticket = (req, res) => {
    const datacargaticket = req.body;
    console.log(datacargaticket);

    const nroticket = datacargaticket.nroticket;
    const fecha = datacargaticket.fecha;
    const kmocupado = datacargaticket.kmocupado;
    const kmlibre = datacargaticket.kmlibre;
    const viajes = datacargaticket.viajes;
    const recaudacion = datacargaticket.recaudacion;
    const combustible = datacargaticket.combustible;
    const gastos = datacargaticket.gastos;
    const usuariochtick = datacargaticket.usuario;
    const usuariochmovil = datacargaticket.movil;
    const diachofer = datacargaticket.diachofer;
    const usuariochadmin = datacargaticket.admin;
    const today = datacargaticket.today;
    var comchofer = 0;
    var entrega = 0;
    

    req.getConnection((err, conn) => {        
        conn.query("SELECT comision FROM bruno.choferes WHERE usuario = " + mysql.escape(usuariochtick)+ "AND admin = " + mysql.escape(usuariochadmin), (err, result) => {
            const comisChofer = result[0].comision;
            console.log("comisChofer = ");
            console.log(comisChofer);
            // hacer calculos para comision y entrega, enviarlos dentro dataTicket.
            console.log(diachofer);
            if (diachofer=="on"){
                comchofer = recaudacion - combustible - gastos;
                entrega = 0;
            } else {
                comchofer = (recaudacion * comisChofer) / 100;
                entrega = recaudacion - comchofer - combustible - gastos;
            }            
            
            var multiplicador = 100;
            comchofer = (Math.round(comchofer * multiplicador) / multiplicador).toFixed(2);
            entrega = (Math.round(entrega * multiplicador) / multiplicador).toFixed(2);                    
            conn.query("INSERT INTO bruno.tickets (nroticket, fecha, kmocupado, kmlibre, viajes, recaudacion, combustible, gastos, comchofer, entrega, usuario, movil, admin) VALUES (" + mysql.escape(nroticket) + ", " + mysql.escape(fecha) + ", " + mysql.escape(kmocupado) + ", " + mysql.escape(kmlibre) + ", " + mysql.escape(viajes) + ", " + mysql.escape(recaudacion) + ", " + mysql.escape(combustible) + ", " + mysql.escape(gastos) + ", " + mysql.escape(comchofer) + ", " + mysql.escape(entrega) + ", " + mysql.escape(usuariochtick) + ", " + mysql.escape(usuariochmovil) + ", " + mysql.escape(usuariochadmin) + ")", (err, result) => {
                if (err) {
                    console.log("No se pudo cargar el ticket");
                } else {
                    console.log("ticket cargado");
                    var dataTicket = {
                        com: comchofer,
                        ent: entrega,
                        user: usuariochtick,
                        movil:usuariochmovil,
                        chadmin: usuariochadmin,
                        today: today
                    }
                    console.log("renderizando porcentajes...");
                    res.render('porcentajes', { data: dataTicket }); // Esto es muy bueno: puedo traer cualquier variable desde un select y/o desde un req.body, almacenarlas en un objeto y luego renderizarlas (pintar, cargar, mostrar pero no direccionar) en otra vista.
                }
            })
        })
    })
}


controller.consultaDeChoferes = (req, res) => {
    const datAdmChofer = req.body;
    console.log(datAdmChofer);

    const adminChofer = datAdmChofer;

    req.getConnection((err, conn) => {

        conn.query("SELECT * FROM bruno.choferes WHERE admin = " + mysql.escape(datAdmChofer.admin), (err, choferes) => {
            if (err) {
                console.log("fallo SELECT que trae los choferes cargados");
            } else {
                console.log("SELECT devolvio el siguiente administrador: ");
                console.log(adminChofer);
                console.log("SELECT devolvio los siguientes choferes: ");
                console.log(choferes);
                
                res.render('choferescargados', { data: choferes, admin: adminChofer });
            }
        })
    })
};


controller.inicio = (req, res) => {
    res.render('inicio');
};

controller.chofer = (req, res) => {
    res.render('chofer');
};

controller.admin = (req, res) => {
    res.render('admin');
};

controller.queEsSaft = (req, res) => {
    res.render('queessaft');
};





controller.redirLoginChofer = (req, res) => {
    const dataUsuarioChofer = req.body;
    const usuarioChofer = dataUsuarioChofer.usuario;
    const usuarioMovil = dataUsuarioChofer.movil;
    const usuarioCHadmin = dataUsuarioChofer.admin;
    const today = dataUsuarioChofer.today;
    console.log('data usuario de req.body: ');
    console.log(usuarioChofer);
    console.log(usuarioMovil);
    console.log(usuarioCHadmin);
    console.log(today);

    var precargaUsuarioCh = {
        user: usuarioChofer, 
        movil: usuarioMovil,
        chadmin: usuarioCHadmin,
        today: today
    }
    res.render('cargadeticket', { data: precargaUsuarioCh }); 
};



controller.redirCargasyConsul = (req, res) => {
    const data = req.body;
    console.log(data);
    const admin = data.admin;

    req.getConnection((err, conn) => { 
        conn.query("SELECT DISTINCT MONTH(fecha) as mes, YEAR(fecha) as anio FROM bruno.tickets WHERE admin = " + mysql.escape(admin), (err, resultadoFecha) => {
            if (err) {
                console.log("Fallo SELECT");
            }
            if (resultadoFecha == ""){
                resultadoFecha = [{mes: "No hay tickets cargados"}, {anio:"No hay tickets cargados"}];
                console.log(resultadoFecha);
                precargadoAdm = {
                    admin: admin
                }
                console.log(precargadoAdm);
                res.render('cargasyconsultas', { data: precargadoAdm, 
                                                fecha: resultadoFecha });    
            } else {
                console.log(resultadoFecha);
                precargadoAdm = {
                    admin: admin
                }
                console.log(precargadoAdm);
                res.render('cargasyconsultas', { data: precargadoAdm, 
                                                fecha: resultadoFecha }); 
            }
        })
    })
};

controller.mantenimiento = (req, res) => {
    const datAdmMantenimiento = req.body;
    const adminMan = datAdmMantenimiento.admin;
    console.log(adminMan);

    req.getConnection((err, conn) => { 
        conn.query("SELECT DISTINCT movil FROM bruno.choferes WHERE admin = " + mysql.escape(adminMan), (err, resultadoMoviles) => {
            if (err) {
                console.log("Fallo SELECT");
            } else {
                console.log(resultadoMoviles);
                var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth()+1; //January is 0 so need to add 1 to make it 1!
                    var yyyy = today.getFullYear();
                    if(dd<10){
                    dd='0'+dd
                    } 
                    if(mm<10){
                    mm='0'+mm
                    }
                    today = yyyy+'-'+mm+'-'+dd;
                    
                var moviles = resultadoMoviles;
                var adminDesdeBotonManten = {
                    admin: adminMan,
                    today:today
                }
                res.render('cargamantenimiento', {data: adminDesdeBotonManten, moviles: moviles});
                
            }
        })
    })    
};

controller.cargaMantenimiento = (req, res) => {
    const dataFormManten = req.body;
    console.log(dataFormManten);
    const servicioMan = dataFormManten.servicio;
    const descripcionMan = dataFormManten.descripcion;
    const importeMan = dataFormManten.importe;
    const fechaMan = dataFormManten.fecha;
    const movilMan = dataFormManten.movil;
    const adminMan = dataFormManten.admin;
    req.getConnection((err, conn) => {
        conn.query("INSERT INTO bruno.mantenimiento (servicio, descripcion, importe, fecha, movil, admin) VALUES (" + mysql.escape(servicioMan) + ", " + mysql.escape(descripcionMan) + ", " + mysql.escape(importeMan) + ", " + mysql.escape(fechaMan) + ", " + mysql.escape(movilMan) + ", " + mysql.escape(adminMan) + ")", (err, cargado) => {
            if (err) {
                console.log("No se pudo cargar el mantenimiento");
            } else {
                console.log(cargado);
                console.log("Mantenimiento cargado");
                console.log("redireccionando a cargasyconsultas...");
                var adminDesdeFormManten = {
                    admin: adminMan
                }                
                //res.render('cargasyconsultas', { data: adminDesdeFormManten }); // Esto es muy bueno: puedo traer cualquier variable desde un select y/o desde un req.body, almacenarlas en un objeto y luego renderizarlas (pintar, cargar, mostrar pero no direccionar) en otra vista.
            }
            conn.query("SELECT DISTINCT MONTH(fecha) as mes, YEAR(fecha) as anio FROM bruno.tickets WHERE admin = " + mysql.escape(adminMan), (err, resultadoFecha) => {
                if (err) {
                    console.log("Fallo SELECT");
                } else {
                    console.log(resultadoFecha);                   
                    res.render('cargasyconsultas', { data: adminDesdeFormManten, 
                                                    fecha: resultadoFecha }); 
                }
            })
        })
    })
}

controller.renderRecaudaciones = (req, res) => {
    const data = req.body;
    console.log(data);
    const admin = data.admin;
    const mes = data.mes;
    const anio = data.anio;       

    req.getConnection((err, conn) => {        

        conn.query("SELECT movil, SUM(recaudacion) AS recaudMovil FROM bruno.tickets WHERE admin = "+ mysql.escape(admin) + " AND MONTH(fecha) = "+ mysql.escape(mes) + " AND YEAR(fecha) = "+ mysql.escape(anio) + " GROUP BY movil", (err, resultadoMovil) => {
             if (err) {
                console.log("Fallo select movil");
             } else {
                recPorMovil = resultadoMovil;
                jsonMovil = JSON.stringify(resultadoMovil);
                console.log(recPorMovil);
                conn.query("SELECT usuario, SUM(recaudacion) AS recaudChof FROM bruno.tickets WHERE admin = "+ mysql.escape(admin) + " AND MONTH(fecha) = "+ mysql.escape(mes) + " AND YEAR(fecha) = "+ mysql.escape(anio) + "GROUP BY usuario", (err, resultadoChofer) => {
                    if (err) {
                       console.log("Fallo select usuario");
                    } else {
                        recPorChofer = resultadoChofer;
                        jsonChofer = JSON.stringify(resultadoChofer);
                       //console.log(recPorChofer);
                       conn.query("SELECT SUM(recaudacion) AS recaudTotal FROM bruno.tickets WHERE admin = "+ mysql.escape(admin) + " AND MONTH(fecha) = "+ mysql.escape(mes) + " AND YEAR(fecha) = "+ mysql.escape(anio), (err, resultadoTotal) => {
                            if (err) {
                                console.log("Fallo select total");
                            } else {
                                recTotal = resultadoTotal;                    
                                console.log(recTotal);
        
                                var recaudaciones = {
                                    admin: admin
                                }

                                var fechas = {                                    
                                    mes: mes,
                                    anio: anio
                                }
                                
                                res.render('recaudaciones', {data: recaudaciones,// HTML ==> data.usuario
                                                            fecha: fechas,   
                                                            movil: recPorMovil,// HTML ==> movil.movil y movil.recaudMovil   
                                                            jsonMovil: jsonMovil,
                                                            jsonChofer: jsonChofer,
                                                            chofer: recPorChofer,// HTML ==> chofer.usuario y chofer.recaudChof
                                                             total: recTotal// HTML ==> total[0].recaudTotal
                                                            });
                            }                
                        })
                    }             
                })
             }             
        })           
    })   
}

controller.renderComisiones= (req, res) => {
    const data = req.body;
    console.log(data);
    const admin = data.admin;
    const mes = data.mes;
    const anio = data.anio;
    
    req.getConnection((err, conn) => {        

        conn.query("SELECT usuario, SUM(comchofer) AS comchofer FROM bruno.tickets WHERE admin = "+ mysql.escape(admin) + " AND MONTH(fecha) = "+ mysql.escape(mes) + " AND YEAR(fecha) = "+ mysql.escape(anio) + "GROUP BY usuario", (err, resultadoRecUsuario) => {
             if (err) {
                console.log("Fallo select movil");
             } else {
                comTotchofer = resultadoRecUsuario;
                jsonComisChofer = JSON.stringify(resultadoRecUsuario);
                //console.log(comTotchofer);                
        
                var adminprueba = {
                    admin: admin
                }

                var fechas = {                                    
                    mes: mes,
                    anio: anio
                }
                res.render('comisiones', {data: adminprueba, // HTML ==> data.usuario
                                        chofer: comTotchofer,// HTML ==> chofer.usuario y chofer.comchofer
                                        fecha: fechas,
                                        jsonComisChofer: jsonComisChofer
                                        });                  
             }             
        })           
    })    
}

controller.renderEntregas= (req, res) => {
    const data = req.body;
    console.log(data);
    const admin = data.admin;
    const mes = data.mes;
    const anio = data.anio;
    
    req.getConnection((err, conn) => {        

        conn.query("SELECT movil, SUM(entrega) AS entreTotMovil FROM bruno.tickets WHERE admin = "+ mysql.escape(admin) + " AND MONTH(fecha) = "+ mysql.escape(mes) + " AND YEAR(fecha) = "+ mysql.escape(anio) + "GROUP BY movil", (err, resultadoMovil) => {
             if (err) {
                console.log("Fallo select movil");
             } else {
                entregaTotMovil = resultadoMovil;
                jsonEntregaTotMovil =JSON.stringify(resultadoMovil);
                //console.log(entregaTotMovil);
                conn.query("SELECT usuario, SUM(entrega) AS entreTotChof FROM bruno.tickets WHERE admin = "+ mysql.escape(admin) + " AND MONTH(fecha) = "+ mysql.escape(mes) + " AND YEAR(fecha) = "+ mysql.escape(anio) + "GROUP BY usuario", (err, resultadoChofer) => {
                    if (err) {
                       console.log("Fallo select usuario");
                    } else {
                        entregaTotChofer = resultadoChofer;
                        jsonEntregaTotChofer =JSON.stringify(resultadoChofer);
                       //console.log(entregaTotChofer);
                       conn.query("SELECT SUM(entrega) AS entregaTotal FROM bruno.tickets WHERE admin = "+ mysql.escape(admin) + " AND MONTH(fecha) = "+ mysql.escape(mes) + " AND YEAR(fecha) = "+ mysql.escape(anio), (err, resultadoTotal) => {
                            if (err) {
                                console.log("Fallo select total");
                            } else {
                                entreTotal = resultadoTotal;                    
                                //console.log(entreTotal);
        
                                var adminprueba = {
                                    admin: admin
                                }
                                var fechas = {                                    
                                    mes: mes,
                                    anio: anio
                                }
                                res.render('entregas', {data: adminprueba,// HTML ==> data.usuario  
                                                        movil: entregaTotMovil,// HTML ==> movil.movil y movil.entreTotMovil   
                                                        chofer: entregaTotChofer,// HTML ==> chofer.usuario y chofer.entreTotChof
                                                        total: entreTotal,// HTML ==> total[0].entregaTotal
                                                        fecha: fechas,
                                                        jsonEntregaTotMovil: jsonEntregaTotMovil,
                                                        jsonEntregaTotChofer: jsonEntregaTotChofer
                                                        });
                            }                
                        })
                    }             
                })
             }             
        })           
    })    
}

controller.renderCombustible= (req, res) => {
    const data = req.body;
    console.log(data);
    const admin = data.admin;
    const mes = data.mes;
    const anio = data.anio;    

    req.getConnection((err, conn) => {        

        conn.query("SELECT movil, SUM(combustible) AS combTotMovil FROM bruno.tickets WHERE admin = "+ mysql.escape(admin) + " AND MONTH(fecha) = "+ mysql.escape(mes) + " AND YEAR(fecha) = "+ mysql.escape(anio) + "GROUP BY movil", (err, resultadoMovil) => {
             if (err) {
                console.log("Fallo select movil");
             } else {
                combusTotMovil = resultadoMovil;
                jsonCombusTotMovil =JSON.stringify(resultadoMovil);
                //console.log(combusTotMovil);
                conn.query("SELECT usuario, SUM(combustible) AS combTotChof FROM bruno.tickets WHERE admin = "+ mysql.escape(admin) + " AND MONTH(fecha) = "+ mysql.escape(mes) + " AND YEAR(fecha) = "+ mysql.escape(anio) + "GROUP BY usuario", (err, resultadoChofer) => {
                    if (err) {
                       console.log("Fallo select usuario");
                    } else {
                        combusTotChofer = resultadoChofer;
                        jsonCombusTotChofer =JSON.stringify(resultadoChofer);
                       //console.log(combusTotChofer);
                       conn.query("SELECT SUM(combustible) AS combusTotal FROM bruno.tickets WHERE admin = "+ mysql.escape(admin) + " AND MONTH(fecha) = "+ mysql.escape(mes) + " AND YEAR(fecha) = "+ mysql.escape(anio), (err, resultadoTotal) => {
                            if (err) {
                                console.log("Fallo select total");
                            } else {
                                combustibleTotal = resultadoTotal;                    
                                //console.log(combustibleTotal);
        
                                var adminprueba = {
                                    admin: admin
                                }
                                var fechas = {                                    
                                    mes: mes,
                                    anio: anio
                                }
                                res.render('combustible', {data: adminprueba,// HTML ==> data.usuario  
                                                        movil: combusTotMovil,// HTML ==> movil.movil y movil.combTotMovil   
                                                        chofer: combusTotChofer,// HTML ==> chofer.usuario y chofer.combTotChof
                                                        total: combustibleTotal,// HTML ==> total[0].combusTotal
                                                        fecha: fechas,
                                                        jsonCombusTotMovil: jsonCombusTotMovil,
                                                        jsonCombusTotChofer: jsonCombusTotChofer
                                                        });
                            }                
                        })
                    }             
                })
             }             
        })           
    })
}

controller.renderMantenimiento= (req, res) => {
    const data = req.body;
    console.log(data);
    const admin = data.admin;
    const mes = data.mes;
    const anio = data.anio;    

    req.getConnection((err, conn) => {        

        conn.query("SELECT movil, SUM(importe) AS manmovil FROM bruno.mantenimiento WHERE admin = "+ mysql.escape(admin) + " AND MONTH(fecha) = "+ mysql.escape(mes) + " AND YEAR(fecha) = "+ mysql.escape(anio) + "GROUP BY movil", (err, resultadoManMovil) => {
             if (err) {
                console.log("Fallo select movil");
             } else {
                manTotmovil = resultadoManMovil;
                jsonManTotmovil =JSON.stringify(resultadoManMovil);
                //console.log(manTotmovil);                
        
                var adminprueba = {
                    admin: admin
                }
                var fechas = {                                    
                    mes: mes,
                    anio: anio
                }
                res.render('mantenimiento', {data: adminprueba, // HTML ==> data.usuario
                                        manten: manTotmovil,// HTML ==> manten.movil y manten.manmovil
                                        fecha: fechas,
                                        jsonManTotmovil: jsonManTotmovil
                                        });                  
             }             
        })           
    })
}

controller.renderIngrNeto = (req, res) => {
    const data = req.body;
    console.log(data);
    const admin = data.admin;
    const mes = data.mes;
    const anio = data.anio;    

    req.getConnection((err, conn) => {        

        conn.query("SELECT movil, SUM(importe) AS manmovil FROM bruno.mantenimiento WHERE admin = "+ mysql.escape(admin) + " AND MONTH(fecha) = "+ mysql.escape(mes) + " AND YEAR(fecha) = "+ mysql.escape(anio) + "GROUP BY movil", (err, resultadoManMovil) => {
             if (err) {
                console.log("Fallo select movil");
             } else {
                //manTotmovil = resultadoManMovil;
                //console.log(manTotmovil);
                conn.query("SELECT movil, SUM(entrega) AS entreTotMovil FROM bruno.tickets WHERE admin = "+ mysql.escape(admin) + " AND MONTH(fecha) = "+ mysql.escape(mes) + " AND YEAR(fecha) = "+ mysql.escape(anio) + "GROUP BY movil", (err, resultadoMovil) => {
                    if (err) {
                        console.log("Fallo select movil");
                    } else {
                        var entregaTotMovil = resultadoMovil;
                        console.log(entregaTotMovil);
                        var neto =[];
                        for (var i=0; i<entregaTotMovil.length; i++) {
                            var movilEnt=entregaTotMovil[i].movil;
                            var totalEnt=entregaTotMovil[i].entreTotMovil;
                            if (resultadoManMovil == "") {
                                var totalMan = 0;                                
                            }else {
                                var manTotmovil = resultadoManMovil;
                                for (var j=0; j<manTotmovil.length; j++) {
                                    if (manTotmovil[j].movil == movilEnt){
                                        totalMan=manTotmovil[j].manmovil;
                                        console.log(movilEnt);
                                        console.log(totalEnt);
                                        console.log(totalMan);
                                        break;
                                    } else {
                                        totalMan=0;
                                    }                                                                                              
                                }
                            }                            
                            var ingresoNeto = totalEnt - totalMan;
                            console.log(ingresoNeto); 
                            neto[i] = {movil:movilEnt,
                                        ingneto: ingresoNeto }                                                           
                        }
                        var netoPorMovil = [];                       
                        for (var h=0; h<neto.length; h++){
                            netoPorMovil[h] = Object.values(neto[h]);                            
                        }
                        console.log(netoPorMovil);
                        jsonNetoPorMovil =JSON.stringify(netoPorMovil);
                        
                    var adminprueba = {
                    admin: admin
                    }
                    var fechas = {                                    
                        mes: mes,
                        anio: anio
                    }
                    res.render('ingresoNeto', {data: adminprueba, // HTML ==> data.usuario
                                                ingNeto: neto,// HTML ==> ingNeto.movil y ingNeto.ingneto
                                                fecha: fechas,
                                                jsonNetoPorMovil: jsonNetoPorMovil
                                                }); 

                    }
                })                                 
             }             
        })           
    })
}

controller.ultimaSemana = (req, res) => {    
    const data = req.body;
    console.log(data);
    const admin = data.admin;

    req.getConnection((err, conn) => { 
        conn.query("SELECT nroticket, DATE_FORMAT(fecha,'%d/%m/%Y') AS fecha, recaudacion, usuario FROM bruno.tickets WHERE YEARWEEK(fecha) = YEARWEEK(NOW()) AND admin = " + mysql.escape(admin) + "ORDER BY fecha ASC", (err, resultadoSemana) => {
            if (err) {
                console.log("Fallo SELECT");
            } else {
                console.log(resultadoSemana);
                precargadoAdm = {
                    admin: admin
                }
                console.log(precargadoAdm);
                res.render('ultimasemana', { data: precargadoAdm, 
                                            ticksem: resultadoSemana }); 
            }
        })
    })
};


controller.verTicketsMes = (req, res) => {    
    const data = req.body;
    console.log(data);
    const admin = data.admin;
    const mes = data.mes;
    const anio = data.anio;

    req.getConnection((err, conn) => { 
        conn.query("SELECT nroticket, DATE_FORMAT(fecha,'%d/%m/%Y') AS fecha, kmocupado, kmlibre, viajes, recaudacion, combustible, gastos, comchofer,entrega, usuario, movil FROM bruno.tickets WHERE MONTH(fecha) = "+ mysql.escape(mes)+" AND YEAR(fecha) = " + mysql.escape(anio)+" AND admin = " + mysql.escape(admin)+ "ORDER BY fecha ASC", (err, resultadoMes) => {
            if (err) {
                console.log("Fallo SELECT");
            } else {
                console.log(resultadoMes);
                var adminprueba = {
                    admin: admin
                    }
                    var fechas = {                                    
                        mes: mes,
                        anio: anio
                    }
                
                res.render('ticketsDelMes', { data: adminprueba,
                                            fecha: fechas, 
                                            tickmes: resultadoMes }); 
            }
        })
    })
};





module.exports = controller;