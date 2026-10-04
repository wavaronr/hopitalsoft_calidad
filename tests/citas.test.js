// ========================================
// Importaciones
// ========================================

import request from "supertest";
import app from "../app.js";

// ========================================
// Pruebas HospitalSoft
// ========================================

describe("API HospitalSoft - Citas", () => {
  // ======================================
  // GET /api/citas
  // ======================================

  test("GET /api/citas debe responder 200", async () => {
    const response = await request(app).get("/api/citas");

    expect(response.statusCode).toBe(200);
  });

  // ======================================
  // GET /api/citas/:id
  // ======================================

  test("GET /api/citas/1 debe encontrar la cita", async () => {
    const response = await request(app).get("/api/citas/1");

    expect(response.statusCode).toBe(200);

    expect(response.body.id).toBe(1);
  });

  // ======================================
  // Cita inexistente
  // ======================================

  test("GET de cita inexistente debe responder 404", async () => {
    const response = await request(app).get("/api/citas/999");

    expect(response.statusCode).toBe(404);
  });

  // ======================================
  // Datos incompletos
  // ======================================

  test("POST incompleto debe responder 400", async () => {
    const response = await request(app).post("/api/citas").send({
      paciente: "Ana López",
    });

    expect(response.statusCode).toBe(400);
  });

  // ======================================
  // Conflicto de horario
  // ======================================

  test("POST duplicado debe responder 409", async () => {
    const response = await request(app).post("/api/citas").send({
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
    const response = await request(app).post("/api/citas").send({
      paciente: "María Rodríguez",
      medico: "Dr. Felipe Gómez",
      fecha: "2026-10-15",
      hora: "11:00",
    });

    expect(response.statusCode).toBe(201);

    expect(response.body.cita).toHaveProperty("id");
  });
});
