export async function POST(request) {
  try {
    const body = await request.json();

    const { nombre, telefono, email, fecha, hora, servicio } = body;

    if (!nombre || !telefono || !email || !fecha || !hora || !servicio) {
      return Response.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, telefono, email, fecha, hora, servicio }),
    });

    if (!response.ok) {
      throw new Error("Error al contactar con n8n");
    }

    return Response.json({ mensaje: "Reserva recibida correctamente" }, { status: 200 });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}