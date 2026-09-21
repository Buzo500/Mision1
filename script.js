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

const puntuacionElemento = document.querySelector("#puntuacion");
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

let ingredientesSeleccionados = [];
let pedidoActual = null;
let puntuacion = 0;
let cantidadPedidos = 0;
let boticaAbierta = false;

function buscarIngrediente(id) {
    return ingredientesDisponibles.find((ingrediente) => ingrediente.id === id);
}

function crearBotonesIngredientes() {
    ingredientesElemento.textContent = "";

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
            elemento.textContent = `${ingrediente.icono} ${ingrediente.nombre}`;
            contenidoCaldero.appendChild(elemento);
        });
    }

    const cantidad = ingredientesSeleccionados.length;
    contadorIngredientes.textContent = cantidad === 1 ? "1 ingrediente" : `${cantidad} ingredientes`;
    botonVaciar.disabled = !boticaAbierta || cantidad === 0;
    botonServir.disabled = !boticaAbierta || cantidad === 0;

    document.querySelectorAll(".ingrediente").forEach((boton) => {
        const estaSeleccionado = ingredientesSeleccionados.includes(boton.dataset.id);
        boton.classList.toggle("seleccionado", estaSeleccionado);
        boton.setAttribute("aria-pressed", String(estaSeleccionado));
    });
}

function mostrarMensaje(texto, tipo = "") {
    mensaje.textContent = texto;
    mensaje.className = "mensaje";

    if (tipo) {
        mensaje.classList.add(tipo);
    }
}

function elegirPedido() {
    let siguientePedido = pociones[Math.floor(Math.random() * pociones.length)];

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
        elemento.textContent = `${ingrediente.icono} ${ingrediente.nombre}`;
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

function servirPocion() {
    if (!boticaAbierta || ingredientesSeleccionados.length === 0) {
        return;
    }

    if (contieneIngredientesCorrectos()) {
        puntuacion += 10;
        puntuacionElemento.textContent = puntuacion;
        mostrarMensaje("¡Mezcla perfecta! Has ganado 10 puntos.", "exito");
        elegirPedido();
    } else {
        mostrarMensaje("La mezcla no coincide con la receta. Revisa los ingredientes.", "error");
    }
}

function iniciarBotica() {
    boticaAbierta = true;
    puntuacion = 0;
    cantidadPedidos = 0;
    pedidoActual = null;
    puntuacionElemento.textContent = puntuacion;
    botonIniciar.textContent = "Reiniciar pedidos";

    document.querySelectorAll(".ingrediente").forEach((boton) => {
        boton.disabled = false;
    });

    mostrarMensaje("La botica está abierta. Prepara el primer pedido.");
    elegirPedido();
}

ingredientesElemento.addEventListener("click", (evento) => {
    const botonIngrediente = evento.target.closest(".ingrediente");

    if (botonIngrediente) {
        alternarIngrediente(botonIngrediente.dataset.id);
    }
});

botonVaciar.addEventListener("click", vaciarCaldero);
botonServir.addEventListener("click", servirPocion);
botonIniciar.addEventListener("click", iniciarBotica);

crearBotonesIngredientes();
actualizarCaldero();
