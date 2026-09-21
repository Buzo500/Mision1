# Alquimista Express

Misión M1 · El Despertar del DOM — Web Development I.

## Cómo probarlo

Abre `index.html` directamente en el navegador o utiliza Live Server.

1. Pulsa **Abrir botica**.
2. Busca en la estantería los tres ingredientes indicados en la receta.
3. Selecciónalos y pulsa **Servir poción**.
4. Consigue tantos puntos como puedas antes de que terminen los 45 segundos.

Cada receta correcta suma 10 puntos. Una mezcla incorrecta consume una de las tres licencias. La tecla secreta `L` cambia la iluminación del laboratorio.

## Uso de IA

Utilicé ChatGPT como apoyo para explorar ideas y construir el proyecto por fases. Dos prompts reales relevantes fueron:

- «Quiero que me des ideas para hacer la misión 1».
- «Dámelo por fases, primero haz la primera fase, hago el commit y así para las siguientes fases».

El trabajo se dividió en cinco fases: interfaz, selección de ingredientes, pedidos, reglas de la partida y acabado final. Antes de cada commit se comprobaron en el navegador las interacciones añadidas, incluyendo mezclas correctas e incorrectas, pérdida de licencias, reinicio y tecla secreta. También se comprobó la sintaxis de JavaScript y que la consola no mostrase errores.

Revisé los cambios fase a fase antes de confirmarlos en Git y mantuve separados el HTML, el CSS y el JavaScript.

## Autopsia

1. Guardo los ingredientes seleccionados en el array `ingredientesSeleccionados` y después actualizo el DOM desde ese estado. La alternativa era consultar las clases CSS de los botones cada vez que se sirve una poción. La descarté porque mezclaría la lógica del juego con su representación visual y haría más difícil vaciar o reiniciar el caldero.

2. Utilizo un único `addEventListener` en el contenedor de ingredientes y averiguo qué botón se pulsó con `closest`. La alternativa era añadir un listener diferente a cada botón. Elegí la delegación porque los botones se crean dinámicamente y así toda la estantería se controla desde un único lugar.
