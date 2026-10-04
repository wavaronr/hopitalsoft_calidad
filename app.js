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

  // Validación de campos obligatorios
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
// Exportación para pruebas
// ========================================

export default app;