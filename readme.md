# LAB - HospitalSoft: Requisitos y Herramientas de Calidad de Software

## Semana 6 - Herramientas y requisitos de calidad de software

Este proyecto presenta una API REST sencilla para la gestión de citas médicas y se utiliza como laboratorio para aplicar conceptos relacionados con:

- requisitos de calidad;
- criterios de aceptación;
- análisis estático;
- pruebas automatizadas;
- pruebas de API;
- análisis de dependencias;
- métricas;
- mediciones;
- evidencias;
- toma de decisiones sobre la calidad del software.

---

# 1. Objetivo del laboratorio

Construir y evaluar una API REST sencilla utilizando diferentes herramientas de calidad de software.

El laboratorio busca comprender la siguiente relación:

```text
NECESIDAD
    ↓
ATRIBUTO DE CALIDAD
    ↓
REQUISITO
    ↓
CRITERIO DE ACEPTACIÓN
    ↓
HERRAMIENTA
    ↓
MEDICIÓN
    ↓
EVIDENCIA
    ↓
DECISIÓN
```

La idea principal es comprender que:

> Que un software funcione no significa automáticamente que podamos afirmar que tiene calidad.

Para evaluar la calidad necesitamos establecer requisitos verificables y obtener evidencia mediante herramientas apropiadas.

---

# 2. Tecnologías utilizadas

| Tecnología / herramienta | Propósito |
|---|---|
| Node.js | Entorno de ejecución |
| JavaScript | Lenguaje de programación |
| Express | Desarrollo de la API REST |
| ES Modules | Sistema de módulos `import/export` |
| Nodemon | Reinicio automático durante desarrollo |
| ESLint | Análisis estático del código |
| Globals | Definición de variables globales para ESLint |
| Jest | Ejecución de pruebas automatizadas |
| Supertest | Pruebas HTTP sobre la API |
| cross-env | Variables de entorno compatibles entre sistemas |
| npm audit | Análisis de vulnerabilidades conocidas en dependencias |

---

# 3. Estructura del proyecto

```text
hospitalsoft-calidad/
│
├── tests/
│   └── citas.test.js
│
├── node_modules/
│
├── .gitignore
├── app.js
├── eslint.config.js
├── jest.config.js
├── package.json
├── package-lock.json
└── README.md
```

---

# 4. Crear el proyecto desde cero

Crear la carpeta:

```bash
mkdir hospitalsoft-calidad
```

Ingresar al proyecto:

```bash
cd hospitalsoft-calidad
```

Inicializar Node.js:

```bash
npm init -y
```

---

# 5. Instalar Express

```bash
npm install express
```

Express será utilizado para construir la API REST.

---

# 6. Instalar Nodemon

```bash
npm install -D nodemon
```

Nodemon permite reiniciar automáticamente el servidor cuando detecta cambios en los archivos.

---

# 7. Configurar ES Modules

En `package.json` agregar:

```json
"type": "module"
```

Esto permite utilizar:

```javascript
import express from "express";
```

en lugar de CommonJS:

```javascript
const express = require("express");
```

---

# 8. Crear `.gitignore`

Crear el archivo:

```text
.gitignore
```

Contenido:

```text
node_modules/
.env
coverage/
```

Esto evita subir al repositorio archivos que no deben ser versionados.

---

# 9. Crear la API

Crear:

```text
app.js
```

Contenido:

```javascript
// ========================================
// Importaciones
// ========================================

import express from "express";

// ========================================
// Configuración
// ========================================

const app = express();

const PORT = 3000;

// ========================================
// Middlewares
// ========================================

app.use(express.json());

// ========================================
// Datos locales
// ========================================

const citas = [
  {
    id: 1,
    paciente: "Laura Gómez",
    medico: "Dr. Carlos Díaz",
    fecha: "2026-10-10",
    hora: "08:00",
  },
  {
    id: 2,
    paciente: "Pedro Ruiz",
    medico: "Dra. Ana Torres",
    fecha: "2026-10-10",
    hora: "09:00",
  },
];

// ========================================
// Ruta principal
// ========================================

app.get("/", (req, res) => {
  res.status(200).json({
    mensaje: "HospitalSoft - Calidad de Software",
  });
});

// ========================================
// Consultar todas las citas
// ========================================

app.get("/api/citas", (req, res) => {
  res.status(200).json(citas);
});

// ========================================
// Consultar cita por ID
// ========================================

app.get("/api/citas/:id", (req, res) => {
  const id = Number(req.params.id);

  const cita = citas.find((item) => item.id === id);

  if (!cita) {
    return res.status(404).json({
      mensaje: "Cita no encontrada",
    });
  }

  return res.status(200).json(cita);
});

// ========================================
// Crear cita
// ========================================

app.post("/api/citas", (req, res) => {
  const { paciente, medico, fecha, hora } = req.body;

  // Validar campos obligatorios
  if (!paciente || !medico || !fecha || !hora) {
    return res.status(400).json({
      mensaje: "Paciente, médico, fecha y hora son obligatorios",
    });
  }

  // Verificar conflicto de horario
  const existeCita = citas.some(
    (cita) =>
      cita.medico === medico &&
      cita.fecha === fecha &&
      cita.hora === hora
  );

  if (existeCita) {
    return res.status(409).json({
      mensaje: "El médico ya tiene una cita en ese horario",
    });
  }

  const nuevaCita = {
    id: citas.length + 1,
    paciente,
    medico,
    fecha,
    hora,
  };

  citas.push(nuevaCita);

  return res.status(201).json({
    mensaje: "Cita creada correctamente",
    cita: nuevaCita,
  });
});

// ========================================
// Eliminar cita
// ========================================

app.delete("/api/citas/:id", (req, res) => {
  const id = Number(req.params.id);

  const indice = citas.findIndex((item) => item.id === id);

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Cita no encontrada",
    });
  }

  citas.splice(indice, 1);

  return res.status(204).send();
});

// ========================================
// Iniciar servidor
// ========================================

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(
      `HospitalSoft ejecutándose en http://localhost:${PORT}`
    );
  });
}

// ========================================
// Exportar aplicación para las pruebas
// ========================================

export default app;
```

---

# 10. ¿Por qué exportamos `app`?

Al final encontramos:

```javascript
export default app;
```

Esto permite que Supertest pueda importar nuestra aplicación:

```javascript
import app from "../app.js";
```

y realizar solicitudes HTTP durante las pruebas.

También utilizamos:

```javascript
if (process.env.NODE_ENV !== "test") {
```

para evitar que Express abra el puerto `3000` cuando Jest está ejecutando las pruebas.

El comportamiento es:

```text
npm run dev
      ↓
NODE_ENV diferente de test
      ↓
app.listen()
      ↓
Servidor iniciado


npm test
      ↓
NODE_ENV = test
      ↓
NO ejecuta app.listen()
      ↓
Supertest utiliza app directamente
```

---

# 11. Configurar los scripts iniciales

En `package.json`:

```json
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

---

# 12. Ejecutar HospitalSoft

Ejecutar:

```bash
npm run dev
```

Resultado esperado:

```text
HospitalSoft ejecutándose en http://localhost:3000
```

---

# 13. Endpoints disponibles

| Método | Endpoint | Descripción | Resultado esperado |
|---|---|---|---|
| GET | `/` | Información del proyecto | `200` |
| GET | `/api/citas` | Listar citas | `200` |
| GET | `/api/citas/:id` | Buscar cita | `200` / `404` |
| POST | `/api/citas` | Crear cita | `201` |
| POST | `/api/citas` | Datos incompletos | `400` |
| POST | `/api/citas` | Horario ocupado | `409` |
| DELETE | `/api/citas/:id` | Eliminar cita | `204` / `404` |

---

# 14. Pruebas manuales

Antes de automatizar las pruebas podemos comprobar el comportamiento utilizando Postman.

## Crear una cita correctamente

Método:

```text
POST
```

Endpoint:

```text
http://localhost:3000/api/citas
```

Body:

```json
{
  "paciente": "Ana López",
  "medico": "Dr. Carlos Díaz",
  "fecha": "2026-10-11",
  "hora": "10:00"
}
```

Resultado esperado:

```text
201 Created
```

---

## Datos incompletos

Enviar:

```json
{
  "paciente": "Ana López"
}
```

Resultado esperado:

```text
400 Bad Request
```

---

## Conflicto de horario

Existe inicialmente:

```text
Dr. Carlos Díaz
2026-10-10
08:00
```

Intentar crear:

```json
{
  "paciente": "Nuevo Paciente",
  "medico": "Dr. Carlos Díaz",
  "fecha": "2026-10-10",
  "hora": "08:00"
}
```

Resultado esperado:

```text
409 Conflict
```

El código `409` indica que la solicitud entra en conflicto con el estado actual del recurso.

---

# 15. Requisitos de calidad

Antes de seleccionar una herramienta debemos establecer qué queremos comprobar.

| ID | Atributo | Requisito | Criterio de aceptación |
|---|---|---|---|
| RQ-01 | Adecuación funcional | No crear citas con datos obligatorios ausentes | Solicitud incompleta → `400` |
| RQ-02 | Fiabilidad | No permitir dos citas para el mismo médico, fecha y hora | Segunda reserva → `409` |
| RQ-03 | Adecuación funcional | Permitir consultar citas existentes | Consulta válida → `200` |
| RQ-04 | Mantenibilidad | El código debe cumplir las reglas estáticas definidas | ESLint → `0 errores` |
| RQ-05 | Seguridad / mantenimiento | Las dependencias deben ser analizadas para identificar vulnerabilidades conocidas | Revisar reporte de `npm audit` |

---

# 16. Herramienta 1 - ESLint

ESLint será utilizado para realizar análisis estático del código.

Instalar:

```bash
npm install -D eslint
```

También instalamos:

```bash
npm install -D globals
```

El paquete `globals` permite declarar a ESLint las variables globales disponibles en diferentes entornos.

---

# 17. Configurar ESLint

Crear:

```text
eslint.config.js
```

Contenido:

```javascript
import globals from "globals";

export default [
  // ========================================
  // Configuración general del proyecto
  // ========================================
  {
    files: ["**/*.js"],

    ignores: [
      "node_modules/**",
      "coverage/**",
    ],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      globals: {
        ...globals.node,
      },
    },

    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      "eqeqeq": "error",
      "no-console": "off",
    },
  },

  // ========================================
  // Configuración específica para Jest
  // ========================================
  {
    files: [
      "tests/**/*.js",
      "**/*.test.js",
    ],

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
];
```

---

# 18. ¿Por qué necesitamos `globals.node`?

Nuestro `app.js` utiliza elementos como:

```javascript
process.env.NODE_ENV
```

y:

```javascript
console.log()
```

Estos elementos existen en el entorno Node.js.

Si ESLint no conoce el entorno, puede reportar:

```text
'process' is not defined
'console' is not defined
```

Por esta razón configuramos:

```javascript
globals: {
  ...globals.node,
}
```

---

# 19. ¿Por qué necesitamos `globals.jest`?

Los archivos de pruebas utilizan:

```javascript
describe()
test()
expect()
```

Estas funciones son proporcionadas por Jest.

Sin configurar el entorno, ESLint puede reportar:

```text
'describe' is not defined
'test' is not defined
'expect' is not defined
```

Por eso configuramos específicamente los archivos de pruebas:

```javascript
{
  files: [
    "tests/**/*.js",
    "**/*.test.js",
  ],

  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.jest,
    },
  },
}
```

De esta manera:

```text
app.js
   ↓
Node.js
   ↓
globals.node


tests/*.test.js
   ↓
Node.js + Jest
   ↓
globals.node
+
globals.jest
```

---

# 20. Ejecutar ESLint

Agregar al `package.json`:

```json
"quality": "eslint ."
```

Ejecutar:

```bash
npm run quality
```

Si no se presentan errores, ESLint termina y regresa al prompt.

Para este laboratorio establecemos:

```text
MÉTRICA
Número de errores ESLint

       ↓

CRITERIO
0 errores
```

---

# 21. Provocar un hallazgo con ESLint

Para comprobar el funcionamiento de la herramienta, agregar temporalmente en `app.js`:

```javascript
const variableQueNoUso = "prueba";
```

Ejecutar:

```bash
npm run quality
```

ESLint deberá detectar que la variable fue declarada pero nunca utilizada.

Interpretación:

```text
MÉTRICA
Número de errores
      ↓
MEDICIÓN
1
      ↓
UMBRAL
0
      ↓
1 > 0
      ↓
NO CUMPLE
```

Eliminar posteriormente:

```javascript
const variableQueNoUso = "prueba";
```

y ejecutar nuevamente:

```bash
npm run quality
```

Resultado:

```text
ANTES                   DESPUÉS

1 error                 0 errores
   ↓                        ↓
NO CUMPLE                CUMPLE
```

---

# 22. Herramienta 2 - Jest + Supertest

Instalar:

```bash
npm install -D jest supertest
```

Jest y Supertest cumplen funciones diferentes:

| Herramienta | Función |
|---|---|
| Jest | Organiza, ejecuta y evalúa pruebas |
| Supertest | Realiza solicitudes HTTP a la aplicación |

La relación es:

```text
JEST
gestiona la prueba
       +
SUPERTEST
realiza la petición HTTP
       ↓
HOSPITALSOFT
       ↓
RESPUESTA
       ↓
JEST
compara esperado vs obtenido
       ↓
PASS / FAIL
```

---

# 23. Instalar cross-env

Instalar:

```bash
npm install -D cross-env
```

`cross-env` permite establecer variables de entorno de forma compatible entre diferentes sistemas operativos.

Lo utilizaremos para establecer:

```text
NODE_ENV=test
```

durante las pruebas.

---

# 24. Configurar Jest para ES Modules

Nuestro proyecto utiliza:

```json
"type": "module"
```

Por tanto utiliza:

```javascript
import
```

y:

```javascript
export
```

Para ejecutar Jest manteniendo ES Modules configuramos el script:

```json
"test": "cross-env NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules jest --runInBand"
```

---

# 25. Crear `jest.config.js`

Crear en la raíz:

```text
jest.config.js
```

Contenido:

```javascript
export default {
  testEnvironment: "node",
  transform: {},
};
```

La configuración indica que las pruebas se ejecutan en un entorno Node.js y que no estamos utilizando una transformación adicional mediante Babel.

---

# 26. Crear las pruebas

Crear:

```text
tests/citas.test.js
```

Contenido:

```javascript
import request from "supertest";
import app from "../app.js";

describe("API HospitalSoft - Citas", () => {

  // ======================================
  // GET /api/citas
  // ======================================

  test("GET /api/citas debe responder 200", async () => {
    const response = await request(app)
      .get("/api/citas");

    expect(response.statusCode).toBe(200);
  });

  // ======================================
  // GET /api/citas/:id
  // ======================================

  test("GET /api/citas/1 debe encontrar la cita", async () => {
    const response = await request(app)
      .get("/api/citas/1");

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(1);
  });

  // ======================================
  // Cita inexistente
  // ======================================

  test("GET de cita inexistente debe responder 404", async () => {
    const response = await request(app)
      .get("/api/citas/999");

    expect(response.statusCode).toBe(404);
  });

  // ======================================
  // Datos incompletos
  // ======================================

  test("POST incompleto debe responder 400", async () => {
    const response = await request(app)
      .post("/api/citas")
      .send({
        paciente: "Ana López",
      });

    expect(response.statusCode).toBe(400);
  });

  // ======================================
  // Conflicto de horario
  // ======================================

  test("POST duplicado debe responder 409", async () => {
    const response = await request(app)
      .post("/api/citas")
      .send({
        paciente: "Nuevo Paciente",
        medico: "Dr. Carlos Díaz",
        fecha: "2026-10-10",
        hora: "08:00",
      });

    expect(response.statusCode).toBe(409);
  });

  // ======================================
  // Crear cita correctamente
  // ======================================

  test("POST correcto debe responder 201", async () => {
    const response = await request(app)
      .post("/api/citas")
      .send({
        paciente: "María Rodríguez",
        medico: "Dr. Felipe Gómez",
        fecha: "2026-10-15",
        hora: "11:00",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.cita).toHaveProperty("id");
  });

});
```

---

# 27. Ejecutar las pruebas automatizadas

Ejecutar:

```bash
npm test
```

Si todo funciona correctamente debemos obtener un resultado equivalente a:

```text
PASS tests/citas.test.js

✓ GET /api/citas debe responder 200
✓ GET /api/citas/1 debe encontrar la cita
✓ GET de cita inexistente debe responder 404
✓ POST incompleto debe responder 400
✓ POST duplicado debe responder 409
✓ POST correcto debe responder 201

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
```

El número exacto y formato pueden variar según la versión utilizada.

---

# 28. Interpretar una prueba

Por ejemplo:

```javascript
const response = await request(app)
  .get("/api/citas");
```

Supertest realiza:

```text
GET /api/citas
```

Posteriormente:

```javascript
expect(response.statusCode).toBe(200);
```

Jest compara:

```text
ESPERADO
200

   ↕

OBTENIDO
200

   ↓

PASS
```

---

# 29. Provocar una prueba fallida

Para observar un incumplimiento real, modificar temporalmente en `app.js`:

```javascript
return res.status(409).json({
```

por:

```javascript
return res.status(400).json({
```

Ejecutar:

```bash
npm test
```

La prueba:

```javascript
expect(response.statusCode).toBe(409);
```

deberá fallar.

Interpretación:

```text
REQUISITO
Una cita duplicada debe rechazarse

       ↓

CRITERIO
HTTP 409

       ↓

ESPERADO
409

       ↓

OBTENIDO
400

       ↓

FAIL

       ↓

NO CUMPLE
```

Restaurar posteriormente:

```javascript
return res.status(409).json({
```

y ejecutar:

```bash
npm test
```

La prueba debe volver a:

```text
PASS
```

---

# 30. Herramienta 3 - npm audit

npm incluye una herramienta para analizar vulnerabilidades conocidas asociadas a las dependencias instaladas.

Ejecutar:

```bash
npm audit
```

El resultado dependerá de las versiones instaladas.

Por ejemplo, podría indicar:

```text
found 0 vulnerabilities
```

o presentar uno o varios hallazgos.

El resultado real obtenido debe registrarse como evidencia.

No debemos asumir que siempre obtendremos cero vulnerabilidades.

---

# 31. Interpretación de las herramientas

No todas las herramientas observan lo mismo.

| Herramienta | ¿Qué analiza? | Evidencia |
|---|---|---|
| ESLint | Código fuente | Errores / advertencias |
| Jest | Resultados esperados | PASS / FAIL |
| Supertest | Comportamiento HTTP de la API | Respuestas HTTP |
| npm audit | Dependencias instaladas | Reporte de vulnerabilidades |

Por ejemplo:

```text
ESLint = 0 errores
```

NO significa automáticamente:

```text
API segura
API rápida
API sin defectos
API completamente funcional
```

Solamente constituye evidencia respecto de las reglas que ESLint fue configurado para analizar.

---

# 32. Diferenciar defecto y problema de configuración

Durante el laboratorio pueden aparecer resultados como:

```text
'process' is not defined
```

o:

```text
'describe' is not defined
'test' is not defined
'expect' is not defined
```

Esto no significa automáticamente que HospitalSoft tenga un defecto funcional.

Puede existir un problema en la configuración de la herramienta.

Por ejemplo:

```text
ESLint
   ↓
reporta describe/test/expect
como no definidos
   ↓
analizamos
   ↓
son globales proporcionados por Jest
   ↓
configuramos globals.jest
   ↓
ejecutamos nuevamente
```

También puede ocurrir:

```text
Must use import to load ES Module
```

Esto indica un problema de configuración entre Jest y el uso de ES Modules.

Por tanto:

```text
HERRAMIENTA REPORTA ALGO
          ↓
INTERPRETAMOS EL HALLAZGO
          ↓
¿DEFECTO DEL SOFTWARE?
¿CONFIGURACIÓN?
¿HALLAZGO NO APLICABLE?
          ↓
TOMAMOS UNA DECISIÓN
```

---

# 33. Ejecutar todos los controles

Agregar al `package.json`:

```json
"check": "npm run quality && npm test && npm audit"
```

Ejecutar:

```bash
npm run check
```

La secuencia será:

```text
npm run check
      ↓
ESLint
      ↓
¿CUMPLE?
      ↓
Jest + Supertest
      ↓
¿CUMPLE?
      ↓
npm audit
      ↓
REPORTE
      ↓
EVIDENCIAS DE CALIDAD
```

El operador:

```text
&&
```

hace que el siguiente comando se ejecute solamente si el anterior finaliza correctamente.

---

# 34. `package.json` actual

El proyecto utilizado durante este laboratorio contiene:

```json
{
  "name": "hospitalsoft-calidad",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "quality": "eslint .",
    "test": "cross-env NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules jest --runInBand",
    "check": "npm run quality && npm test && npm audit"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "express": "^5.2.1"
  },
  "devDependencies": {
    "cross-env": "^10.1.0",
    "eslint": "^10.0.0",
    "globals": "^17.13.0",
    "jest": "^30.5.2",
    "nodemon": "^3.1.14",
    "supertest": "^7.3.1"
  }
}
```

> Las versiones pueden cambiar si el proyecto se instala nuevamente en otro momento. Se recomienda utilizar los comandos `npm install` indicados en el laboratorio y conservar el `package-lock.json`.

---

# 35. Scripts disponibles

| Comando | Función |
|---|---|
| `npm run dev` | Ejecutar servidor con Nodemon |
| `npm start` | Ejecutar servidor con Node |
| `npm run quality` | Ejecutar ESLint |
| `npm test` | Ejecutar Jest + Supertest |
| `npm audit` | Analizar dependencias |
| `npm run check` | Ejecutar controles de calidad |

---

# 36. Instalación rápida para un proyecto ya descargado

Si el proyecto ya contiene:

```text
package.json
package-lock.json
```

no es necesario instalar cada dependencia manualmente.

Ejecutar:

```bash
npm install
```

Luego:

```bash
npm run quality
```

Después:

```bash
npm test
```

Y finalmente:

```bash
npm audit
```

O ejecutar todo mediante:

```bash
npm run check
```

---

# 37. Matriz de requisitos, herramientas y evidencias

| Requisito | Criterio | Herramienta | Evidencia | Decisión |
|---|---|---|---|---|
| RQ-01 Datos obligatorios | POST incompleto → 400 | Jest + Supertest | PASS / FAIL | Cumple / No cumple |
| RQ-02 Evitar citas duplicadas | Segunda reserva → 409 | Jest + Supertest | PASS / FAIL | Cumple / No cumple |
| RQ-03 Consultar citas | GET → 200 | Jest + Supertest | PASS / FAIL | Cumple / No cumple |
| RQ-04 Reglas estáticas | 0 errores | ESLint | Nº de errores | Cumple / No cumple |
| RQ-05 Revisar dependencias | Analizar hallazgos | npm audit | Reporte | Analizar |

---

# 38. Registro de evidencias

Después de ejecutar el laboratorio, completar:

| Herramienta | Medición obtenida | Criterio | Resultado |
|---|---:|---|---|
| ESLint | _____ errores | 0 errores | _____ |
| Jest | _____ / 6 pruebas | 6/6 | _____ |
| npm audit | _____ vulnerabilidades | Analizar reporte | _____ |

---

# 39. Actividad de análisis

A partir de los resultados obtenidos responda:

1. ¿Qué diferencia existe entre un requisito de calidad y un criterio de aceptación?

2. ¿Qué atributo de calidad se relaciona con cada requisito definido?

3. ¿Qué evidencia proporciona ESLint?

4. ¿Qué diferencia existe entre Jest y Supertest?

5. ¿Por qué obtener `0 errores` en ESLint no demuestra que todo el sistema tenga calidad?

6. ¿Qué significa que una prueba obtenga `PASS`?

7. ¿Qué significa que una prueba obtenga `FAIL`?

8. ¿Qué ocurre si esperábamos `409` y obtenemos `400`?

9. ¿Un hallazgo de una herramienta representa siempre un defecto del software?

10. ¿Por qué debemos definir primero el requisito y después seleccionar la herramienta?

---

# 40. Flujo general del laboratorio

```text
HOSPITALSOFT
     ↓
IDENTIFICAMOS
QUÉ QUEREMOS EVALUAR
     ↓
ATRIBUTO DE CALIDAD
     ↓
REQUISITO
     ↓
CRITERIO DE ACEPTACIÓN
     ↓
SELECCIONAMOS HERRAMIENTA
     ↓
┌───────────────────────────────┐
│                               │
↓               ↓               ↓
ESLint      Jest + Supertest   npm audit
↓               ↓               ↓
Código       API / pruebas    Dependencias
│               │               │
└───────────────┼───────────────┘
                ↓
             EVIDENCIA
                ↓
          ¿CUMPLE CRITERIO?
             ↙       ↘
           SÍ         NO
           ↓           ↓
       MANTENER      MEJORAR
           ↘           ↙
          MEJORA CONTINUA
```

---

# 41. Conclusión

Una herramienta de calidad no determina por sí sola si un sistema tiene calidad.

Primero debemos establecer:

```text
QUÉ QUEREMOS EVALUAR
        ↓
CÓMO SABREMOS SI CUMPLE
        ↓
QUÉ NECESITAMOS MEDIR
        ↓
QUÉ HERRAMIENTA PUEDE
PROPORCIONAR LA EVIDENCIA
```

Durante este laboratorio utilizamos diferentes herramientas porque cada una proporciona evidencia diferente:

```text
ESLint
   ↓
CALIDAD ESTÁTICA DEL CÓDIGO

Jest + Supertest
   ↓
COMPORTAMIENTO ESPERADO DE LA API

npm audit
   ↓
DEPENDENCIAS Y VULNERABILIDADES CONOCIDAS
```

Finalmente:

```text
REQUISITO
    ↓
CRITERIO
    ↓
HERRAMIENTA
    ↓
MEDICIÓN
    ↓
EVIDENCIA
    ↓
DECISIÓN
    ↓
MEJORA CONTINUA
```

> La calidad no consiste en acumular herramientas. Consiste en utilizar evidencia para determinar si los requisitos definidos se están cumpliendo y orientar acciones de mejora.