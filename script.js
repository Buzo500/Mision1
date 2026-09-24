const ingredientesDisponibles = [
    { id: "luna", nombre: "Polvo lunar", icono: "🌙" },
    { id: "hongo", nombre: "Hongo azul", icono: "🍄" },
    { id: "lagrima", nombre: "Lágrima feérica", icono: "💧" },
    { id: "hoja", nombre: "Hoja élfica", icono: "🌿" },
    { id: "fuego", nombre: "Brasa de dragón", icono: "🔥" },
    { id: "cristal", nombre: "Cristal solar", icono: "💎" },
    { id: "rana", nombre: "Esencia de rana", icono: "🐸" },
    { id: "miel", nombre: "Miel encantada", icono: "🍯" }
];

const pociones = [
    {
        nombre: "Elixir de visión nocturna",
        descripcion: "Para un guardabosques que patrulla cuando no hay luna.",
        icono: "🔮",
        ingredientes: ["luna", "hongo", "lagrima"]
    },
    {
        nombre: "Tónico de valor",
        descripcion: "Un aprendiz lo necesita antes de su duelo de graduación.",
        icono: "🧪",
        ingredientes: ["fuego", "miel", "hoja"]
    },
    {
        nombre: "Poción de salto gigante",
        descripcion: "Encargo urgente del equipo real de quidditch sin escobas.",
        icono: "⚗️",
        ingredientes: ["rana", "cristal", "hongo"]
    },
    {
        nombre: "Bálsamo de piel de piedra",
        descripcion: "Ideal para exploradores de mazmorras poco prudentes.",
        icono: "🏺",
        ingredientes: ["cristal", "luna", "hoja"]
    },
    {
        nombre: "Jarabe de voz celestial",
        descripcion: "La soprano del reino actúa esta misma noche.",
        icono: "✨",
        ingredientes: ["miel", "lagrima", "cristal"]
    },
    {
        nombre: "Antídoto escarlata",
        descripcion: "Neutraliza venenos de criaturas del pantano antiguo.",
        icono: "❤️‍🔥",
        ingredientes: ["fuego", "rana", "hoja"]
    }
];

const DURACION_PARTIDA = 45;
const VIDAS_INICIALES = 3;

const puntuacionElemento = document.querySelector("#puntuacion");
const tiempoElemento = document.querySelector("#tiempo");
const progresoTiempo = document.querySelector("#progreso-tiempo");
const vidasElemento = document.querySelector("#vidas");
const numeroPedido = document.querySelector("#numero-pedido");
const iconoPocion = document.querySelector("#icono-pocion");
const tituloPedido = document.querySelector("#titulo-pedido");
const descripcionPedido = document.querySelector("#descripcion-pedido");
const recetaElemento = document.querySelector("#receta");
const ingredientesElemento = document.querySelector("#ingredientes");
const contenidoCaldero = document.querySelector("#contenido-caldero");
const contadorIngredientes = document.querySelector("#contador-ingredientes");
const botonServir = document.querySelector("#servir");
const botonVaciar = document.querySelector("#vaciar");
const botonIniciar = document.querySelector("#iniciar");
const mensaje = document.querySelector("#mensaje");
const historialElemento = document.querySelector("#historial");
const calderoPanel = document.querySelector(".caldero-panel");
const botonesIngredientes = new Map();

let ingredientesSeleccionados = [];
let pedidoActual = null;
let puntuacion = 0;
let vidas = VIDAS_INICIALES;
let tiempoRestante = DURACION_PARTIDA;
let cantidadPedidos = 0;
let boticaAbierta = false;
const temporizador = crearTemporizador(avanzarTiempo);

function buscarIngrediente(id) {
    return ingredientesDisponibles.find((ingrediente) => ingrediente.id === id);
}

function crearTemporizador(alAvanzar, intervalo = 1000) {
    let identificador = null;

    function detener() {
        if (identificador !== null) {
            clearInterval(identificador);
            identificador = null;
        }
    }

    function iniciar() {
        detener();
        identificador = setInterval(alAvanzar, intervalo);
    }

    return { iniciar, detener };
}

function crearContenidoIngrediente(ingrediente) {
    const contenido = document.createDocumentFragment();
    const icono = document.createElement("span");
    const nombre = document.createElement("strong");

    icono.textContent = ingrediente.icono;
    icono.setAttribute("aria-hidden", "true");
    nombre.textContent = ingrediente.nombre;

    contenido.append(icono, nombre);
    return contenido;
}

function crearBotonesIngredientes() {
    ingredientesElemento.textContent = "";
    botonesIngredientes.clear();

    ingredientesDisponibles.forEach((ingrediente) => {
        const boton = document.createElement("button");

        boton.type = "button";
        boton.className = "ingrediente";
        boton.dataset.id = ingrediente.id;
        boton.setAttribute("aria-pressed", "false");

        boton.appendChild(crearContenidoIngrediente(ingrediente));
        ingredientesElemento.appendChild(boton);
        botonesIngredientes.set(ingrediente.id, boton);
    });
}

function actualizarCaldero() {
    contenidoCaldero.textContent = "";

    if (ingredientesSeleccionados.length === 0) {
        const elementoVacio = document.createElement("li");
        elementoVacio.className = "vacio";
        elementoVacio.textContent = "El caldero está vacío";
        contenidoCaldero.appendChild(elementoVacio);
    } else {
        ingredientesSeleccionados.forEach((id) => {
            const ingrediente = buscarIngrediente(id);
            const elemento = document.createElement("li");
            elemento.appendChild(crearContenidoIngrediente(ingrediente));
            contenidoCaldero.appendChild(elemento);
        });
    }

    const cantidad = ingredientesSeleccionados.length;
    contadorIngredientes.textContent = cantidad === 1 ? "1 ingrediente" : `${cantidad} ingredientes`;
    actualizarEstadoControles();
}

function actualizarEstadoControles() {
    const cantidad = ingredientesSeleccionados.length;
    const puedeUsarCaldero = boticaAbierta && cantidad > 0;

    botonesIngredientes.forEach((boton, id) => {
        const estaSeleccionado = ingredientesSeleccionados.includes(id);
        boton.disabled = !boticaAbierta;
        boton.classList.toggle("seleccionado", estaSeleccionado);
        boton.setAttribute("aria-pressed", String(estaSeleccionado));
    });

    botonVaciar.disabled = !puedeUsarCaldero;
    botonServir.disabled = !puedeUsarCaldero;
}

function mostrarMensaje(texto, tipo = "") {
    mensaje.textContent = texto;
    mensaje.className = "mensaje";

    if (tipo) {
        mensaje.classList.add(tipo);
    }
}

function actualizarMarcadores() {
    puntuacionElemento.textContent = puntuacion;
    tiempoElemento.textContent = tiempoRestante;
    vidasElemento.textContent = Array.from({ length: VIDAS_INICIALES }, (_, indice) => {
        return indice < vidas ? "♥" : "♡";
    }).join(" ");
    vidasElemento.setAttribute("aria-label", `${vidas} licencias disponibles`);

    const porcentaje = (tiempoRestante / DURACION_PARTIDA) * 100;
    progresoTiempo.style.width = `${porcentaje}%`;
    progresoTiempo.style.backgroundColor = tiempoRestante <= 10 ? "#f07d78" : "var(--dorado)";
}

function elegirPedido() {
    let siguientePedido = pociones[Math.floor(Math.random() * pociones.length)];

    // Con una sola poción no hay otra opción posible para el siguiente sorteo.
    if (pociones.length > 1) {
        while (siguientePedido === pedidoActual) {
            siguientePedido = pociones[Math.floor(Math.random() * pociones.length)];
        }
    }

    pedidoActual = siguientePedido;
    cantidadPedidos += 1;
    numeroPedido.textContent = `#${String(cantidadPedidos).padStart(3, "0")}`;
    iconoPocion.textContent = pedidoActual.icono;
    tituloPedido.textContent = pedidoActual.nombre;
    descripcionPedido.textContent = pedidoActual.descripcion;
    recetaElemento.textContent = "";

    pedidoActual.ingredientes.forEach((id) => {
        const ingrediente = buscarIngrediente(id);
        const elemento = document.createElement("li");
        elemento.appendChild(crearContenidoIngrediente(ingrediente));
        recetaElemento.appendChild(elemento);
    });

    vaciarCaldero(false);
}

function alternarIngrediente(id) {
    if (!boticaAbierta) {
        return;
    }

    const ingrediente = buscarIngrediente(id);

    if (ingredientesSeleccionados.includes(id)) {
        ingredientesSeleccionados = ingredientesSeleccionados.filter((ingredienteId) => ingredienteId !== id);
        mostrarMensaje(`Has retirado ${ingrediente.nombre} del caldero.`);
    } else {
        ingredientesSeleccionados.push(id);
        mostrarMensaje(`Has añadido ${ingrediente.nombre} al caldero.`);
    }

    actualizarCaldero();
}

function vaciarCaldero(mostrarAviso = true) {
    ingredientesSeleccionados = [];

    if (mostrarAviso) {
        mostrarMensaje("Has vaciado todos los ingredientes del caldero.");
    }

    actualizarCaldero();
}

function contieneIngredientesCorrectos() {
    if (ingredientesSeleccionados.length !== pedidoActual.ingredientes.length) {
        return false;
    }

    return pedidoActual.ingredientes.every((id) => ingredientesSeleccionados.includes(id));
}

function registrarEntrega(esCorrecta) {
    const mensajeVacio = historialElemento.querySelector(".historial-vacio");

    if (mensajeVacio) {
        mensajeVacio.remove();
    }

    const entrada = document.createElement("li");
    entrada.className = esCorrecta ? "correcto" : "incorrecto";
    entrada.textContent = esCorrecta
        ? `✓ ${pedidoActual.nombre} entregada correctamente`
        : `✕ ${pedidoActual.nombre} salió mal`;
    historialElemento.prepend(entrada);

    while (historialElemento.children.length > 6) {
        historialElemento.lastElementChild.remove();
    }
}

function servirPocion() {
    if (!boticaAbierta || ingredientesSeleccionados.length === 0) {
        return;
    }

    const esCorrecta = contieneIngredientesCorrectos();
    registrarEntrega(esCorrecta);

    if (esCorrecta) {
        puntuacion += 10;
        mostrarMensaje("¡Mezcla perfecta! Has ganado 10 puntos.", "exito");
    } else {
        vidas -= 1;
        mostrarMensaje("La mezcla no coincide con la receta. Pierdes una licencia.", "error");
    }

    actualizarMarcadores();

    if (vidas === 0) {
        terminarPartida("Te has quedado sin licencias de alquimista.");
    } else {
        elegirPedido();
    }
}

function terminarPartida(motivo) {
    boticaAbierta = false;
    temporizador.detener();
    actualizarCaldero();
    calderoPanel.classList.remove("partida-activa");
    mostrarMensaje(`${motivo} Puntuación final: ${puntuacion}.`, "error");
    botonIniciar.textContent = "Abrir de nuevo";
    botonIniciar.focus();
}

function avanzarTiempo() {
    tiempoRestante -= 1;
    actualizarMarcadores();

    if (tiempoRestante === 0) {
        terminarPartida("La botica ha cerrado.");
    }
}

function iniciarBotica() {
    temporizador.detener();
    boticaAbierta = true;
    puntuacion = 0;
    vidas = VIDAS_INICIALES;
    tiempoRestante = DURACION_PARTIDA;
    cantidadPedidos = 0;
    pedidoActual = null;
    botonIniciar.textContent = "Reiniciar partida";

    historialElemento.textContent = "";
    const mensajeVacio = document.createElement("li");
    mensajeVacio.className = "historial-vacio";
    mensajeVacio.textContent = "Todavía no has entregado ninguna poción.";
    historialElemento.appendChild(mensajeVacio);

    calderoPanel.classList.add("partida-activa");
    actualizarMarcadores();
    mostrarMensaje("La botica está abierta. Prepara el primer pedido.");
    elegirPedido();
    temporizador.iniciar();
}

ingredientesElemento.addEventListener("click", (evento) => {
    const botonIngrediente = evento.target.closest(".ingrediente");

    if (botonIngrediente) {
        alternarIngrediente(botonIngrediente.dataset.id);
    }
});

botonVaciar.addEventListener("click", () => vaciarCaldero());
botonServir.addEventListener("click", servirPocion);
botonIniciar.addEventListener("click", iniciarBotica);

document.addEventListener("keydown", (evento) => {
    if (evento.key.toLowerCase() === "l" && !evento.repeat) {
        document.body.classList.toggle("luz-arcana");
    }
});

crearBotonesIngredientes();
actualizarCaldero();
actualizarMarcadores();
