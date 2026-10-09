# QARTA · demo gastronómica

QARTA usa un único motor para experiencias gastronómicas con identidades, cartas y presentaciones diferentes.

## Comercios estáticos

- `sushi-demo` — Nori Lenta
- `edicion-cafe` — EDICIÓN CAFÉ

## Rutas

- `/demos/gastronomia/?r=sushi-demo`
- `/demos/gastronomia/?r=edicion-cafe`
- `/demos/gastronomia/?r=edicion-cafe#carta`

Sin parámetro, el motor usa el comercio definido en `defaultRestaurantSlug`. Si el slug no existe, muestra un estado de recuperación seguro, sin romper la página.

## Separación de responsabilidades

- `qarta-data.js`: comercios, branding, presentación, categorías, catálogo, variantes, extras, promociones, medios de contacto, QR local y bloques editoriales opcionales.
- `qarta-engine.js`: resolución del comercio, render, búsqueda, categorías, detalle de producto, carrito, checkout, WhatsApp y accesibilidad.
- `qarta.css`: interfaz aislada bajo clases `qarta-*`.
- `assets/restaurants/<slug>/`: imágenes y futuros QR locales por comercio.

Para convertir Sushi en una hamburguesería no hace falta reescribir el motor: se añade otra configuración con su `slug`, `brand`, `presentation`, `categories`, `products`, `promotions`, `contact` y `assets`. Carrito, checkout y generación de WhatsApp usan esos datos de forma genérica.

EDICIÓN CAFÉ demuestra que ese mismo motor puede sumar `editorial.editionToday`, `editorial.readings` y `editorial.place` de manera opcional. Los comercios que no definen esos bloques —como Nori Lenta— conservan su render habitual.

El carrito se persiste por comercio en `localStorage` bajo la clave `nodo_qarta_cart_v1:<slug>`. Nombre, dirección, barrio y notas del checkout sólo viven en el formulario actual y nunca se guardan.
