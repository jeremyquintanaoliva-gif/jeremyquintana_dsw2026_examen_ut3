# Respuestas del simulacro UT3

## 1. Prepara el proyecto

### Instalación y arranque

Para instalar las dependencias del proyecto, se ejecuta el siguiente comando desde la carpeta `simulacro`:

```bash
npm install
```

Para arrancar el servidor en modo desarrollo, se utiliza:

```bash
npm run dev
```

### Configuración del puerto

El puerto se configura en el archivo `src/config/env.ts`, mediante la variable de entorno `PORT`.

```ts
PORT: Number(process.env.PORT ?? 4000),
```

Si la variable `PORT` está definida en el archivo `.env`, se utiliza ese valor. Si no está definida, se utiliza el puerto 4000 por defecto.

En `src/server.ts` se importa el objeto `env` desde `src/config/env.ts` y se utiliza `env.PORT` en el método `app.listen()`.

De esta forma, el servidor escucha en el puerto configurado.

### Diferencia entre `.env` y `.env.example`

El archivo `.env` contiene la configuración de las variables de entorno del proyecto. Se excluye de GitHub mediante el `.gitignore` porque puede contener información privada o valores específicos de cada entorno.

El archivo `.env.example` se sube a GitHub porque sirve como plantilla y permite conocer qué variables necesita configurar el proyecto, sin incluir información privada.

## 3. Implementa un nuevo tipo de error

He creado la clase `ResourceNotFoundError`, que hereda de `Error` y contiene los campos `statusCode`, `code` y `resourceId`. Su nombre es `ResourceNotFoundError`.

El error se crea en `src/controllers/documentsController.ts`, dentro de la función `getById`, cuando el servicio no encuentra el documento solicitado. Se lanza una instancia de `ResourceNotFoundError` con estado 404, código `RESOURCE_NOT_FOUND` y el identificador del documento.

El error se propaga mediante `next(err)` hasta el middleware centralizado `src/middlewares/errorHandler.ts`.

En el `errorHandler`, se reconoce el tipo `ResourceNotFoundError` y se convierte en una respuesta HTTP 404 con los campos `message` y `resourceId`.

He comprobado el resultado en Bruno al consultar un documento inexistente. La respuesta obtenida es:

```json
{
  "message": "Document with id 'no-existe' not found",
  "resourceId": "no-existe"
}
```

También he comprobado que el error aparece registrado en la consola del servidor.

## 4. Validación directa del título

La validación del título se realiza directamente en el controlador, antes de llamar al servicio.

Si el título no es una cadena de texto válida o está vacío, se devuelve directamente un HTTP 400 con el código `INVALID_TITLE` y el mensaje correspondiente.

No se lanza una excepción ni se llama al servicio cuando el título es inválido. De esta forma, ningún campo del documento se modifica.

La diferencia con el apartado anterior es que el error de recurso no encontrado se lanza y se gestiona mediante el `errorHandler`, mientras que el error del título se responde directamente desde el controlador.

## 5. Configuración del logger mediante variable de entorno

La variable de entorno `LOG` controla si el middleware `logger` registra las peticiones.

- `LOG=ON`: el logger está habilitado.
- `LOG=OFF`: el logger no escribe sus mensajes.
- Si no se define `LOG`, su valor por defecto es `ON`.

Cuando el logger está desactivado, se ejecuta `next()` para que la petición continúe hacia las rutas y los siguientes middlewares. Por tanto, desactivar el logger no impide que el servidor responda.

Los registros del `errorHandler` se mantienen, ya que no dependen de la variable `LOG`.

Se ha comprobado que con `LOG=ON` aparece el registro de la petición y que con `LOG=OFF` la petición sigue respondiendo correctamente, pero el middleware `logger` no escribe sus mensajes. También se ha comprobado que el `errorHandler` continúa registrando los errores.

## 9. Investigación del comportamiento en producción

### Pruebas realizadas

Se ejecutó `GET /api/v1/notices` con el logger habilitado (`LOG=ON`), reiniciando el servidor tras cada cambio de `NODE_ENV`. Para el error inesperado se añadió temporalmente `throw new Error('Fallo interno de prueba');` al inicio de `list` en `noticesController.ts`, y se retiró al terminar.

#### 9.1 Desarrollo, petición correcta (`NODE_ENV=development`)

Respuesta:

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 339
ETag: W/"153-yweZnIMXu0b1xagGOPxy/zmcrhA"
Date: Wed, 25 Nov 2026 20:33:57 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"data":[{"id":"aviso-1","title":"Excursión de 2º DAW","description":"La excursión será el próximo viernes.","createdAt":"2026-11-20T08:00:00.000Z"},{"id":"aviso-2","title":"Examen de programación","description":"El examen se realizará el lunes.","createdAt":"2026-11-21T08:00:00.000Z"}],"pagination":{"page":1,"limit":2,"total":5}}
```

Log del servidor:

```
Listening on http://localhost:4000 (development)
{"requestId":"ac7f1efc-ac26-49d9-879f-4394f868c714","method":"GET","path":"/","status":200,"durationMs":5,"timestamp":"2026-11-25T20:33:57.436Z"}
```

#### 9.2 Desarrollo, error inesperado

Respuesta:

```
HTTP/1.1 500 Internal Server Error
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 62
ETag: W/"3e-mwnN6V9VW3HgLJDysrItbZu+HQE"
Date: Wed, 25 Nov 2026 20:50:17 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"INTERNAL_ERROR","message":"Fallo interno de prueba"}
```

Log del servidor:

```
{"requestId":"50ab5e83-2229-4d97-9ffd-34c33edd9b4a","error":"Fallo interno de prueba","stack":"Error: Fallo interno de prueba\n    at list (C:\\Users\\jerem\\Desktop\\jeremyquintana_dsw2026_examen_ut3\\simulacro\\src\\controllers\\noticesController.ts:9:11)\n    at Layer.handleRequest (C:\\Users\\jerem\\Desktop\\jeremyquintana_dsw2026_examen_ut3\\simulacro\\node_modules\\router\\lib\\layer.js:152:17)\n    at next (C:\\Users\\jerem\\Desktop\\jeremyquintana_dsw2026_examen_ut3\\simulacro\\node_modules\\router\\lib\\route.js:157:13)\n    at Route.dispatch (C:\\Users\\jerem\\Desktop\\jeremyquintana_dsw2026_examen_ut3\\simulacro\\node_modules\\router\\lib\\route.js:117:3)\n    at handle (C:\\Users\\jerem\\Desktop\\jeremyquintana_dsw2026_examen_ut3\\simulacro\\node_modules\\router\\index.js:435:11)\n    at Layer.handleRequest (C:\\Users\\jerem\\Desktop\\jeremyquintana_dsw2026_examen_ut3\\simulacro\\node_modules\\router\\lib\\layer.js:152:17)\n    at C:\\Users\\jerem\\Desktop\\jeremyquintana_dsw2026_examen_ut3\\simulacro\\node_modules\\router\\index.js:295:15\n    at processParams (C:\\Users\\jerem\\Desktop\\jeremyquintana_dsw2026_examen_ut3\\simulacro\\node_modules\\router\\index.js:582:12)\n    at next (C:\\Users\\jerem\\Desktop\\jeremyquintana_dsw2026_examen_ut3\\simulacro\\node_modules\\router\\index.js:291:5)\n    at router.handle (C:\\Users\\jerem\\Desktop\\jeremyquintana_dsw2026_examen_ut3\\simulacro\\node_modules\\router\\index.js:186:3)"}
{"requestId":"50ab5e83-2229-4d97-9ffd-34c33edd9b4a","method":"GET","path":"/api/v1/notices","status":500,"durationMs":7,"timestamp":"2026-11-25T20:50:17.290Z"}
```

Observación: las dos líneas del log comparten el mismo `requestId`. La primera la escribe `errorHandler` (incluye `stack`) y la segunda el logger, cuando se dispara el evento `finish` de la respuesta.

#### 9.3 Producción, petición correcta (`NODE_ENV=production`)

Respuesta:

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 339
ETag: W/"153-yweZnIMXu0b1xagGOPxy/zmcrhA"
Date: Wed, 25 Nov 2026 21:06:20 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"data":[{"id":"aviso-1","title":"Excursión de 2º DAW","description":"La excursión será el próximo viernes.","createdAt":"2026-11-20T08:00:00.000Z"},{"id":"aviso-2","title":"Examen de programación","description":"El examen se realizará el lunes.","createdAt":"2026-11-21T08:00:00.000Z"}],"pagination":{"page":1,"limit":2,"total":5}}
```

Log del servidor:

```
{"requestId":"8bfd017f-7c0a-4626-80ac-84b7e9ccd87e","method":"GET","path":"/","status":200,"durationMs":6,"timestamp":"2026-11-25T21:06:20.753Z"}
```

Observación: en producción la petición correcta se comporta igual que en desarrollo y el logger sigue escribiendo su línea.

#### 9.4 Producción, error inesperado

Respuesta:

```
HTTP/1.1 500 Internal Server Error
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 67
ETag: W/"43-aL12W+MD3OWAWa4rUhKdpFn+Ugw"
Date: Wed, 25 Nov 2026 21:04:21 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"INTERNAL_ERROR","message":"An unexpected error occurred"}
```

Log del servidor:

```
{"requestId":"274b1801-a854-4190-afb3-bc8f94231a57","error":"Fallo interno de prueba"}
{"requestId":"274b1801-a854-4190-afb3-bc8f94231a57","method":"GET","path":"/api/v1/notices","status":500,"durationMs":6,"timestamp":"2026-11-25T21:04:21.496Z"}
```

Observación: el cliente recibe un mensaje genérico, pero el log del servidor sigue registrando el mensaje real del error (`Fallo interno de prueba`), sin la traza `stack`. Así el desarrollador puede diagnosticar el fallo sin exponer detalles internos al cliente.

### Explicaciones

**¿Cambiar `NODE_ENV` desactiva automáticamente el logger?**

No. El logger se registra siempre con `app.use(logger)` y no consulta `NODE_ENV`. Lo único que lo desactiva es la variable `LOG`: su primera instrucción es `if (env.LOG === 'OFF') { next(); return; }`. En las pruebas 9.3 y 9.4 (producción) el logger siguió escribiendo una línea por petición, igual que en desarrollo.

**¿Qué diferencias observo en la respuesta al error inesperado?**

El estado HTTP (500) y el campo `error: "INTERNAL_ERROR"` son iguales en ambos modos. Cambia el campo `message`:

- En desarrollo: `"Fallo interno de prueba"`, es decir, el mensaje real de la excepción.
- En producción: `"An unexpected error occurred"`, un mensaje genérico que no revela detalles internos al cliente.

**¿Qué diferencias observo en los registros del manejador de errores?**

El `console.error` del `errorHandler` escribe un JSON con `requestId`, `error` y `stack`:

- En desarrollo incluye `stack` con la traza completa de la excepción.
- En producción `stack` vale `undefined`, y como `JSON.stringify` omite las propiedades `undefined`, el campo no aparece. Siguen apareciendo `requestId` y `error`.

La línea del logger (`requestId`, `method`, `path`, `status: 500`, `durationMs`, `timestamp`) es la misma en los dos modos, porque no depende de `NODE_ENV`. En el log aparecen dos líneas con el mismo `requestId` en este orden: primero la del `errorHandler`, cuando se procesa el error, y después la del logger, cuando la respuesta termina y se dispara el evento `finish`.

**¿Qué instrucciones de mi código explican esos resultados?**

- `env.ts`: `NODE_ENV: process.env.NODE_ENV ?? 'development'` lee el modo y usa `development` por defecto.
- `errorHandler.ts`: `const isProduction = env.NODE_ENV === 'production'` decide el modo.
- `errorHandler.ts`: `stack: isProduction ? undefined : err.stack` explica la diferencia en el registro.
- `errorHandler.ts`: `message: isProduction ? 'An unexpected error occurred' : err.message` explica la diferencia en la respuesta.
- `logger.ts`: `if (env.LOG === 'OFF')` explica por qué el logger no depende de `NODE_ENV`.
- `logger.ts`: `res.on('finish', ...)` explica por qué la línea del logger sale después de la del `errorHandler`.

## 10. Diagnóstico de dos fallos de middleware

### Primera prueba: `notFound` registrado antes de los routers

**Qué esperaba que sucediera:** esperaba que `notFound` solo respondiera a rutas inexistentes y que las rutas normales siguieran funcionando. No había tenido en cuenta que `notFound` no comprueba si una ruta existe, sino que responde a cualquier petición que llegue hasta él, y que el orden de registro decide qué peticiones llegan.

**Qué sucedió realmente:** la ruta `GET /api/v1/notices`, que normalmente funciona, dejó de llegar al router de avisos y respondió 404.

**Respuesta recibida:**

```
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 70
ETag: W/"46-vzFGSsoQNB8ZEmqFvGzGFGy5I/Q"
Date: Wed, 25 Nov 2026 21:22:05 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"NOT_FOUND","message":"Route not found: GET /api/v1/notices"}
```

Log del servidor:

```
{"requestId":"5efb5465-e700-493a-a98e-ab4e031dfc4b","method":"GET","path":"/api/v1/notices","status":404,"durationMs":5,"timestamp":"2026-11-25T21:22:05.249Z"}
```

**Qué parte del flujo lo explica:** Express evalúa los middlewares en el orden en que se registran con `app.use`. Con `notFound` antes de los routers, la petición pasa por `requestId`, `logger` y `express.json()` y llega a `notFound`. Este middleware no coincide con una ruta concreta, sino que atiende **cualquier** petición, y responde con `res.status(404).json(...)` sin llamar a `next()`. La petición termina ahí y nunca llega a `noticesRouter`. El logger sí registró la petición, porque está registrado antes y su evento `finish` se dispara igualmente con el 404.

**Cómo lo corregí:** moví `app.use(notFound)` de nuevo después de todos los routers y antes de `errorHandler`, de modo que solo responde a las peticiones que ningún router ha atendido.

**Comprobación tras corregir:** con `notFound` de nuevo después de los routers, la misma petición vuelve a responder con normalidad.

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 339
ETag: W/"153-yweZnIMXu0b1xagGOPxy/zmcrhA"
Date: Wed, 25 Nov 2026 21:26:01 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"data":[{"id":"aviso-1","title":"Excursión de 2º DAW","description":"La excursión será el próximo viernes.","createdAt":"2026-11-20T08:00:00.000Z"},{"id":"aviso-2","title":"Examen de programación","description":"El examen se realizará el lunes.","createdAt":"2026-11-21T08:00:00.000Z"}],"pagination":{"page":1,"limit":2,"total":5}}
```

### Segunda prueba: `logger` sin la llamada a `next()`

**Qué esperaba que sucediera:** esperaba que la petición no pudiera continuar hacia los routers y que el servidor no llegara a responder, dejando la petición esperando, porque el logger no cedería el control al siguiente middleware.

**Qué sucedió realmente:** la petición no recibió ninguna respuesta y quedó esperando hasta que `curl` abandonó por tiempo agotado. En la terminal del servidor no apareció ninguna línea de log.

**Respuesta recibida:** ninguna. La petición quedó colgada.

```
curl: (28) Operation timed out after 5001 milliseconds with 0 bytes received
```

Log del servidor:

```
Listening on http://localhost:4000 (development)
```

(No apareció ninguna línea nueva tras la petición.)

**Qué parte del flujo explica el resultado:** el logger está registrado antes de los routers. Sin `next()`, la petición no pasa al siguiente middleware: no llega a `express.json()`, ni a `noticesRouter`, ni a `notFound`, ni a `errorHandler`. Como nadie llama a `res.json()` ni a `res.send()`, la respuesta nunca se envía y el cliente se queda esperando. Tampoco se escribe el log, porque el callback registrado con `res.on('finish', ...)` solo se ejecuta cuando la respuesta termina, y aquí nunca termina. El logger no lanza ningún error: simplemente no cede el control, así que Express no tiene nada que gestionar.

**Cómo lo corregí:** restauré el `next();` al final de la función `logger`, después de registrar el listener de `finish`, para que la petición continúe hacia el resto de middlewares y rutas.

**Comprobación tras corregir:** con el `next();` restaurado en `logger.ts`, la petición vuelve a responder con normalidad.

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 339
ETag: W/"153-yweZnIMXu0b1xagGOPxy/zmcrhA"
Date: Wed, 25 Nov 2026 21:28:05 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"data":[{"id":"aviso-1","title":"Excursión de 2º DAW","description":"La excursión será el próximo viernes.","createdAt":"2026-11-20T08:00:00.000Z"},{"id":"aviso-2","title":"Examen de programación","description":"El examen se realizará el lunes.","createdAt":"2026-11-21T08:00:00.000Z"}],"pagination":{"page":1,"limit":2,"total":5}}
```

## 11. Recorrido de las peticiones

**Orden de registro en `app.ts`:** `requestId` → `logger` → `express.json()` → routers (`health`, `articles`, `documents`, `questions`, `notices`) → `notFound` → `errorHandler`.

**Entrada al logger y callback de `finish`:** el logger se ejecuta en dos momentos distintos. Al llegar la petición se ejecuta la función `logger`: guarda la hora de inicio, registra el listener `res.on('finish', ...)` y llama a `next()`. Todavía no escribe nada. Más tarde, cuando la respuesta ya se ha enviado, Express dispara `finish` y se ejecuta el callback, que calcula la duración y escribe la línea de log con el estado definitivo. Esto vale para los seis casos y por eso la línea del logger siempre es la **última** que se escribe en cada petición.

### Caso 1: consulta de un documento existente

`GET /api/v1/documents/11111111-1111-4111-8111-111111111111`

- **Intervienen:** `requestId` (asigna el identificador), `logger` (entrada), `express.json()` (no hay cuerpo, continúa), `documentsRouter` (coincide con `/:documentId`), `documentsController.getById` y `documentsService.getById`.
- **Se genera la respuesta en:** el controlador, con `res.json({ data: document })` (200).
- **`errorHandler`:** no se ejecuta. Después se dispara el callback de `finish` del logger y escribe `status: 200`.

### Caso 2: consulta de un documento inexistente

`GET /api/v1/documents/no-existe`

- **Intervienen:** los mismos hasta `documentsService.getById`, que devuelve `undefined`. El controlador lanza `ResourceNotFoundError`, el `catch` hace `next(err)`.
- **Se genera la respuesta en:** `errorHandler`, rama `err instanceof ResourceNotFoundError`: 404 con `error`, `message` y `resourceId`.
- **`errorHandler`:** sí se ejecuta. Escribe primero su `console.error` y después el logger escribe su línea con `status: 404`.

### Caso 3: petición a una URL que no existe

`GET /api/v1/otra-cosa`

- **Intervienen:** `requestId`, `logger` (entrada), `express.json()`, y ningún router coincide con la ruta, así que la petición llega a `notFound`.
- **Se genera la respuesta en:** `notFound`, con `res.status(404).json({ error: 'NOT_FOUND', ... })`.
- **`errorHandler`:** no se ejecuta, porque nadie ha llamado a `next(err)`. El logger registra `status: 404` en `finish`.

### Caso 4: creación de un aviso con JSON bien formado pero título inválido

`POST /api/v1/notices` con `{"title":"   "}`

- **Intervienen:** `requestId`, `logger` (entrada), `express.json()` (el JSON es válido y rellena `req.body`), `noticesRouter` y `noticesController.create`.
- **Qué ocurre:** el controlador comprueba el título, lanza `AppError(400, 'Invalid title', 'BAD_REQUEST')` y el `catch` hace `next(err)`. No llega a llamar al servicio.
- **Se genera la respuesta en:** `errorHandler`, rama `err instanceof AppError`: 400 con `error: "BAD_REQUEST"`.
- **`errorHandler`:** sí se ejecuta, y después el logger registra `status: 400`.

### Caso 5: petición con un cuerpo JSON mal formado

`POST /api/v1/notices` con `{"title": ` (JSON incompleto)

- **Intervienen:** `requestId`, `logger` (entrada) y `express.json()`. El middleware falla al interpretar el cuerpo y llama a `next(err)` con un `SyntaxError`. El router y el controlador **no llegan a ejecutarse**.
- **Se genera la respuesta en:** `errorHandler`, rama `err instanceof SyntaxError && 'body' in err`: 400 con `INVALID_JSON`.
- **`errorHandler`:** sí se ejecuta, y el logger registra `status: 400`.

### Caso 6: actualización de un documento con título vacío (respuesta directa del controlador)

`PATCH /api/v1/documents/11111111-1111-4111-8111-111111111111` con `{"title":""}`

- **Intervienen:** `requestId`, `logger` (entrada), `express.json()`, `documentsRouter` y `documentsController.update`.
- **Se genera la respuesta en:** el propio controlador, con `res.status(400).json({ error: 'INVALID_TITLE', ... })` seguido de `return`. No lanza ningún error ni llama a `next`.
- **`errorHandler`:** no se ejecuta. Es la diferencia con el caso 4: el mismo tipo de fallo (título inválido) se resuelve aquí sin pasar por el manejador centralizado. El callback de `finish` del logger escribe `status: 400`.

### Preguntas

**¿Por qué este `notFound` no llama a `next()`?**
Porque es el final de la cadena normal: llega hasta él una petición que ningún router ha atendido y él mismo envía la respuesta definitiva (404). Llamar a `next()` después de responder no tendría sentido: Express buscaría otro middleware, y la respuesta ya estaría enviada.

**Cuando un controlador llama a `next(err)`, ¿por qué no se ejecuta el `notFound` que está registrado a continuación?**
Cuando se llama a `next` con un argumento, Express entiende que hay un error y salta todos los middlewares normales (los de tres parámetros o menos) hasta encontrar un manejador de errores, que tiene cuatro. `notFound` tiene dos parámetros (`req`, `res`), así que se omite y la petición va directamente a `errorHandler`.

**¿Por qué el manejador de errores necesita cuatro parámetros aunque no use el último?**
Express distingue un manejador de errores de un middleware normal por el número de parámetros de la función (`err, req, res, next`). Con solo tres, Express lo trataría como un middleware normal y no le entregaría los errores. Por eso `_next` está declarado aunque no se use.

**¿Qué diferencia hay entre una ruta inexistente y un recurso inexistente?**
En una ruta inexistente no existe ningún handler para esa URL: la petición recorre todos los routers sin coincidir y acaba en `notFound` (`NOT_FOUND`, caso 3). En un recurso inexistente la ruta sí existe y el controlador se ejecuta, pero el servicio no encuentra el dato: el controlador lanza `ResourceNotFoundError` y responde `errorHandler` (`RESOURCE_NOT_FOUND` con `resourceId`, caso 2). En el primero falla el enrutado y en el segundo, la búsqueda de datos.

**¿Por qué el logger utiliza el evento `finish` para registrar el estado de la respuesta?**
Porque cuando el logger se ejecuta (antes de los routers) la respuesta todavía no existe y el código de estado aún no se ha decidido. Solo cuando la respuesta se ha enviado se conoce el `statusCode` final y se puede medir la duración total. El evento `finish` avisa exactamente de ese momento.

**¿Para qué sirve `requestId`?**
Para identificar de forma única cada petición y poder relacionar entre sí todas las líneas de log que genera. Como `requestId` se registra antes que todo lo demás, el identificador está disponible en el logger y en el `errorHandler`. Ejemplo real de mi prueba del punto 9 (petición con error inesperado en desarrollo): estas dos líneas se relacionan por el mismo `requestId`.

```
{"requestId":"50ab5e83-2229-4d97-9ffd-34c33edd9b4a","error":"Fallo interno de prueba","stack":"Error: Fallo interno de prueba\n    at list (...noticesController.ts:9:11) ..."}
{"requestId":"50ab5e83-2229-4d97-9ffd-34c33edd9b4a","method":"GET","path":"/api/v1/notices","status":500,"durationMs":7,"timestamp":"2026-11-25T20:50:17.290Z"}
```

La primera línea la escribe `errorHandler` (qué falló) y la segunda el logger (método, ruta, estado y duración). Sin el identificador, con varias peticiones simultáneas no se sabría a cuál pertenece cada error.

**¿Es obligatorio separar router, controlador y servicio para desarrollar con Express?**
No. Express permite escribir toda la lógica dentro de la función de cada ruta. La separación aporta orden y responsabilidades claras: el router asocia método y URL con una función, el controlador se ocupa de lo propio de HTTP (leer la petición, validar la entrada, elegir el código de estado) y el servicio contiene la lógica y el acceso a los datos sin depender de Express. Así el servicio se puede reutilizar y probar sin servidor, y un cambio (por ejemplo, pasar de un array en memoria a una base de datos) afecta solo al servicio.

**¿Qué ocurre con los avisos creados cuando reinicias el servidor? ¿Por qué?**
Se pierden. Los avisos se guardan en el array `notices` de `noticesService.ts`, que vive en la memoria del proceso de Node. Al reiniciar el servidor el proceso empieza de cero y el array vuelve a contener solo los cinco avisos iniciales escritos en el código. Para conservarlos haría falta guardarlos en un archivo o en una base de datos.
