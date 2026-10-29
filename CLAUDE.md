# Web de planes · Paula Cabrera Training

Esta carpeta es la web pública de los planes interactivos de los clientes de Paula Cabrera (entrenadora personal).
GitHub Pages la publica en https://paulacabreratraining-pcm.github.io/

## Estructura

- `plantilla/plan.html`: plantilla del plan interactivo. Es la base de cada plan nuevo. No se envía a clientes.
- `clientes/<nombre>-<código>/index.html`: el plan de cada cliente. Su enlace es `https://paulacabreratraining-pcm.github.io/clientes/<nombre>-<código>/`.
- `icono.png`: icono de la app (monograma PC). Todos los planes lo enlazan como `/icono.png`.
- `clientes/laura-ejemplo/`: clienta inventada para enseñar la plantilla.

## Reglas de privacidad (la web es pública)

- La carpeta de cada cliente es `nombre-código`, con el nombre de pila en minúsculas y 4 caracteres aleatorios (`marta-x7k2`). Nunca solo el nombre.
- Dentro del archivo, solo el nombre de pila. Sin apellidos, teléfono ni correo.
- Nada de datos de salud: ni PAR-Q+, ni patologías, ni medicación. `CLIENTE.inicial` va siempre a `null` en clientes reales: el cliente apunta su valoración inicial en el móvil.
- No crear un `index.html` en la raíz que liste los clientes.

## Cómo se crea un plan

1. Copiar `plantilla/plan.html` a `clientes/<nombre>-<código>/index.html`.
2. Rellenar el bloque `CLIENTE` (id = nombre de la carpeta, nombre, servicio, inicio = lunes de la semana 1, objetivo, nivel, edad, sexo).
3. Adaptar `FOCUS`, las funciones de sesión (`sesA`, `sesB`, `sesC`, `testFuerza`, `testMilla`) y `PLAN` al cliente siguiendo la metodología de Paula.
4. Comprobar el script con `node --check` y abrir la página una vez en Playwright para ver que no hay errores.
5. Commit y push a `main`. GitHub Pages lo publica en 1-2 minutos.
