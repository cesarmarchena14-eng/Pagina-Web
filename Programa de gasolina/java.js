// ==========================================
// 1. CLASES Y HERENCIA PARA USUARIOS
// ==========================================
class Usuario {
    constructor(cedula, nombre, correo, telefono, tipo) {
        this.cedula = cedula;
        this.nombre = nombre;
        this.correo = correo;
        this.telefono = telefono;
        this.tipo = tipo; 
    }
}

class Administrador extends Usuario {
    constructor(cedula, nombre, correo, telefono) {
        super(cedula, nombre, correo, telefono, "Administrador");
    }
}

class Empleado extends Usuario {
    constructor(cedula, nombre, correo, telefono) {
        super(cedula, nombre, correo, telefono, "Empleado");
    }
}

// ==========================================
// 2. CLASES, HERENCIA Y POLIMORFISMO PARA VEHÍCULOS
// ==========================================
class Vehiculo {
    constructor(marca, modelo, placa, color) {
        this.marca = marca;
        this.modelo = modelo;
        this.placa = placa;
        this.color = color;
    }

    obtenerLitrosAsignados() {
        return 0; 
    }
}

class Moto extends Vehiculo {
    constructor(marca, modelo, placa, color) {
        super(marca, modelo, placa, color);
        this.tipo = "Moto";
    }

    obtenerLitrosAsignados() {
        return 5; 
    }
}

class Automovil extends Vehiculo {
    constructor(marca, modelo, placa, color) {
        super(marca, modelo, placa, color);
        this.tipo = "Automóvil";
    }

    obtenerLitrosAsignados() {
        return 20; 
    }
}

class Camion extends Vehiculo {
    constructor(marca, modelo, placa, color) {
        super(marca, modelo, placa, color);
        this.tipo = "Camión";
    }

    obtenerLitrosAsignados() {
        return 50; 
    }
}

// ==========================================
// 3. CLASE ESTACIÓN DE SERVICIOS
// ==========================================
class EstacionServicio {
    constructor(combustibleTotal, horaInicio, horaCierre) {
        this.combustibleTotal = combustibleTotal;
        this.horaInicio = horaInicio;
        this.horaCierre = horaCierre;
        this.tickets = [];
    }

    agregarTicket(ticket) {
        this.tickets.push(ticket);
    }

    estaAbierta() {
        if (!this.horaInicio || !this.horaCierre) return true;

        const ahora = new Date();
        const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();

        const [hInicio, mInicio] = this.horaInicio.split(':').map(Number);
        const minutosInicio = hInicio * 60 + mInicio;

        const [hCierre, mCierre] = this.horaCierre.split(':').map(Number);
        const minutosCierre = hCierre * 60 + mCierre;

        if (minutosInicio <= minutosCierre) {
            return minutosActuales >= minutosInicio && minutosActuales <= minutosCierre;
        } else {
            return minutosActuales >= minutosInicio || minutosActuales <= minutosCierre;
        }
    }
}

// ==========================================
// 4. CLASE TICKET DIGITAL
// ==========================================
class TicketDigital {
    constructor(vehiculo, estatus, motivoCancelacion = "", combustiblePersonalizado = null, turnoAsignado = null) {
        this.estacion = "ORICHUNA.CA";
        this.fechaEmision = new Date().toLocaleDateString();
        
        this.turno = turnoAsignado; 
        this.vehiculo = vehiculo;
        this.estatus = estatus;
        
        if (estatus === "Aceptado") {
            this.combustibleAsignado = (combustiblePersonalizado !== null && !isNaN(combustiblePersonalizado)) 
                ? combustiblePersonalizado 
                : vehiculo.obtenerLitrosAsignados();
        } else {
            this.combustibleAsignado = 0;
        }

        this.motivoCancelacion = motivoCancelacion;
        this.codigoVerificacion = Math.floor(Math.random() * 900) + 100;
    }

    generarComprobante() {
        return `--- ESTACIÓN DE SERVICIOS: ${this.estacion} ---
Fecha: ${this.fechaEmision}
Turno N°: ${this.turno}
----------------------------------------
Vehículo: ${this.vehiculo.tipo} | Marca: ${this.vehiculo.marca} | Modelo: ${this.vehiculo.modelo}
Placa: ${this.vehiculo.placa} | Color: ${this.vehiculo.color}
----------------------------------------
Estatus: ${this.estatus}
${this.estatus === 'Aceptado' ? `Combustible Asignado: ${this.combustibleAsignado} Litros` : `Motivo: ${this.motivoCancelacion}`}
Código de Verificación: ${this.codigoVerificacion}
----------------------------------------`;
    }
}

// ==========================================
// 5. CONTROLADOR LÓGICO Y VALIDACIONES (INDEX.HTML)
// ==========================================
let estacionGlobal = null;
let temporizadorInterval = null;
let turnosDisponibles = Array.from({ length: 20 }, (_, i) => i + 1);

// Guardar Configuración de la Estación
const formEstacion = document.getElementById('form-estacion');
if (formEstacion) {
    formEstacion.addEventListener('submit', function(e) {
        e.preventDefault();
        const combustible = parseFloat(document.getElementById('combustible-total').value);
        const inicio = document.getElementById('hora-inicio').value;
        const cierre = document.getElementById('hora-cierre').value;

        if (isNaN(combustible) || combustible <= 0) {
            alert("Error: Por favor ingrese una cantidad válida de litros disponibles.");
            return;
        }

        if (!inicio || !cierre) {
            alert("Error: Debe establecer la hora de inicio y de cierre de la estación.");
            return;
        }

        estacionGlobal = new EstacionServicio(combustible, inicio, cierre);
        
        turnosDisponibles = Array.from({ length: 20 }, (_, i) => i + 1);
        estacionGlobal.tickets = [];
        actualizarTabla([]);

        alert(`¡Configuración guardada! La estación operará de ${inicio} a ${cierre}. Se han liberado nuevamente los 20 turnos aleatorios.`);
    });
}

// Temporizador Regresivo (3 minutos = 180 segundos)
const btnIniciarProceso = document.getElementById('btn-iniciar-proceso');
if (btnIniciarProceso) {
    btnIniciarProceso.addEventListener('click', function() {
        if (!estacionGlobal) {
            alert("Atención: Primero debe guardar la configuración de la estación antes de iniciar el proceso.");
            return;
        }

        if (turnosDisponibles.length === 0) {
            alert("Atención: Se han agotado los 20 turnos permitidos. No es posible procesar más asignaciones.");
            return;
        }

        if (!estacionGlobal.estaAbierta()) {
            alert(`Error: La estación se encuentra CERRADA en este momento.\nHorario configurado: ${estacionGlobal.horaInicio} a ${estacionGlobal.horaCierre}.`);
            return;
        }

        clearInterval(temporizadorInterval);
        let tiempo = 180;
        const display = document.getElementById('timer-display');
        const btnProcesar = document.getElementById('btn-procesar');
        if (btnProcesar) btnProcesar.disabled = false;

        temporizadorInterval = setInterval(() => {
            let minutos = Math.floor(tiempo / 60);
            let segundos = tiempo % 60;

            minutos = minutos < 10 ? "0" + minutos : minutos;
            segundos = segundos < 10 ? "0" + segundos : segundos;

            if (display) display.textContent = `${minutos}:${segundos}`;

            if (--tiempo < 0) {
                clearInterval(temporizadorInterval);
                if (display) display.textContent = "00:00";
                if (btnProcesar) btnProcesar.disabled = true;
                alert("¡El tiempo límite de 3 minutos ha expirado! El proceso se ha cancelado.");
            }
        }, 1000);
    });
}

// Procesar Asignación y Generar Ticket
const formAsignacion = document.getElementById('form-asignacion');
if (formAsignacion) {
    formAsignacion.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!estacionGlobal) {
            alert("Error: La estación no ha sido configurada.");
            return;
        }

        if (turnosDisponibles.length === 0) {
            alert("Error: Se ha alcanzado el límite máximo de 20 turnos asignados. No se pueden realizar más turnos.");
            return;
        }

        if (!estacionGlobal.estaAbierta()) {
            alert(`Error: No se puede procesar la asignación porque la estación se encuentra CERRADA.\nHorario permitido: ${estacionGlobal.horaInicio} a ${estacionGlobal.horaCierre}.`);
            return;
        }

        const tipo = document.getElementById('tipo-vehiculo').value;
        const marca = document.getElementById('marca').value.trim();
        const modelo = document.getElementById('modelo').value.trim();
        const placa = document.getElementById('placa').value.trim().toUpperCase();
        const color = document.getElementById('color').value.trim();

        const inputLitros = document.getElementById('litros-gasolina') || document.getElementById('litros_gasolina');

        const regexPlaca = /^[A-Z0-9]{5,8}$/;
        if (!regexPlaca.test(placa)) {
            alert("Error: La placa debe ser un código alfanumérico válido (entre 5 y 8 caracteres, sin símbolos especiales).");
            return;
        }

        if (!color) {
            alert("Error: Debe seleccionar un color para el vehículo.");
            return;
        }

        const placaExiste = estacionGlobal.tickets.some(t => t.vehiculo.placa === placa);
        if (placaExiste) {
            alert(`Error: El vehículo con placa ${placa} ya ha sido registrado previamente y ya se le asignó un turno.`);
            return;
        }

        let vehiculoObj;
        if (tipo === "Moto") {
            vehiculoObj = new Moto(marca, modelo, placa, color);
        } else if (tipo === "Automóvil") {
            vehiculoObj = new Automovil(marca, modelo, placa, color);
        } else if (tipo === "Camión") {
            vehiculoObj = new Camion(marca, modelo, placa, color);
        } else {
            alert("Por favor seleccione un tipo de vehículo válido.");
            return;
        }

        let litrosRequeridos = inputLitros ? parseFloat(inputLitros.value) : vehiculoObj.obtenerLitrosAsignados();

        if (isNaN(litrosRequeridos) || litrosRequeridos <= 0) {
            alert("Error: Por favor ingrese una cantidad válida de litros de gasolina.");
            return;
        }

        if (estacionGlobal.combustibleTotal < litrosRequeridos) {
            alert(`¡Atención! No hay suficiente combustible disponible en la estación (${estacionGlobal.combustibleTotal} Lts disponibles) para surtir los ${litrosRequeridos} Lts solicitados.`);
            return;
        }

        const indiceAleatorio = Math.floor(Math.random() * turnosDisponibles.length);
        const turnoAsignado = turnosDisponibles.splice(indiceAleatorio, 1)[0];

        estacionGlobal.combustibleTotal -= litrosRequeridos;

        const ticket = new TicketDigital(vehiculoObj, "Aceptado", "", litrosRequeridos, turnoAsignado);
        estacionGlobal.agregarTicket(ticket);

        clearInterval(temporizadorInterval);
        const btnProcesar = document.getElementById('btn-procesar');
        if (btnProcesar) btnProcesar.disabled = true;

        const ticketResultado = document.getElementById('ticket-resultado');
        if (ticketResultado) ticketResultado.textContent = ticket.generarComprobante();

        actualizarTabla(estacionGlobal.tickets);

        alert(`¡Ticket N° ${ticket.turno} generado con éxito! Se asignaron ${litrosRequeridos} Litros al vehículo ${placa}. Quedan ${turnosDisponibles.length} turnos disponibles.`);
        formAsignacion.reset();
    });
}

function actualizarTabla(tickets) {
    const tbody = document.querySelector('#tabla-tickets tbody');
    if (!tbody) return;
    tbody.innerHTML = "";

    tickets.forEach(t => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td style="padding: 10px;">${t.turno}</td>
            <td style="padding: 10px;">${t.vehiculo.placa}</td>
            <td style="padding: 10px;">${t.vehiculo.tipo}</td>
            <td style="padding: 10px;">${t.vehiculo.marca} / ${t.vehiculo.modelo}</td>
            <td style="padding: 10px;"><strong>${t.combustibleAsignado} L</strong></td>
            <td style="padding: 10px;">${t.estatus}</td>
            <td style="padding: 10px;"><strong>${t.codigoVerificacion}</strong></td>
        `;
        tbody.appendChild(fila);
    });
}

// ==========================================
// 6. MÓDULO DE BÚSQUEDA (POR CÓDIGO Y PLACA)
// ==========================================
const btnBuscar = document.getElementById('btn-buscar');
const inputBusqueda = document.getElementById('input-busqueda');

if (btnBuscar && inputBusqueda) {
    btnBuscar.addEventListener('click', function() {
        if (!estacionGlobal || estacionGlobal.tickets.length === 0) {
            alert("No hay tickets registrados en la estación.");
            return;
        }

        const termino = inputBusqueda.value.trim().toUpperCase();
        if (!termino) {
            alert("Por favor ingrese una placa o código de verificación.");
            actualizarTabla(estacionGlobal.tickets);
            return;
        }

        const resultados = estacionGlobal.tickets.filter(t => 
            t.codigoVerificacion.toString() === termino || 
            t.vehiculo.placa.toUpperCase() === termino
        );

        if (resultados.length > 0) {
            actualizarTabla(resultados);
        } else {
            alert(`No se encontraron tickets con la placa o código: ${termino}`);
            actualizarTabla([]);
        }
    });
}

// ==========================================
// 7. REPORTES Y FILTROS AVANZADOS
// ==========================================
const btnFiltrarReporte = document.getElementById('btn-filtrar-reporte');
if (btnFiltrarReporte) {
    btnFiltrarReporte.addEventListener('click', function() {
        if (!estacionGlobal) {
            alert("La estación no posee datos configurados.");
            return;
        }

        const filtroTipo = document.getElementById('filtro-tipo') ? document.getElementById('filtro-tipo').value : "";
        const filtroMarca = document.getElementById('filtro-marca') ? document.getElementById('filtro-marca').value.trim().toUpperCase() : "";
        const filtroModelo = document.getElementById('filtro-modelo') ? document.getElementById('filtro-modelo').value.trim().toUpperCase() : "";
        const filtroEstatus = document.getElementById('filtro-estatus') ? document.getElementById('filtro-estatus').value : "";

        let resultado = estacionGlobal.tickets;

        if (filtroTipo) {
            resultado = resultado.filter(t => t.vehiculo.tipo === filtroTipo);
        }
        if (filtroMarca) {
            resultado = resultado.filter(t => t.vehiculo.marca.toUpperCase().includes(filtroMarca));
        }
        if (filtroModelo) {
            resultado = resultado.filter(t => t.vehiculo.modelo.toUpperCase().includes(filtroModelo));
        }
        if (filtroEstatus) {
            resultado = resultado.filter(t => t.estatus === filtroEstatus);
        }

        const totalCombustible = resultado.reduce((acc, t) => acc + t.combustibleAsignado, 0);

        actualizarTabla(resultado);

        const displayTotal = document.getElementById('total-combustible-reporte');
        if (displayTotal) {
            displayTotal.textContent = `Total Combustible Asignado: ${totalCombustible} Litros (${resultado.length} Tickets)`;
        } else {
            alert(`Filtro aplicado. Total de combustible asignado: ${totalCombustible} Litros en ${resultado.length} ticket(s).`);
        }
    });
}

// ==========================================
// 8. MÓDULO GESTOR DE USUARIOS (CREAR, MODIFICAR Y ELIMINAR)
// ==========================================
let cedulaUsuarioEnEdicion = null; 

function obtenerUsuarios() {
    let guardados = localStorage.getItem('usuarios_orichuna');
    if (guardados) {
        return JSON.parse(guardados);
    } else {
        const usuariosIniciales = [{
            cedula: "28123456",
            nombre: "Admin",
            apellido: "Principal",
            correo: "admin@orichuna.ca",
            telefono: "04121234567",
            tipo: "Administrador"
        }];
        localStorage.setItem('usuarios_orichuna', JSON.stringify(usuariosIniciales));
        return usuariosIniciales;
    }
}

function guardarUsuarios(lista) {
    localStorage.setItem('usuarios_orichuna', JSON.stringify(lista));
    actualizarTablaUsuarios();
}

function actualizarTablaUsuarios() {
    const tbody = document.querySelector('#tabla-usuarios tbody');
    if (!tbody) return;

    const lista = obtenerUsuarios();
    tbody.innerHTML = "";

    lista.forEach(u => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td style="padding: 10px;">${u.cedula}</td>
            <td style="padding: 10px;">${u.nombre} ${u.apellido}</td>
            <td style="padding: 10px;">${u.correo}</td>
            <td style="padding: 10px;">${u.telefono}</td>
            <td style="padding: 10px;"><strong>${u.tipo}</strong></td>
            <td style="padding: 10px;">
                <button type="button" onclick="prepararEdicionUsuario('${u.cedula}')" style="background-color: #f39c12; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Modificar</button>
                <button type="button" onclick="eliminarUsuario('${u.cedula}')" style="background-color: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-left: 5px;">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

window.prepararEdicionUsuario = function(cedula) {
    const listaUsuarios = obtenerUsuarios();
    const usuario = listaUsuarios.find(u => u.cedula === cedula);

    if (!usuario) {
        alert("Error: Usuario no encontrado.");
        return;
    }

    document.getElementById('cedula-usuario').value = usuario.cedula;
    document.getElementById('nombre-usuario').value = usuario.nombre;
    document.getElementById('apellido-usuario').value = usuario.apellido;
    document.getElementById('correo-usuario').value = usuario.correo;
    document.getElementById('telefono-usuario').value = usuario.telefono;
    document.getElementById('tipo-usuario').value = usuario.tipo;

    cedulaUsuarioEnEdicion = cedula;

    const btnGuardar = document.getElementById('btn-guardar-usuario');
    if (btnGuardar) btnGuardar.textContent = "Guardar Cambios";

    alert(`Modificando al usuario con cédula ${cedula}. Realice los cambios en el formulario y presione Guardar.`);
};

window.eliminarUsuario = function(cedula) {
    let listaUsuarios = obtenerUsuarios();
    const usuario = listaUsuarios.find(u => u.cedula === cedula);

    if (!usuario) {
        alert("Error: El usuario no existe.");
        return;
    }

    if (confirm(`¿Está seguro de que desea eliminar al usuario ${usuario.nombre} ${usuario.apellido} (Cédula: ${cedula})?`)) {
        listaUsuarios = listaUsuarios.filter(u => u.cedula !== cedula);
        guardarUsuarios(listaUsuarios);
        alert("Usuario eliminado correctamente.");
        
        if (cedulaUsuarioEnEdicion === cedula) {
            cancelarEdicionUsuario();
        }
    }
};

function cancelarEdicionUsuario() {
    cedulaUsuarioEnEdicion = null;
    const formUsuario = document.getElementById('form-usuario');
    if (formUsuario) formUsuario.reset();
    const btnGuardar = document.getElementById('btn-guardar-usuario');
    if (btnGuardar) btnGuardar.textContent = "Registrar Usuario";
}

// Limpieza en tiempo real para el input de Cédula (borra los puntos al escribir)
const inputCedulaElem = document.getElementById('cedula-usuario');
if (inputCedulaElem) {
    inputCedulaElem.addEventListener('input', function() {
        this.value = this.value.replace(/\./g, '');
    });
}

const formUsuario = document.getElementById('form-usuario');
if (formUsuario) {
    formUsuario.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validación de rol: solo Administrador puede registrar o guardar
        const sesionActiva = sessionStorage.getItem('sesion_activa');
        const userSesion = sesionActiva ? JSON.parse(sesionActiva) : null;

        if (!userSesion || userSesion.tipo !== "Administrador") {
            alert("Acceso denegado: Solo un usuario con rol Administrador puede gestionar o registrar usuarios.");
            return;
        }

        // Remueve espacios y elimina puntos automáticamente si el usuario los incluyó
        const cedula = document.getElementById('cedula-usuario').value.trim().replace(/\./g, '');
        const nombre = document.getElementById('nombre-usuario').value.trim();
        const apellido = document.getElementById('apellido-usuario').value.trim();
        const correo = document.getElementById('correo-usuario').value.trim();
        const telefono = document.getElementById('telefono-usuario').value.trim();
        const tipo = document.getElementById('tipo-usuario').value;

        const regexCedula = /^\d{6,8}$/;
        if (!regexCedula.test(cedula)) {
            alert("Error: La cédula debe contener solo números (entre 6 y 8 dígitos).");
            return;
        }

        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(correo)) {
            alert("Error: Ingrese un correo electrónico válido.");
            return;
        }

        const telefonoLimpio = telefono.replace(/-/g, '');
        const regexTelefono = /^0(412|414|424|416|426)\d{7}$/;
        if (!regexTelefono.test(telefonoLimpio)) {
            alert("Error: El teléfono debe ser un número celular válido de 11 dígitos.");
            return;
        }

        let listaUsuarios = obtenerUsuarios();

        if (cedulaUsuarioEnEdicion) {
            const index = listaUsuarios.findIndex(u => u.cedula === cedulaUsuarioEnEdicion);
            if (index !== -1) {
                if (cedula !== cedulaUsuarioEnEdicion && listaUsuarios.some(u => u.cedula === cedula)) {
                    alert("Error: La nueva cédula ingresada ya le pertenece a otro usuario.");
                    return;
                }

                listaUsuarios[index] = { cedula, nombre, apellido, correo, telefono: telefonoLimpio, tipo };
                guardarUsuarios(listaUsuarios);
                alert(`¡Usuario con cédula ${cedula} modificado con éxito!`);
                cancelarEdicionUsuario();
            }
        } else {
            if (listaUsuarios.some(u => u.cedula === cedula)) {
                alert("Error: Ya existe un usuario registrado con esta cédula.");
                return;
            }

            const nuevoUsuario = { cedula, nombre, apellido, correo, telefono: telefonoLimpio, tipo };
            listaUsuarios.push(nuevoUsuario);
            guardarUsuarios(listaUsuarios);

            alert(`¡Usuario ${tipo} registrado con éxito!`);
            formUsuario.reset();
        }
    });
}

// ==========================================
// 9. CONTROL DE SESIONES Y PERMISOS DE VISIBILIDAD
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    actualizarTablaUsuarios();

    const sesionInfo = document.getElementById('sesion-info');
    const moduloUsuarios = document.getElementById('modulo-usuarios');
    const moduloEstacion = document.getElementById('modulo-estacion');
    const sesionActiva = sessionStorage.getItem('sesion_activa');

    // La sección de Configuración de la Estación siempre estará visible
    if (moduloEstacion) {
        moduloEstacion.style.display = 'block';
    }

    if (sesionActiva) {
        const user = JSON.parse(sesionActiva);
        
        if (sesionInfo) {
            sesionInfo.textContent = `Sesión: ${user.nombre} (${user.tipo})`;
        }

        // Control de permisos según el tipo de usuario
        if (user.tipo === 'Administrador') {
            if (moduloUsuarios) moduloUsuarios.style.display = 'block';
        } else {
            // Si es Cliente/Invitado o Empleado solo se oculta la sección de Gestor de Usuarios
            if (moduloUsuarios) moduloUsuarios.style.display = 'none';
        }
    } else {
        // Por defecto (Sin sesión / Público / Invitado)
        if (sesionInfo) {
            sesionInfo.textContent = 'Sesión: Público (Cliente)';
        }
        if (moduloUsuarios) moduloUsuarios.style.display = 'none';
    }
});

const formLogin = document.getElementById('form-login');
if (formLogin) {
    formLogin.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const datoIngresado = document.getElementById('login-correo').value.trim().replace(/-/g, '');
        let listaUsuarios = obtenerUsuarios();

        const usuarioEncontrado = listaUsuarios.find(u => 
            u.correo.toLowerCase() === datoIngresado.toLowerCase() || 
            u.telefono === datoIngresado
        );

        if (usuarioEncontrado) {
            sessionStorage.setItem('sesion_activa', JSON.stringify(usuarioEncontrado));
            alert(`¡Bienvenido de nuevo, ${usuarioEncontrado.nombre} (${usuarioEncontrado.tipo})!`);
            window.location.href = "index.html";
        } else {
            alert("Error: Correo o teléfono no registrado.");
        }
    });
}

const btnAccesoPublico = document.getElementById('btn-acceso-publico');
if (btnAccesoPublico) {
    btnAccesoPublico.addEventListener('click', function() {
        sessionStorage.setItem('sesion_activa', JSON.stringify({ tipo: "Cliente", nombre: "Público" }));
        alert("Ingresando en modo Cliente (Acceso Público).");
        window.location.href = "index.html";
    });
}

// ==========================================
// 10. DINÁMICA DE MARCAS, MODELOS Y LITROS SUGERIDOS
// ==========================================
const baseDatosVehiculos = {
    "Moto": {
        "Yamaha": ["AX 100", "FZ 16", "XTZ 125"],
        "Suzuki": ["EN 125", "V-Strom 250", "GN 125"],
        "Haojue": ["HJ 150", "K150"]
    },
    "Automóvil": {
        "Chevrolet": ["Aveo", "Optra", "Cruze", "Spark"],
        "Toyota": ["Corolla", "Hilux", "Yaris", "Dynamic"],
        "Ford": ["Fiesta", "Explorer", "Focus"]
    },
    "Camión": {
        "Ford": ["Cargo 815", "Super Duty"],
        "Mack": ["Vision", "Granite"],
        "Chevrolet": ["Kodiak", "NPR"]
    }
};

const selectTipo = document.getElementById('tipo-vehiculo');
const selectMarca = document.getElementById('marca');
const selectModelo = document.getElementById('modelo');
const inputLitrosGasolina = document.getElementById('litros-gasolina') || document.getElementById('litros_gasolina');

if (selectTipo && selectMarca && selectModelo) {
    selectTipo.addEventListener('change', function() {
        const tipoSeleccionado = this.value;
        
        selectMarca.innerHTML = '<option value="">Seleccione una marca...</option>';
        selectModelo.innerHTML = '<option value="">Seleccione marca primero...</option>';

        if (baseDatosVehiculos[tipoSeleccionado]) {
            const marcas = Object.keys(baseDatosVehiculos[tipoSeleccionado]);
            marcas.forEach(marca => {
                const option = document.createElement('option');
                option.value = marca;
                option.textContent = marca;
                selectMarca.appendChild(option);
            });
        }

        if (inputLitrosGasolina) {
            if (tipoSeleccionado === "Moto") inputLitrosGasolina.value = 5;
            else if (tipoSeleccionado === "Automóvil") inputLitrosGasolina.value = 20;
            else if (tipoSeleccionado === "Camión") inputLitrosGasolina.value = 50;
            else inputLitrosGasolina.value = "";
        }
    });

    selectMarca.addEventListener('change', function() {
        const tipoSeleccionado = selectTipo.value;
        const marcaSeleccionada = this.value;

        selectModelo.innerHTML = '<option value="">Seleccione un modelo...</option>';

        if (baseDatosVehiculos[tipoSeleccionado] && baseDatosVehiculos[tipoSeleccionado][marcaSeleccionada]) {
            const modelos = baseDatosVehiculos[tipoSeleccionado][marcaSeleccionada];
            modelos.forEach(modelo => {
                const option = document.createElement('option');
                option.value = modelo;
                option.textContent = modelo;
                selectModelo.appendChild(option);
            });
        }
    });
}