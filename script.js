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

const estadoPartida = {
    ingredientesSeleccionados: [],
    pedidoActual: null,
    puntuacion: 0,
    vidas: VIDAS_INICIALES,
    tiempoRestante: DURACION_PARTIDA,
    cantidadPedidos: 0,
    boticaAbierta: false
};

let temporizador = null;

function buscarIngrediente(id) {
    return ingredientesDisponibles.find((ingrediente) => ingrediente.id === id);
}

function crearBotonesIngredientes() {
    ingredientesElemento.textContent = "";
    botonesIngredientes.clear();

    ingredientesDisponibles.forEach((ingrediente) => {
        const boton = document.createElement("button");
        const icono = document.createElement("span");
        const nombre = document.createElement("strong");

        boton.type = "button";
        boton.className = "ingrediente";
        boton.dataset.id = ingrediente.id;
        boton.disabled = true;
        boton.setAttribute("aria-pressed", "false");

        icono.textContent = ingrediente.icono;
        icono.setAttribute("aria-hidden", "true");
        nombre.textContent = ingrediente.nombre;

        boton.append(icono, nombre);
        ingredientesElemento.appendChild(boton);

        botonesIngredientes.set(ingrediente.id, boton);
    });
}

function actualizarEstadoControles() {
    const hayIngredientes = estadoPartida.ingredientesSeleccionados.length > 0;

    botonesIngredientes.forEach((boton) => {
        boton.disabled = !estadoPartida.boticaAbierta;
    });

    botonServir.disabled = !estadoPartida.boticaAbierta || !hayIngredientes;
    botonVaciar.disabled = !estadoPartida.boticaAbierta || !hayIngredientes;
}

function actualizarCaldero() {
    contenidoCaldero.textContent = "";

    if (estadoPartida.ingredientesSeleccionados.length === 0) {
        const elementoVacio = document.createElement("li");
        elementoVacio.className = "vacio";
        elementoVacio.textContent = "El caldero está vacío";
        contenidoCaldero.appendChild(elementoVacio);
    } else {
        estadoPartida.ingredientesSeleccionados.forEach((id) => {
            const ingrediente = buscarIngrediente(id);
            const elemento = document.createElement("li");
            elemento.textContent = `${ingrediente.icono} ${ingrediente.nombre}`;
            contenidoCaldero.appendChild(elemento);
        });
    }

    const cantidad = estadoPartida.ingredientesSeleccionados.length;
    contadorIngredientes.textContent =
        cantidad === 1 ? "1 ingrediente" : `${cantidad} ingredientes`;

    botonesIngredientes.forEach((boton, id) => {
        const estaSeleccionado = estadoPartida.ingredientesSeleccionados.includes(id);
        boton.classList.toggle("seleccionado", estaSeleccionado);
        boton.setAttribute("aria-pressed", String(estaSeleccionado));
    });

    actualizarEstadoControles();
}

function mostrarMensaje(texto, tipo = "") {
    mensaje.textContent = texto;
    mensaje.className = "mensaje";

    if (tipo) {
        mensaje.classList.add(tipo);
    }
}

function actualizarMarcadores() {
    puntuacionElemento.textContent = estadoPartida.puntuacion;
    tiempoElemento.textContent = estadoPartida.tiempoRestante;
    vidasElemento.textContent = Array.from(
        { length: VIDAS_INICIALES },
        (_, indice) => {
            return indice < estadoPartida.vidas ? "♥" : "♡";
        }
    ).join(" ");

    vidasElemento.setAttribute(
        "aria-label",
        `${estadoPartida.vidas} licencias disponibles`
    );

    const porcentaje =
        (estadoPartida.tiempoRestante / DURACION_PARTIDA) * 100;
    progresoTiempo.style.width = `${porcentaje}%`;
    progresoTiempo.classList.toggle(
        "tiempo-agotandose",
        estadoPartida.tiempoRestante <= 10
    );
}

function elegirPedido() {
    let siguientePedido =
        pociones[Math.floor(Math.random() * pociones.length)];

    // Solo buscamos una poción distinta si hay más de una disponible.
    // Así evitamos un bucle infinito cuando el array contiene una sola poción.
    if (pociones.length > 1) {
        while (siguientePedido === estadoPartida.pedidoActual) {
            siguientePedido =
                pociones[Math.floor(Math.random() * pociones.length)];
        }
    }

    estadoPartida.pedidoActual = siguientePedido;
    estadoPartida.cantidadPedidos += 1;
    numeroPedido.textContent =
        `#${String(estadoPartida.cantidadPedidos).padStart(3, "0")}`;
    iconoPocion.textContent = estadoPartida.pedidoActual.icono;
    tituloPedido.textContent = estadoPartida.pedidoActual.nombre;
    descripcionPedido.textContent = estadoPartida.pedidoActual.descripcion;
    recetaElemento.textContent = "";

    estadoPartida.pedidoActual.ingredientes.forEach((id) => {
        const ingrediente = buscarIngrediente(id);
        const elemento = document.createElement("li");
        elemento.textContent = `${ingrediente.icono} ${ingrediente.nombre}`;
        recetaElemento.appendChild(elemento);
    });

    vaciarCaldero(false);
}

function alternarIngrediente(id) {
    if (!estadoPartida.boticaAbierta) {
        return;
    }

    const ingrediente = buscarIngrediente(id);

    if (estadoPartida.ingredientesSeleccionados.includes(id)) {
        estadoPartida.ingredientesSeleccionados =
            estadoPartida.ingredientesSeleccionados.filter(
                (ingredienteId) => ingredienteId !== id
            );

        mostrarMensaje(
            `Has retirado ${ingrediente.nombre} del caldero.`
        );
    } else {
        estadoPartida.ingredientesSeleccionados.push(id);

        mostrarMensaje(
            `Has añadido ${ingrediente.nombre} al caldero.`
        );
    }

    actualizarCaldero();
}

function vaciarCaldero(mostrarAviso = true) {
    estadoPartida.ingredientesSeleccionados = [];

    if (mostrarAviso) {
        mostrarMensaje(
            "Has vaciado todos los ingredientes del caldero."
        );
    }

    actualizarCaldero();
}

function contieneIngredientesCorrectos() {
    if (!estadoPartida.pedidoActual) {
        return false;
    }

    if (
        estadoPartida.ingredientesSeleccionados.length !==
        estadoPartida.pedidoActual.ingredientes.length
    ) {
        return false;
    }

    return estadoPartida.pedidoActual.ingredientes.every((id) =>
        estadoPartida.ingredientesSeleccionados.includes(id)
    );
}

function calcularResultadoEntrega(estado, esCorrecta) {
    return {
        puntuacion: estado.puntuacion + (esCorrecta ? 10 : 0),
        vidas: estado.vidas - (esCorrecta ? 0 : 1)
    };
}

function registrarEntrega(esCorrecta) {
    const mensajeVacio =
        historialElemento.querySelector(".historial-vacio");

    if (mensajeVacio) {
        mensajeVacio.remove();
    }

    const entrada = document.createElement("li");
    entrada.className = esCorrecta ? "correcto" : "incorrecto";

    entrada.textContent = esCorrecta
        ? `✓ ${estadoPartida.pedidoActual.nombre} entregada correctamente`
        : `✕ ${estadoPartida.pedidoActual.nombre} salió mal`;

    historialElemento.prepend(entrada);

    while (historialElemento.children.length > 6) {
        historialElemento.lastElementChild.remove();
    }
}

function servirPocion() {
    if (
        !estadoPartida.boticaAbierta ||
        !estadoPartida.pedidoActual ||
        estadoPartida.ingredientesSeleccionados.length === 0
    ) {
        return;
    }

    const esCorrecta = contieneIngredientesCorrectos();
    const nuevoEstado = calcularResultadoEntrega(estadoPartida, esCorrecta);
    registrarEntrega(esCorrecta);

    estadoPartida.puntuacion = nuevoEstado.puntuacion;
    estadoPartida.vidas = nuevoEstado.vidas;
    mostrarMensaje(
        esCorrecta
            ? "¡Mezcla perfecta! Has ganado 10 puntos."
            : "La mezcla no coincide con la receta. Pierdes una licencia.",
        esCorrecta ? "exito" : "error"
    );

    actualizarMarcadores();

    if (estadoPartida.vidas === 0) {
        terminarPartida(
            "Te has quedado sin licencias de alquimista."
        );
    } else {
        elegirPedido();
    }
}

function terminarPartida(motivo) {
    estadoPartida.boticaAbierta = false;
    clearInterval(temporizador);
    temporizador = null;

    actualizarEstadoControles();

    calderoPanel.classList.remove("partida-activa");

    mostrarMensaje(
        `${motivo} Puntuación final: ${estadoPartida.puntuacion}.`,
        "error"
    );

    botonIniciar.textContent = "Abrir de nuevo";
    botonIniciar.focus();
}

function avanzarTiempo() {
    estadoPartida.tiempoRestante -= 1;
    actualizarMarcadores();

    if (estadoPartida.tiempoRestante === 0) {
        terminarPartida("La botica ha cerrado.");
    }
}

function iniciarBotica() {
    clearInterval(temporizador);

    estadoPartida.boticaAbierta = true;
    estadoPartida.puntuacion = 0;
    estadoPartida.vidas = VIDAS_INICIALES;
    estadoPartida.tiempoRestante = DURACION_PARTIDA;
    estadoPartida.cantidadPedidos = 0;
    estadoPartida.pedidoActual = null;

    botonIniciar.textContent = "Reiniciar partida";

    historialElemento.textContent = "";

    const mensajeVacio = document.createElement("li");
    mensajeVacio.className = "historial-vacio";
    mensajeVacio.textContent =
        "Todavía no has entregado ninguna poción.";

    historialElemento.appendChild(mensajeVacio);

    calderoPanel.classList.add("partida-activa");
    actualizarMarcadores();

    mostrarMensaje(
        "La botica está abierta. Prepara el primer pedido."
    );

    elegirPedido();

    temporizador = setInterval(avanzarTiempo, 1000);
}

ingredientesElemento.addEventListener("click", (evento) => {
    const botonIngrediente =
        evento.target.closest(".ingrediente");

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
