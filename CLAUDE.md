# Web de planes · Paula Cabrera Training

Esta carpeta es la web pública de los planes interactivos de los clientes de Paula Cabrera (entrenadora personal).
GitHub Pages la publica en https://paulacabreratraining-pcm.github.io/

## Estructura

- `plantilla/plan.html`: plantilla del plan interactivo. Es la base de cada plan nuevo. No se envía a clientes.
- `clientes/<nombre>-<código>/index.html`: el plan de cada cliente. Su enlace es `https://paulacabreratraining-pcm.github.io/clientes/<nombre>-<código>/`.
- `icono.png`: icono de la app (monograma PC). Todos los planes lo enlazan como `/icono.png`.
- `clientes/laura-ejemplo/`: clienta inventada para enseñar la plantilla.
- `instagram/`: gestión del Instagram de la marca. Tiene su propio `CLAUDE.md` con las instrucciones de gestora.

## Reglas de privacidad (la web es pública)

- La carpeta de cada cliente es `nombre-código`, con el nombre de pila en minúsculas y 4 caracteres aleatorios (`marta-x7k2`). Nunca solo el nombre.
- Dentro del archivo, solo el nombre de pila. Sin apellidos, teléfono ni correo.
- Nada de datos de salud: ni PAR-Q+, ni patologías, ni medicación. `CLIENTE.inicial` va siempre a `null` en clientes reales: el cliente apunta su valoración inicial en el móvil.
- No crear un `index.html` en la raíz que liste los clientes.

## La voz del plan (no cambiar)

Los clientes valoran que el plan suene a Paula y esté hecho para ellos (un cliente pidió expresamente que no se cambie). En cada plan nuevo o renovado:

- Escribir como Paula hablando al cliente: de tú, cercano, frases cortas, sin tecnicismos sin explicar.
- Cada texto (foco de la semana, objetivo de la sesión, notas) se adapta a su objetivo, su nivel, su horario y lo que contó en la valoración o en el check-in. Nada de textos genéricos copiados de otro cliente.
- Explicar el porqué de las decisiones en una frase («esta semana subimos una serie porque…»).
- Mantener la estructura y el diseño de la app: las mejoras se añaden sin cambiar cómo se ve ni cómo se usa.

## Cómo se crea un plan

1. Copiar `plantilla/plan.html` a `clientes/<nombre>-<código>/index.html`.
2. Rellenar el bloque `CLIENTE` (id = nombre de la carpeta, nombre, servicio, inicio = lunes de la semana 1, objetivo, nivel, edad, sexo).
3. Adaptar `FOCUS`, las funciones de sesión (`sesA`, `sesB`, `sesC`, `testFuerza`, `testMilla`) y `PLAN` al cliente siguiendo la metodología de Paula.
   - Vídeos de técnica: el bloque `VIDEOS` (nombre del ejercicio → enlace de YouTube) lo rellena Paula con vídeos que ella haya revisado o propios. Para un vídeo solo en un ejercicio concreto, añade `vid:"<enlace>"` a ese ejercicio. Sin enlace, el botón abre una búsqueda «técnica <ejercicio>» en YouTube. No inventar enlaces.
4. Comprobar el script con `node --check` y abrir la página una vez en Playwright para ver que no hay errores.
5. Commit y push a `main`. GitHub Pages lo publica en 1-2 minutos.
