# Uso de la IA

Utilicé ChatGPT para obtener ideas iniciales para el minijuego.

Uno de los prompts que utilicé fue:
"Dame ideas para un minijuego en el navegador sencillo"

Me propuso varias ideas, como un tablón de pequeñas metas que se van
tachando durante el día o una ruleta de planes aleatorios. Finalmente
decidí hacer por mi cuenta un juego de adivinar un número.

También utilicé ChatGPT para consultar cómo generar un número entero
aleatorio en JavaScript.

Prompt:
"Como generar en javascript numeros enteros aleatorios del 1 al 100"

A partir de esto utilice:
let numeroSecreto = Math.floor(Math.random() * 100) + 1;

Comprobé que funcionaba jugando varias partidas y verificando que se
generaban números dentro del intervalo del 1 al 100. El resto de la
lógica del juego, el HTML y los estilos CSS los escribí y adapté a mano.

# Autopsia

Una decisión discutible fue limitar la partida a 7 intentos. Otra opción
era permitir intentos ilimitados, pero la descarté porque quería que hubiese
una condición de derrota y que las partidas fuesen cortas.

Otra decisión discutible fue guardar los intentos directamente como elementos
`li` en el DOM. Una alternativa habría sido guardar primero los intentos en
un array de JavaScript y generar el historial a partir de él. Lo descarté
porque para un juego tan pequeño no necesitaba mantener ese estado por
separado y añadir cada intento directamente al DOM era más sencillo.