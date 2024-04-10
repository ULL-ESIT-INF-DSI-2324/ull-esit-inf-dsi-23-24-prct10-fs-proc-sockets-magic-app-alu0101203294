# **Desarrollo de Sistemas Informáticos**

## Grado en Ingeniería Informática - Universidad de La Laguna

### Práctica 10  - Aplicación cliente-servidor para coleccionistas de cartas Magic

##### José Miguel Díaz González


<p align="center">
    <a href="https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-alu0101203294/actions/workflows/node.js.yml">
        <img alt="Test" src="https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-alu0101203294/actions/workflows/node.js.yml/badge.svg">
    </a>
    <a href="https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-alu0101203294">
        <img alt="Sonar Cloud" src="https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-alu0101203294&metric=alert_status">
    </a>
    <a href="https://coveralls.io/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-alu0101203294?branch=main">
        <img alt="Coverage Status" src="https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-alu0101203294/badge.svg?branch=main">
    </a>
</p>


# Gestor de Cartas de Magic con Cliente-Servidor

Esta práctica consiste en un gestor de cartas de Magic que permite a los usuarios administrar sus colecciones de cartas, incluyendo funciones para agregar nuevas cartas, actualizar cartas existentes, eliminar cartas y ver detalles de las cartas en la colección, implementando un servidor y un cliente haciendo uso de los sockets proporcionados por el módulo net de Node.js.  

## Enumeraciones

### Color

- `Blanco`
- `Azul`
- `Negro`
- `Rojo`
- `Verde`
- `Incoloro`
- `Multicolor`

### LineType

- `Tierra`
- `Criatura`
- `Encantamiento`
- `Conjuro`
- `Instantáneo`
- `Artefacto`
- `Planeswalker`

### Rarity

- `Comun`
- `Infrecuente`
- `Rara`
- `Mítica`

## Interfaces

### Card

Una interfaz que representa una carta Magic y contiene los siguientes atributos:

- `id`: Identificador de la carta.
- `name`: Nombre de la carta.
- `manaCost`: Costo de maná de la carta.
- `color`: Color de la carta (de la enumeración `Color`).
- `cardType`: Tipo de carta (de la enumeración `LineType`).
- `rarity`: Rareza de la carta (de la enumeración `Rarity`).
- `rulesText`: Texto de reglas de la carta.
- `strength` (opcional): Fuerza de la carta (para criaturas).
- `resistance` (opcional): Resistencia de la carta (para criaturas).
- `loyalty` (opcional): Lealtad de la carta (para planeswalkers).
- `marketPrice`: Precio de mercado de la carta.

## Clases

### FileManager

La clase `FileManager` se encarga de gestionar los archivos de las cartas. Proporciona los métodos para cargar, guardar y manipular las cartas en el sistema de archivos.

#### Constructor

- `constructor(username: string)`: El constructor de la clase inicializa una nueva instancia de `FileManager`. Toma un parámetro `username` que representa el nombre de usuario asociado con el gestor de archivos. Este constructor también establece el directorio de usuario en el sistema de archivos donde se almacenarán las cartas.

#### Métodos Públicos

- `getUserDir(): string`: Un método que retorna el directorio del usuario. Devuelve la ruta del directorio donde se almacenan las cartas del usuario.

- `getFilePath(cardId: number): string`: Un método que retorna la ruta de un archivo de carta dado su identificador (`cardId`). Devuelve la ruta completa al archivo correspondiente a la carta con el ID especificado.

- `load(): Map<number, Card>`: Un método que carga las cartas del usuario desde el sistema de archivos. Lee los archivos de las cartas en el directorio del usuario y devuelve un mapa que contiene las cartas cargadas, donde la clave es el ID de la carta y el valor es la carta misma.

- `save(collection: Map<number, Card>): void`: Un método que guarda las cartas del usuario en el sistema de archivos. Recibe un mapa que contiene las cartas a guardar, donde la clave es el ID de la carta y el valor es la carta misma. Guarda cada carta como un archivo en el directorio del usuario.

#### Métodos Privados

- `createDirectoryIfNotExists(): void`: Un método privado que crea el directorio del usuario si no existe. Verifica si el directorio del usuario existe en el sistema de archivos y lo crea si no está presente.

### CardCollection

La clase CardCollection se encarga de gestionar las colecciones de cartas de un usuario. Proporciona funciones para agregar, actualizar, eliminar y ver cartas en la colección.


- `constructor(user: string)`: El constructor de la clase inicializa una nueva instancia de `CardCollection`. Toma un parámetro `user` que representa el nombre de usuario asociado con la colección y carga las cartas del usuario existentes.

- `getColor(color: string): string`: Un método que toma un color como entrada y devuelve su código hexadecimal correspondiente. Sirve para formatear el color de la carta en las salidas de la colección.

- `loadc(): void`: Un método privado que carga las cartas del usuario desde el sistema de archivos. Estas cartas se almacenan en la propiedad `collection` de la clase.

- `addCard(newCard: Card): void`: Un método que agrega una nueva carta a la colección. Verifica si la carta ya existe en la colección antes de agregarla y gestiona casos donde el color de la carta no está.

- `updateCard(updatedCard: Card): void`: Un método que actualiza una carta existente en la colección. Reemplaza la carta existente con la carta actualizada y guarda los cambios en el sistema de archivos.

- `removeCard(cardId: number): void`: Un método que elimina una carta de la colección. Elimina el archivo correspondiente al ID de la carta y la elimina de la lista de cartas en memoria.

- `listCards(): void`: Un método que lista todas las cartas en la colección. Muestra los detalles de cada carta, incluyendo su ID, nombre, costo de maná, color, tipo, rareza, texto de reglas y precio de mercado. Además, muestra características adicionales como fuerza y resistencia para criaturas, o lealtad para planeswalkers.

- `readCard(cardId: number): void`: Un método que lee los detalles de una carta específica en la colección. Muestra los mismos detalles que `listCards()` pero solo para la carta con el ID proporcionado.

## Interfaz de línea de comandos (CLI) como Index

El proyecto incluye una interfaz de línea de comandos (CLI) para interactuar con las cartas de Magic. Los comandos disponibles son:

- `add`: Agrega una nueva carta a la colección.
- `list`: Lista todas las cartas en la colección.
- `update`: Actualiza una carta en la colección.
- `read`: Lee los detalles de una carta específica en la colección.
- `remove`: Elimina una carta de la colección.


## Cliente
Este código es una aplicación de línea de comandos (CLI) escrita en TypeScript que se comunica con un servidor a través de sockets TCP/IP. La aplicación permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en una colección de cartas Magic.

Inicialización de la conexión TCP/IP:

Se establece una conexión TCP/IP con el servidor utilizando net.createConnection(). Esto permite que la aplicación se comunique con el servidor a través del puerto especificado en la dirección IP del servidor.
Manejo de eventos:

La aplicación escucha eventos de datos ('data') y de cierre ('close') de la conexión. Cuando recibe datos del servidor, los procesa y muestra en la consola información relevante, como mensajes de estado o detalles de las cartas.
Procesamiento de argumentos de la línea de comandos:

La aplicación utiliza yargs para analizar los argumentos proporcionados en la línea de comandos al ejecutar la aplicación. Dependiendo de la operación especificada (añadir, actualizar, eliminar, listar, leer) y los datos proporcionados, se construye un objeto de solicitud que se enviará al servidor.
Envío de solicitudes al servidor:

Una vez analizados los argumentos de la línea de comandos y construido el objeto de solicitud, la aplicación lo envía al servidor a través de la conexión TCP/IP. El servidor procesará esta solicitud y realizará las operaciones correspondientes en la base de datos de cartas.    

## Servidor
Implementa un servidor TCP/IP que gestiona las solicitudes de los clientes relacionadas con la manipulación de una colección de cartas de juego.

Creación y configuración del servidor:

Se crea un servidor utilizando net.createServer(), que escuchará las conexiones entrantes en el puerto especificado (PORT). Este servidor estará a la espera de las conexiones de los clientes.
Manejo de eventos del socket:

Cuando un cliente se conecta al servidor, se activa el evento 'connection' y se imprime un mensaje indicando que el cliente se ha conectado.
Se establece un manejador de eventos para el evento 'data', que se activa cuando el servidor recibe datos del cliente. Los datos recibidos se interpretan como solicitudes del cliente y se procesan en consecuencia.
Procesamiento de solicitudes:

Las solicitudes recibidas se analizan y se ejecutan las operaciones correspondientes en la colección de cartas, como añadir, actualizar, eliminar, listar o leer cartas. Se utilizan estructuras de control switch para manejar diferentes tipos de operaciones.
Cada operación implica interactuar con la colección de cartas (CardCollection), que está representada por una clase en el módulo cardmanager.js.
Envío de respuestas al cliente:

Después de procesar una solicitud, el servidor envía una respuesta al cliente a través del mismo socket que recibió la solicitud. La respuesta puede incluir mensajes de estado, detalles de las cartas o errores.
La función sendResponse() se utiliza para enviar la respuesta al cliente. Los datos de respuesta se convierten en formato JSON antes de ser enviados al cliente.
Cierre de conexión:

Una vez que se ha completado una solicitud y se ha enviado la respuesta correspondiente, se cierra la conexión con el cliente utilizando socket.end().

## Uso

Para usar la interfaz de línea de comandos, ejecutar:

### **En el servidor**
**Iniciar servidor**
```bash
node dist/cliente-servidor/servidor.js
```
----

### **En el cliente**
**Añadir carta:**
```bash
node dist/Magic/index.js add --user= <nombre_usuario> --id= <id_carta> --name= <nombre_carta> --manaCost= <costo_mana> --color= <color_carta> --lineType= <tipo_carta> --rarity= <rareza_carta> --rulesText= <texto_reglas> --marketPrice <precio_mercado>
```
**Actualizar carta:**
```bash
node dist/Magic/index.js update --user= <nombre_usuario> --id= <id_carta> --name= <nombre_carta> --manaCost= <costo_mana> --color= <color_carta> --lineType= <tipo_carta> --rarity= <rareza_carta> --rulesText= <texto_reglas> --marketPrice <precio_mercado>
```
**Eliminar carta**
```bash
node dist/Magic/index.js remove --user= <nombre_usuario> --id= <id_carta>
```
**Listar todas las cartas de un usuario**
```bash
node dist/Magic/index.js list --user= <nombre_usuario>
```
**Mostrar una carta de un usuario**
```bash
node dist/Magic/index.js read --user= <nombre_usuario> --id= <id_carta>
```

# Modificación
En modificación se pied dos funciones de la práctica 9 para que utilicen funciones asíncronas con callbacks. Por lo que se ha de reimplementar los metodos de dicha práctica para que se sustituyan en los mismos la invocación de métodos del API síncrona de Node.js de gestión el sistema de ficheros, por llamadas a los métodos equivalentes del API asíncrona basada en callbacks. Los archivos modificados se encuentran en la carpeta designada para esta modificación.



## Conclusiones

La aplicación proporciona una solución eficiente y práctica para la gestión de colecciones de cartas mágicas. Su diseño de datos garantiza la integridad de la colección, mientras que la lógica de la aplicación la hace extensible. Se han utilizado diversas herramientas y técnicas de desarrollo de software para TypeScript, como yargs y Chalk, lo que ha permitido crear un sistema robusto y fácil de usar y visualmente bonito. Además, el manejo del API de Node.js para la manipulación de archivos ha sido muy importante en la implementación de la funcionalidad de persistencia de datos. Ha habido un progreso importante en el manejo de TypeScript y en la comprensión de los conceptos relacionados con el desarrollo de aplicaciones CLI, lo que proporciona una base muy importante para futuros proyectos.


---

[Enlace al Guion](https://ull-esit-inf-dsi-2324.github.io/prct10-fs-proc-sockets-magic-app/)

[Enlace al Informe](https://ull-esit-inf-dsi-2324.github.io/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-alu0101203294/)

---

#### Referencias

- [yargs](https://yargs.js.org/)
- [chalk](https://www.npmjs.com/package/chalk)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Node.js API](https://nodejs.org/docs/latest/api/)

