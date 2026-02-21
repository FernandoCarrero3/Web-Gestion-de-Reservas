# 📅 Sistema de Gestión de Reservas

Aplicación web completa para la gestión de citas y reservas de negocios locales. Desarrollada con **Next.js** y automatizada con **n8n**, permite a los clientes reservar citas online y al negocio gestionarlas desde un panel de administración en tiempo real.

---

## 🌐 Demo

👉 [Ver demo en vivo](https://web-gestion-de-reservas.vercel.app)

---

## ✨ Funcionalidades

- **Formulario de reservas** con validación de campos en tiempo real
- **Notificación automática por email** al negocio con los datos de cada nueva reserva
- **Email de confirmación automático** al cliente tras realizar su reserva
- **Almacenamiento en Google Sheets** de todas las reservas
- **Panel de administración** protegido con contraseña para ver y gestionar las reservas
- **Sesión persistente** en el panel admin sin necesidad de volver a autenticarse
- **Diseño responsive** optimizado para móvil, tablet y escritorio
- **Modo claro / oscuro** con preferencia guardada entre sesiones

---

## 🛠️ Tecnologías utilizadas

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 15, React, CSS personalizado |
| Automatización | n8n (self-hosted) |
| Base de datos | Google Sheets |
| Notificaciones | Gmail API (via n8n) |
| Despliegue | Vercel |
| Túnel local | ngrok |

---

## 📁 Estructura del proyecto

```
sistema-reservas/
├── app/
│   ├── page.js                  # Página principal con formulario de reservas
│   ├── admin/
│   │   └── page.js              # Panel de administración
│   ├── api/
│   │   ├── reserva/
│   │   │   └── route.js         # Endpoint POST: recibe y envía reservas a n8n
│   │   └── admin/
│   │       └── reservas/
│   │           └── route.js     # Endpoint GET: obtiene reservas desde n8n
│   └── globals.css
├── .env.local                   # Variables de entorno (no incluido en el repo)
├── next.config.js
└── package.json
```

---

## ⚙️ Flujo de automatización (n8n)

### Workflow 1 – Nueva reserva
```
Webhook (POST) → Google Sheets (Append Row) → Gmail (Email al negocio) → Gmail (Email al cliente)
```

### Workflow 2 – Obtener reservas
```
Webhook (GET) → Google Sheets (Get Rows) → Respond to Webhook (JSON)
```

---

## 🚀 Instalación local

### Requisitos previos
- Node.js >= 20
- n8n instalado (local o Docker)
- Cuenta de Google con acceso a Google Sheets y Gmail

### Pasos

**1. Clona el repositorio**
```bash
git clone https://github.com/FernandoCarrero3/Web-Gestion-de-Reservas.git
cd Web-Gestion-de-Reservas
```

**2. Instala las dependencias**
```bash
npm install
```

**3. Configura las variables de entorno**

Crea un archivo `.env.local` en la raíz del proyecto:
```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook/reserva
N8N_GET_RESERVAS_URL=http://localhost:5678/webhook/get-reservas
ADMIN_PASSWORD=tu_contraseña_segura
GOOGLE_SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/TU_ID/pub?output=csv
```

**4. Configura n8n**

Importa o crea manualmente los dos workflows descritos en la sección de automatización. Asegúrate de autenticar las credenciales de Google Sheets y Gmail.

**5. Expón n8n con ngrok** (para desarrollo)
```bash
ngrok http 5678
```
Actualiza las URLs de n8n en `.env.local` con la URL generada por ngrok.

**6. Arranca el servidor de desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🌍 Despliegue en producción

El proyecto está desplegado en **Vercel**. Para desplegar tu propia versión:

1. Haz fork del repositorio
2. Importa el proyecto en [vercel.com](https://vercel.com)
3. Añade las variables de entorno en el panel de Vercel
4. Despliega y actualiza las URLs de n8n con tu instancia pública

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Puedes usarlo, modificarlo y distribuirlo libremente.

---

## 👤 Autor

**Fernando Carrero Pérez**  
Estudiante de Ingeniería Informática – Universidad de Huelva  
[GitHub](https://github.com/FernandoCarrero3) · [LinkedIn](https://www.linkedin.com/in/fernando-carrero/)