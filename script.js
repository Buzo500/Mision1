const formulario = document.querySelector("#formulario");
const numero = document.querySelector("#numero");
const comprobar = document.querySelector("#comprobar");
const entrada = document.querySelector("#entrada");
const mensaje = document.querySelector("#mensaje");
const contador = document.querySelector("#intentos");
const historial = document.querySelector("#historial");
const sinIntentos = document.querySelector("#sin-intentos");
const reiniciar = document.querySelector("#reiniciar");

const maxIntentos = 7;
let numeroSecreto = Math.floor(Math.random() * 100) + 1;
let intentos = 0;
let terminado = false;

function comprobarNumero(evento) {
    evento.preventDefault();

    if (terminado) {
        return;
    }

    let numeroUsuario = Number(numero.value);

    // validamos el input [1,100]
    if (numero.value === "" || !Number.isInteger(numeroUsuario) || numeroUsuario < 1 || numeroUsuario > 100) {
        mensaje.textContent = "Escribe un número entero entre 1 y 100.";
        return;
    }

    intentos = intentos + 1;
    contador.textContent = `Intentos: ${intentos} de ${maxIntentos}`;

    let pista = "";

    // se termina la partida por acierto del usuario
    if (numeroUsuario === numeroSecreto) {
        pista = "¡Has acertado!";
        mensaje.textContent = `¡Has ganado! El número era ${numeroSecreto}. Has usado ${intentos} intento(s).`;
        mensaje.classList.add("acierto");
        terminado = true;
    } else {
        if (numeroUsuario < numeroSecreto) {
            pista = "El número secreto es mayor.";
        } else {
            pista = "El número secreto es menor.";
        }

        mensaje.textContent = pista;

        // se termina la partida por falta de intentos
        if (intentos === maxIntentos) {
            mensaje.textContent = `Se acabaron los intentos. El número era ${numeroSecreto}.`;
            mensaje.classList.add("derrota");
            terminado = true;
        }
    }

    // Creamos un elemento nuevo para cada intento.
    let intento = document.createElement("li");
    intento.textContent = `${numeroUsuario}: ${pista}`;
    historial.appendChild(intento);
    sinIntentos.hidden = true;

    numero.value = "";
    entrada.textContent = "Todavía no has escrito un número.";

    if (terminado) {
        numero.disabled = true;
        comprobar.disabled = true;
        reiniciar.focus();
    } else {
        numero.focus();
    }
}

// funcion que empieza una nueva partida al darle al boton "Nueva Partida"
function nuevaPartida() {
    numeroSecreto = Math.floor(Math.random() * 100) + 1;
    intentos = 0;
    terminado = false;
    contador.textContent = `Intentos: 0 de ${maxIntentos}`;
    mensaje.textContent = "¡Vamos a jugar!";
    mensaje.classList.remove("acierto", "derrota");
    historial.textContent = "";
    sinIntentos.hidden = false;
    numero.value = "";
    numero.disabled = false;
    comprobar.disabled = false;
    entrada.textContent = "Todavía no has escrito un número.";
    numero.focus();
}

formulario.addEventListener("submit", comprobarNumero);
reiniciar.addEventListener("click", nuevaPartida);

numero.addEventListener("input", function () {
    if (numero.value === "") {
        entrada.textContent = "Todavía no has escrito un número.";
    } else {
        entrada.textContent = `Vas a probar con el número ${numero.value}.`;
    }
});

// La tecla D cambia el modo, siempre que no estemos escribiendo en el campo.
document.addEventListener("keydown", function (evento) {
    if (evento.key.toLowerCase() === "d" && evento.target != numero && !evento.repeat) {
        document.body.classList.toggle("oscuro");
    }
});
