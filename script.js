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

const ingredientesElemento = document.querySelector("#ingredientes");
const contenidoCaldero = document.querySelector("#contenido-caldero");
const contadorIngredientes = document.querySelector("#contador-ingredientes");
const botonVaciar = document.querySelector("#vaciar");
const mensaje = document.querySelector("#mensaje");

let ingredientesSeleccionados = [];

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
    botonVaciar.disabled = cantidad === 0;

    document.querySelectorAll(".ingrediente").forEach((boton) => {
        const estaSeleccionado = ingredientesSeleccionados.includes(boton.dataset.id);
        boton.classList.toggle("seleccionado", estaSeleccionado);
        boton.setAttribute("aria-pressed", String(estaSeleccionado));
    });
}

function alternarIngrediente(id) {
    const ingrediente = buscarIngrediente(id);

    if (ingredientesSeleccionados.includes(id)) {
        ingredientesSeleccionados = ingredientesSeleccionados.filter((ingredienteId) => ingredienteId !== id);
        mensaje.textContent = `Has retirado ${ingrediente.nombre} del caldero.`;
    } else {
        ingredientesSeleccionados.push(id);
        mensaje.textContent = `Has añadido ${ingrediente.nombre} al caldero.`;
    }

    actualizarCaldero();
}

function vaciarCaldero() {
    ingredientesSeleccionados = [];
    mensaje.textContent = "Has vaciado todos los ingredientes del caldero.";
    actualizarCaldero();
}

ingredientesElemento.addEventListener("click", (evento) => {
    const botonIngrediente = evento.target.closest(".ingrediente");

    if (botonIngrediente) {
        alternarIngrediente(botonIngrediente.dataset.id);
    }
});

botonVaciar.addEventListener("click", vaciarCaldero);

crearBotonesIngredientes();
actualizarCaldero();
