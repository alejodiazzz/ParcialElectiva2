
# Guía de Estudio: Proyecto Node.js con Express y EJS

Este documento te servirá como guía de estudio para tu parcial, basado en el proyecto que hemos analizado. Aquí encontrarás los bloques de código fundamentales, explicados en detalle, para que puedas entender y replicar un proyecto similar en cualquier contexto.

## Arquitectura del Proyecto

El proyecto utiliza una arquitectura simple y común para aplicaciones web con Node.js:

*   **Express.js**: Como framework para el servidor, gestionando rutas y peticiones HTTP.
*   **EJS (Embedded JavaScript)**: Como motor de plantillas para generar HTML dinámicamente.
*   **Node.js**: Como entorno de ejecución para el servidor.

---

## 1. Configuración del Servidor (`index.js`)

El archivo `index.js` es el punto de entrada de la aplicación. Su función es configurar y arrancar el servidor.

### Bloque de Código Fundamental

```javascript
import express from 'express';
import path from 'node:path';
import routes from './routes/index.mjs';

// 1. Inicialización de Express
const app = express();

// 2. Configuración de archivos estáticos
app.use(express.static('public'));

// 3. Configuración del motor de plantillas (EJS)
app.set('views', path.resolve('views'));
app.set('view engine', 'ejs');

// 4. Middleware para procesar datos de formularios
app.use(express.urlencoded({ extended: false }));

// 5. Uso de las rutas
app.use('/', routes);

// 6. Puerto y arranque del servidor
const PORT = process.env.PORT || 6972;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
```

### Explicación Detallada

1.  **Inicialización de Express**:
    *   `const app = express();` crea una instancia de la aplicación Express. `app` será nuestro objeto principal para configurar el servidor.

2.  **Configuración de archivos estáticos**:
    *   `app.use(express.static('public'));` le dice a Express que sirva archivos estáticos (como CSS, JavaScript del lado del cliente, imágenes) directamente desde la carpeta `public`. Cualquier petición a `/css/bootstrap.min.css` buscará el archivo en `public/css/bootstrap.min.css`.

3.  **Configuración del motor de plantillas (EJS)**:
    *   `app.set('views', path.resolve('views'));` le indica a Express dónde buscar las plantillas (archivos `.ejs`). `path.resolve('views')` crea una ruta absoluta a la carpeta `views`, lo que evita problemas sin importar desde dónde se inicie el proceso.
    *   `app.set('view engine', 'ejs');` establece EJS como el motor de plantillas por defecto. Esto nos permite usar `res.render('index')` sin tener que especificar la extensión `.ejs`.

4.  **Middleware para procesar datos de formularios**:
    *   `app.use(express.urlencoded({ extended: false }));` es un *middleware* que procesa los datos enviados desde un formulario HTML (`Content-Type: application/x-www-form-urlencoded`). Los datos del formulario estarán disponibles en el objeto `req.body`.

5.  **Uso de las rutas**:
    *   `app.use('/', routes);` monta el enrutador definido en `./routes/index.mjs` en la ruta base (`/`). Todas las rutas definidas en ese archivo serán relativas a `/`.

6.  **Puerto y arranque del servidor**:
    *   `const PORT = process.env.PORT || 6972;` define el puerto en el que se ejecutará el servidor. Tomará el puerto de las variables de entorno si está disponible, o usará `6972` como valor por defecto.
    *   `app.listen(PORT, ...)` inicia el servidor y lo pone a la escucha de peticiones en el puerto especificado.

---

## 2. Gestión de Rutas (`routes/index.mjs`)

Este archivo define los *endpoints* o URLs de la aplicación y qué hacer cuando un usuario los visita.

### Bloque de Código Fundamental

```javascript
import express from 'express';
import data from '../resources/data.mjs'; // Simulación de base de datos

const router = express.Router();

// Ruta para mostrar la lista de elementos
router.get('/', (req, res) => {
  res.render('index.ejs', {
    title: "Página Principal",
    data: data
  });
});

// Ruta para mostrar el formulario de nuevo registro
router.get('/new-pc', (req, res) => {
  res.render('add-record.ejs', { title: "Nuevo Registro" });
});

// Ruta para procesar el formulario y agregar un nuevo elemento
router.post('/', (req, res) => {
  const { idPc, mark, value, state } = req.body;
  const newRecord = { id: idPc, trademark: mark, value: value, state: true };

  data.push(newRecord);
  res.redirect('/');
});

export default router;
```

### Explicación Detallada

*   **`router.get('/', ...)`**:
    *   Define una ruta que responde a peticiones `GET` a la URL raíz (`/`).
    *   `res.render('index.ejs', { ... })` renderiza la plantilla `index.ejs`. El segundo argumento es un objeto que pasa datos a la plantilla. En este caso, la variable `title` en EJS será "Página Principal" y la variable `data` contendrá los datos importados.

*   **`router.post('/', ...)`**:
    *   Define una ruta que responde a peticiones `POST` a la URL raíz (`/`). Esta es la ruta a la que el formulario de "nuevo registro" envía los datos.
    *   `const { ... } = req.body;` extrae los datos del cuerpo de la petición, que fueron procesados por `express.urlencoded`. Los nombres (`idPc`, `mark`, etc.) corresponden a los atributos `name` de los `<input>` en el formulario HTML.
    *   `data.push(newRecord);` agrega el nuevo registro al array de datos (nuestra simulación de base de datos).
    *   `res.redirect('/');` redirige al usuario de vuelta a la página principal después de procesar los datos. Esto es un patrón común para evitar reenvíos de formulario si el usuario recarga la página.

---

## 3. Plantillas HTML con EJS (`views/`)

EJS permite incrustar código JavaScript directamente en el HTML para generar contenido dinámico.

### `index.ejs` (Mostrar una lista de datos)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <%- include('templates/header.ejs', {title: title}) %>
</head>
<body>
  <div class="container">
    <h1>Lista de PCs</h1>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Marca</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
        <% data.forEach(pc => { %>
          <tr>
            <td><%= pc.id %></td>
            <td><%= pc.trademark %></td>
            <td><%= pc.value %></td>
          </tr>
        <% }); %>
      </tbody>
    </table>
    <a href="/new-pc" class="btn btn-primary">Agregar Nuevo</a>
  </div>
</body>
</html>
```

*   **`<% ... %>`**: Etiqueta de "scriptlet" de EJS. Ejecuta el código JavaScript que contiene. Se usa para lógica como bucles (`forEach`) o condicionales (`if`).
*   **`<%= ... %>`**: Etiqueta de "output" de EJS. Imprime el valor de la expresión en el HTML, escapando los caracteres especiales para prevenir ataques XSS. Por ejemplo, si `pc.trademark` es `<script>`, lo convertirá a `&lt;script&gt;`.
*   **`<%- include(...) %>`**: Incluye otra plantilla EJS. Es útil para reutilizar componentes como cabeceras y pies de página.

### `add-record.ejs` (Formulario para crear datos)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <%- include('templates/header.ejs', {title: title}) %>
</head>
<body>
  <div class="container">
    <h1>Agregar Nuevo PC</h1>
    <form action="/" method="POST">
      <div class="mb-3">
        <label for="idPc" class="form-label">ID del PC</label>
        <input type="text" class="form-control" id="idPc" name="idPc" required>
      </div>
      <div class="mb-3">
        <label for="mark" class="form-label">Marca</label>
        <input type="text" class="form-control" id="mark" name="mark" required>
      </div>
      <div class="mb-3">
        <label for="value" class="form-label">Valor</label>
        <input type="number" class="form-control" id="value" name="value" required>
      </div>
      <button type="submit" class="btn btn-success">Guardar</button>
    </form>
  </div>
</body>
</html>
```

*   **`<form action="/" method="POST">`**:
    *   `action="/"`: Especifica que los datos del formulario se enviarán a la ruta raíz (`/`) de la aplicación.
    *   `method="POST"`: Especifica que se usará el método HTTP `POST`. Esto corresponde a la ruta `router.post('/', ...)` que definimos en `routes/index.mjs`.
*   **`name="idPc"`**: El atributo `name` en cada `input` es **crucial**. Es la clave que se usará para identificar el dato en `req.body` en el servidor. Por ejemplo, el valor de este input estará en `req.body.idPc`.

¡Espero que esta guía te sea de gran ayuda para tu parcial! Estúdiala con calma y trata de entender cómo se conectan todas las partes.

---

## 6. Gestión de Variables de Entorno con `.env`

Cuando hablas de "variables de entorno de el archivo json", es muy probable que te refieras a cómo gestionar la configuración de la aplicación (como puertos, credenciales de bases de datos, etc.) de una manera segura y flexible, lo cual se hace comúnmente con archivos `.env` y la librería `dotenv`, que está listada en tu `package.json`.

### ¿Qué son las Variables de Entorno?

Son variables externas a tu aplicación que residen en el sistema operativo o en el contenedor que ejecuta la app. La principal ventaja es que te permiten **separar la configuración del código**.

*   **Seguridad**: Evitas poner datos sensibles (contraseñas, API keys) directamente en el código, que podría ser subido a un repositorio público como GitHub.
*   **Flexibilidad**: Puedes tener diferentes configuraciones para diferentes entornos (desarrollo, pruebas, producción) sin cambiar el código.

### El Papel de `package.json` y `dotenv`

*   **`package.json`**: Este archivo define las dependencias de tu proyecto. Al incluir `"dotenv": "^17.2.1"`, le dices a `npm` que tu proyecto necesita esta librería para funcionar.
*   **`dotenv`**: Es una librería que carga las variables de entorno desde un archivo llamado `.env` al objeto `process.env` de Node.js, para que puedas acceder a ellas en tu código.

### ¿Cómo Funciona?

#### Paso 1: Crear el archivo `.env`

En la raíz de tu proyecto, crea un archivo llamado `.env` (literalmente, solo `.env`). Este archivo **NO debe ser subido a repositorios públicos**, por lo que es una buena práctica añadirlo a tu archivo `.gitignore`.

Dentro de `.env`, defines tus variables con el formato `NOMBRE=VALOR`:

```
# .env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=secreto
```

#### Paso 2: Cargar las variables en la aplicación

En tu archivo de entrada (`index.js`), necesitas importar y configurar `dotenv` lo antes posible.

```javascript
import 'dotenv/config';
```

Esta línea, que ya estaba en tu `index.js` original, hace todo el trabajo. Lee el archivo `.env`, encuentra las variables y las hace accesibles a través de `process.env`.

#### Paso 3: Usar las variables en el código

Una vez cargadas, puedes acceder a estas variables en cualquier parte de tu aplicación a través del objeto global `process.env`.

En tu `index.js`:

```javascript
// Lee la variable PORT del archivo .env. Si no existe, usa 6972 como respaldo.
const PORT = process.env.PORT || 6972;

app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
```

Si tuvieras que conectarte a una base de datos, lo harías de esta forma:

```javascript
// const db_password = process.env.DB_PASS;
// const db_user = process.env.DB_USER;
```

De esta manera, tu código no contiene ninguna credencial, solo referencias a las variables de entorno, haciendo tu aplicación mucho más segura y portable.

---

## 7. Entendiendo NPM (Node Package Manager)

NPM es el gestor de paquetes de Node.js y una herramienta esencial en el desarrollo con Node. Es el corazón que gestiona todas las librerías de terceros (paquetes) que tu proyecto necesita, además de ayudarte a ejecutar tareas comunes.

### Roles Principales de NPM

1.  **Gestor de Dependencias**: NPM descarga y gestiona las librerías que tu proyecto utiliza (como `express`, `ejs`, `dotenv`).
2.  **Ejecutador de Tareas (Task Runner)**: NPM puede ejecutar scripts personalizados para tareas como iniciar el servidor, correr pruebas, etc.

### Archivos y Carpetas Clave de NPM

#### `package.json`

Es el manifiesto de tu proyecto. Contiene metadatos y, lo más importante, la lista de dependencias y scripts.

```json
{
  "name": "trainingejs",
  "version": "1.0.0",
  "description": "Un proyecto de ejemplo",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "dotenv": "^17.2.1",
    "ejs": "^3.1.10",
    "express": "^5.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
```

*   **`dependencies`**: Un objeto que lista los paquetes que la aplicación necesita para funcionar en producción. Cuando ejecutas `npm install`, NPM descarga todo lo que está aquí.
    *   Ejemplo: `express` es una dependencia porque el servidor no puede funcionar sin él.
*   **`devDependencies`**: Paquetes que solo se necesitan durante el desarrollo y las pruebas. No se instalan en un entorno de producción si se usa `npm install --production`.
    *   Ejemplo: `nodemon` es una `devDependency` clásica. Es muy útil en desarrollo porque reinicia el servidor automáticamente cuando detecta cambios en los archivos, pero no es necesario en producción.
*   **`scripts`**: Atajos para comandos de la terminal. Los ejecutas con `npm run <nombre-del-script>`.
    *   `npm run dev` ejecutaría `nodemon index.js`.
    *   Hay nombres especiales: `npm start` (ejecuta el script `start`) y `npm test` (ejecuta el script `test`) no necesitan la palabra `run`.

#### `package-lock.json`

Este archivo se genera automáticamente cada vez que modificas tus dependencias (ej. con `npm install`).

*   **Propósito**: Guarda la versión **exacta** de cada paquete que se instaló, incluyendo las dependencias de tus dependencias (el "árbol de dependencias" completo).
*   **Importancia**: Asegura que cada desarrollador del equipo y el servidor de producción instalen exactamente las mismas versiones de los paquetes, evitando el problema de "en mi máquina sí funciona". **Siempre debes incluir este archivo en tu control de versiones (Git)**.

#### `node_modules/`

Esta es la carpeta donde NPM descarga y almacena el código fuente de todas tus dependencias.

*   Puede llegar a ser muy grande.
*   **Nunca debes incluir esta carpeta en tu control de versiones**. El archivo `.gitignore` debe contener una línea que diga `node_modules/`. Cualquiera puede regenerar esta carpeta de forma idéntica usando los archivos `package.json` y `package-lock.json` y ejecutando `npm install`.

### Comandos Esenciales de NPM

*   **`npm init -y`**: Crea un nuevo archivo `package.json` con valores por defecto. Es el primer paso al iniciar un nuevo proyecto.

*   **`npm install`**: Lee `package.json` y `package-lock.json` e instala todas las dependencias (`dependencies` y `devDependencies`) en la carpeta `node_modules`.

*   **`npm install <nombre-paquete>`**: Instala un paquete y lo agrega automáticamente a la sección `dependencies` en `package.json`.
    *   Ejemplo: `npm install express`

*   **`npm install <nombre-paquete> --save-dev`** (o `-D`): Instala un paquete y lo agrega a `devDependencies`.
    *   Ejemplo: `npm install nodemon --save-dev`

*   **`npm uninstall <nombre-paquete>`**: Desinstala un paquete y lo elimina de `package.json` y `package-lock.json`.

*   **`npm run <script>`**: Ejecuta un script definido en la sección `scripts` de `package.json`.

*   **`npm start`**: Atajo para `npm run start`.

*   **`npm test`**: Atajo para `npm run test`.

---

## 8. Estructura de Carpetas del Proyecto

Entender cómo se organiza un proyecto es fundamental. Una buena estructura hace que el código sea más fácil de encontrar, mantener y escalar. Aquí tienes un diagrama de la estructura de este proyecto y una explicación de cada parte.

### Diagrama de Árbol

```
/TrainigEJS
│
├── 📄 .env                 # (Opcional) Variables de entorno (contraseñas, puertos)
├── 📄 .gitignore            # Archivos y carpetas que Git debe ignorar
├── 📄 index.js              # Punto de entrada: configuración y arranque del servidor
├── 📄 package.json          # Manifiesto del proyecto: dependencias y scripts
├── 📄 package-lock.json     # Versiones exactas de las dependencias
│
├── 📁 node_modules/         # (Generada por NPM) Código de las dependencias
│
├── 📁 public/                # Archivos accesibles directamente desde el navegador
│   ├── 📁 css/              # Hojas de estilo CSS
│   └── 📁 js/               # Scripts de JavaScript para el cliente
│
├── 📁 resources/            # Lógica de negocio o acceso a datos
│   └── 📄 data.mjs          # Simulación de base de datos en memoria
│
├── 📁 routes/               # Definición de las rutas (URLs) de la aplicación
│   └── 📄 index.mjs         # Enrutador principal
│
└── 📁 views/                # Plantillas HTML (lo que el usuario ve)
    ├── 📄 add-record.ejs    # Página con el formulario para añadir un registro
    ├── 📄 index.ejs         # Página principal que muestra la lista de datos
    └── 📁 templates/        # Fragmentos de plantillas reutilizables
        ├── 📄 footer.ejs    # Pie de página común
        └── 📄 header.ejs    # Cabecera común (metadatos, links a CSS)
```

### Explicación de cada Parte

*   **Archivos en la Raíz (`/`)
    *   `index.js`: El corazón de la aplicación. Inicia Express, aplica configuraciones (middlewares, motor de plantillas) y levanta el servidor.
    *   `package.json`: El "DNI" del proyecto. Le dice a NPM qué dependencias instalar y qué scripts están disponibles.
    *   `package-lock.json`: El "notario" de las dependencias. Asegura que siempre se instale la misma versión de cada paquete.
    *   `.gitignore`: Le dice al control de versiones (Git) qué ignorar. Lo más importante aquí es `node_modules/` y `.env`.
    *   `.env`: Almacena variables de configuración sensibles o específicas del entorno. No se comparte en el repositorio.

*   **`node_modules/`**
    *   Carpeta gestionada 100% por NPM. Contiene el código de `express`, `ejs`, `dotenv` y todas sus sub-dependencias. No la toques manualmente.

*   **`public/`**
    *   La única carpeta cuyo contenido es directamente accesible por el navegador. Aquí pones tus archivos CSS, JS de frontend, imágenes, fuentes, etc. Express sirve estos archivos estáticamente.

*   **`resources/`**
    *   Contiene la lógica de acceso a datos. En este proyecto, simula una base de datos con un simple array. En un proyecto real, aquí podrías tener los módulos que se conectan y consultan una base de datos como MySQL, MongoDB, etc.

*   **`routes/`**
    *   Define los "caminos" o URLs de tu aplicación. Cada archivo aquí suele agrupar rutas relacionadas (ej. `users.mjs`, `products.mjs`). Reciben la petición del usuario, interactúan con los `resources` si es necesario, y deciden qué `view` renderizar.

*   **`views/`**
    *   Contiene las plantillas de la interfaz de usuario. Son archivos "casi HTML" que EJS procesa en el servidor para insertar datos dinámicos antes de enviarlos al navegador del usuario. La separación en `templates` (o `partials`) es una práctica excelente para no repetir código (principio DRY: Don't Repeat Yourself).
