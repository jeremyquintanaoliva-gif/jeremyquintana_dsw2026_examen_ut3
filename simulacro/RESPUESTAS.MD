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