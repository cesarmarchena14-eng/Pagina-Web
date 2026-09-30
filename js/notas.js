// --- BASE DE DATOS INICIAL EN LA MEMORIA RAM (Usamos 'let' para poder modificarlo) ---
let estudiantes = [
    { nombre: "Miguel Mendoza", notas: [67, 75, 80, 90] },
    { nombre: "César Marchena", notas: [40, 30, 60, 60] },
    { nombre: "Luis Rodríguez", notas: [65, 30, 45, 50] }, 
    { nombre: "María Delgado", notas: [60, 45, 50, 30] },
    { nombre: "Carlos Alfonzo", notas: [20, 20, 20, 20] }, 
    { nombre: "Ana Gutiérrez", notas: [85, 65, 80, 90] },
    { nombre: "José Gregorio", notas: [75, 45, 35, 40] },
    { nombre: "Elena Espinoza", notas: [70, 80, 10, 90] },
    { nombre: "Pedro Pérez", notas: [20, 30, 50, 60] }, 
    { nombre: "Sofía Rondón", notas: [60, 70, 75, 12] }
];

const MAX_EXTRAS = 3;
let extrasAgregados = 0;

// --- FUNCIÓN PRINCIPAL: PROCESAR NOTAS Y MOSTRAR EN CONSOLA ---
function mostrarReporteConsola() {
    console.clear();
    console.log("%c=========================================================================", "color: #3282b8; font-weight: bold;");
    console.log("%c       CONTROL DE NOTAS - 4 EVALUACIONES POR TRIMESTRE (NAVEGADOR)       ", "color: #fff; font-weight: bold; background: #1a1a2e; padding: 2px;");
    console.log("%c=========================================================================", "color: #3282b8; font-weight: bold;");
    
    let sumaClase = 0;
    let notaMaximaGlobal = 0;
    let alumnosReparar = 0;
    let alumnosRecuperar = 0;

    const tablaVisual = estudiantes.map((estudiante, index) => {
        let sumaNotasEstudiante = estudiante.notas.reduce((total, nota) => total + nota, 0);
        let promedioEstudiante = sumaNotasEstudiante / 4;

        sumaClase += promedioEstudiante;
        
        if (promedioEstudiante > notaMaximaGlobal) {
            notaMaximaGlobal = promedioEstudiante;
        }

        let estado = "";
        if (promedioEstudiante >= 60) {
            estado = "Aprobado";
        } else if (promedioEstudiante >= 40 && promedioEstudiante < 59) {
            estado = "Chance de Reparar";
            alumnosReparar++;
        } else {
            estado = "Reprobado";
            alumnosRecuperar++;
        }

        return {
            "N°": index + 1,
            "Estudiante": estudiante.nombre,
            "Evaluaciones": estudiante.notas.join(" | "),
            "Promedio Final": promedioEstudiante.toFixed(2),
            "Condición": estado
        };
    });

    console.table(tablaVisual);

    const promedioGeneralClase = sumaClase / estudiantes.length;

    // Estadísticas corregidas con tu escala real de 1-100
    console.log("=========================================================================");
    console.log(` PROMEDIO GENERAL DE LA CLASE      : ${promedioGeneralClase.toFixed(2)}`);
    console.log(` PROMEDIO MÁS ALTO DE LA SECCIÓN   : ${notaMaximaGlobal.toFixed(2)}`);
    console.log(` TIENEN CHANCE DE REPARAR (40-59)  : ${alumnosReparar}`);
    console.log(` NECESITAN RECUPERAR (<40)         : ${alumnosRecuperar}`);
    console.log(` CUPOS EXTRAS DISPONIBLES          : ${MAX_EXTRAS - extrasAgregados}`);
    console.log("=========================================================================\n");

    setTimeout(mostrarMenu, 1000);
}

// --- MENÚ INTERACTIVO ---
function mostrarMenu() {
    let mensajeMenu = "SISTEMA DE NOTAS - 4 EVALUACIONES\n\nSeleccione una opción:\n1. Registrar nuevo estudiante\n2. Mostrar reporte actualizado\n3. Borrar un estudiante\n4. Salir del programa";
    let opcion = prompt(mensajeMenu);

    // Opción 4 para salir limpia
    if (opcion === null || opcion.trim() === '4') {
        console.log("%c\n¡Programa interactivo finalizado!", "color: #e6db74; font-weight: bold;");
        return;
    }

    switch (opcion.trim()) {
        case '1':
            solicitarDatosEstudiante();
            break;
        case '2':
            mostrarReporteConsola();
            break;
        case '3':
            borrarEstudiante();
            break;
        default:
            alert("❌ Opción inválida.");
            mostrarMenu();
            break;
    }
}

// --- FUNCIÓN PARA AGREGAR NUEVOS REGISTROS (SOLO EN RAM) ---
function solicitarDatosEstudiante() {
    if (extrasAgregados >= MAX_EXTRAS) {
        alert("🚨 ¡Límite alcanzado! Solo se permite insertar 3 estudiantes adicionales.");
        mostrarReporteConsola();
        return;
    }

    let nombre = prompt("Ingrese el nombre del estudiante:");
    if (nombre === null || nombre.trim() === "") {
        alert("❌ El nombre no puede estar vacío.");
        mostrarMenu();
        return;
    }

    let notasNuevas = [];
    for (let i = 1; i <= 4; i++) {
        let notaInput = prompt(`Ingrese la Nota de la Evaluación N°${i} (1-100):`);
        let nota = parseInt(notaInput);

        if (isNaN(nota) || nota < 1 || nota > 100) {
            alert("❌ Calificación inválida. El proceso se cancelará. Intente de nuevo.");
            mostrarMenu();
            return;
        }
        notasNuevas.push(nota);
    }

    // Insertamos directamente en el arreglo vivo de la RAM
    estudiantes.push({ nombre: nombre.trim(), notas: notasNuevas });
    extrasAgregados++;

    alert(`✅ ¡${nombre} registrado con éxito en la RAM!`);
    mostrarReporteConsola();
}

// --- FUNCIÓN PARA ELIMINAR REGISTROS (SOLO EN RAM) ---
function borrarEstudiante() {
    let nombreInput = prompt("Ingrese el nombre exacto del estudiante que desea borrar:");
    
    if (nombreInput === null || nombreInput.trim() === "") {
        alert("Operación cancelada.");
        mostrarMenu();
        return;
    }

    let nombreBuscar = nombreInput.trim().toLowerCase();
    let existe = estudiantes.some(est => est.nombre.trim().toLowerCase() === nombreBuscar);

    if (!existe) {
        alert("❌ El estudiante no se encuentra en el registro.");
        mostrarMenu();
        return;
    }

    // Filtramos directamente sobre la RAM 
    estudiantes = estudiantes.filter(est => est.nombre.trim().toLowerCase() !== nombreBuscar);

    alert("✅ Estudiante eliminado de la memoria de forma temporal.");
    mostrarReporteConsola();
}

// Iniciar automáticamente al cargar el navegador
window.onload = mostrarReporteConsola;