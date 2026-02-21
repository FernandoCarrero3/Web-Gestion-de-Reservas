export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const password = process.env.ADMIN_PASSWORD;

    if (authHeader !== `Bearer ${password}`) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    const response = await fetch(process.env.N8N_GET_RESERVAS_URL, {
      cache: "no-store",
    });

    const data = await response.json();

    const reservas = (Array.isArray(data) ? data : [data]).map((row) => ({
      nombre: row.Nombre || "",
      telefono: row.Teléfono || "",
      email: row.Email || "",
      servicio: row.Servicio || "",
      fecha: row.Fecha || "",
      hora: row.Hora || "",
    }));

    return Response.json({ reservas }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error al obtener reservas" }, { status: 500 });
  }
}