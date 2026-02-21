"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    fecha: "",
    hora: "",
    servicio: "",
  });

  const [estado, setEstado] = useState("idle");
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    if (saved) setDarkMode(saved === "dark");
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstado("cargando");
    try {
      const response = await fetch("/api/reserva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) setEstado("exito");
      else setEstado("error");
    } catch {
      setEstado("error");
    }
  };

  const d = darkMode;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }

        .page-wrapper {
          min-height: 100vh;
          background-color: ${d ? "#0d1117" : "#ede8df"};
          background-image: ${d
          ? "radial-gradient(ellipse at 20% 50%, rgba(180,140,60,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(180,140,60,0.05) 0%, transparent 50%)"
          : "radial-gradient(ellipse at 20% 50%, rgba(180,140,60,0.12) 0%, transparent 60%)"};
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          font-family: 'DM Sans', sans-serif;
          transition: background-color 0.3s ease;
        }

        .card {
          background: ${d ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.95)"};
          border: 1px solid ${d ? "rgba(180,140,60,0.2)" : "rgba(180,140,60,0.3)"};
          border-radius: 24px;
          padding: 3rem;
          width: 100%;
          max-width: 480px;
          backdrop-filter: blur(20px);
          box-shadow: ${d ? "0 0 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)" : "0 8px 40px rgba(0,0,0,0.08)"};
          opacity: ${mounted ? 1 : 0};
          transform: ${mounted ? "translateY(0)" : "translateY(20px)"};
          transition: opacity 0.6s ease, transform 0.6s ease, background 0.3s ease;
        }

        .card-header { margin-bottom: 2.5rem; }

        .tag {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #b48c3c;
          background: rgba(180,140,60,0.1);
          border: 1px solid rgba(180,140,60,0.25);
          padding: 0.3rem 0.75rem;
          border-radius: 100px;
          margin-bottom: 1rem;
        }

        .title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.4rem;
          font-weight: 300;
          color: ${d ? "#f0ece4" : "#1a1209"};
          line-height: 1.15;
          margin: 0 0 0.75rem 0;
          letter-spacing: -0.01em;
          transition: color 0.3s;
        }

        .subtitle {
          font-size: 0.85rem;
          color: ${d ? "rgba(240,236,228,0.4)" : "rgba(26,18,9,0.6)"};
          font-weight: 300;
          line-height: 1.6;
          margin: 0;
          transition: color 0.3s;
        }

        .divider {
          height: 1px;
          background: linear-gradient(to right, rgba(180,140,60,0.3), transparent);
          margin: 2rem 0;
        }

        .form { display: flex; flex-direction: column; gap: 1.25rem; }

        .field { display: flex; flex-direction: column; gap: 0.4rem; }

        .label {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${d ? "rgba(240,236,228,0.5)" : "rgba(26,18,9,0.6)"};
          transition: color 0.3s;
        }

        .input, .select {
          background: ${d ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)"};
          border: 1px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(120,90,20,0.25)"};
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          font-family: 'DM Sans', sans-serif;
          color: ${d ? "#f0ece4" : "#1a1209"};
          width: 100%;
          transition: border-color 0.2s, background 0.3s, color 0.3s;
          outline: none;
          -webkit-appearance: none;
        }

        .input::placeholder { color: ${d ? "rgba(240,236,228,0.2)" : "rgba(26,18,9,0.35)"}; }

        .input:focus, .select:focus {
          border-color: rgba(180,140,60,0.5);
          background: ${d ? "rgba(180,140,60,0.05)" : "rgba(180,140,60,0.05)"};
        }

        .select option { background: ${d ? "#1a1f2e" : "#fff"}; color: ${d ? "#f0ece4" : "#1a1209"}; }

        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        .btn {
          margin-top: 0.5rem;
          padding: 0.9rem;
          background: linear-gradient(135deg, #b48c3c, #d4a853);
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          color: #fff;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
        }

        .btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .msg-success {
          padding: 0.85rem 1rem;
          background: rgba(74,180,100,0.1);
          border: 1px solid rgba(74,180,100,0.25);
          border-radius: 10px;
          font-size: 0.82rem;
          color: ${d ? "#6fcf97" : "#2d8a50"};
        }

        .msg-error {
          padding: 0.85rem 1rem;
          background: rgba(220,80,80,0.1);
          border: 1px solid rgba(220,80,80,0.25);
          border-radius: 10px;
          font-size: 0.82rem;
          color: #eb5757;
        }

        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: ${d ? "invert(0.6)" : "invert(0.3)"};
          cursor: pointer;
        }

        .theme-btn {
          position: fixed;
          top: 1.5rem;
          right: 1.5rem;
          background: ${d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"};
          border: 1px solid ${d ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
          border-radius: 50px;
          padding: 0.4rem 0.9rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          color: ${d ? "rgba(240,236,228,0.5)" : "rgba(26,18,9,0.6)"};
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.05em;
        }

        .theme-btn:hover {
          background: ${d ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
          color: ${d ? "rgba(240,236,228,0.9)" : "rgba(26,18,9,0.9)"};
        }

        @media (max-width: 480px) {
        .page-wrapper {
          padding: 1rem;
          align-items: flex-start;
          padding-top: 4rem;
        }

        .card {
          padding: 2rem 1.5rem;
          border-radius: 20px;
        }

        .title {
          font-size: 2rem;
        }

        .row {
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }

        .theme-btn {
          top: 1rem;
          right: 1rem;
          font-size: 0.68rem;
          padding: 0.35rem 0.75rem;
        }
      }
      `}</style>

      <div className="page-wrapper">
        <button className="theme-btn" onClick={toggleTheme}>
          {d ? "☀ Modo claro" : "☾ Modo oscuro"}
        </button>

        <div className="card">
          <div className="card-header">
            <span className="tag">Reservas online</span>
            <h1 className="title">Reserva tu<br />cita ahora</h1>
            <p className="subtitle">Rellena el formulario y recibirás una confirmación en tu correo de forma inmediata.</p>
          </div>

          <div className="divider" />

          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Nombre completo</label>
              <input className="input" type="text" name="nombre" required placeholder="Ej: María García" onChange={handleChange} />
            </div>

            <div className="row">
              <div className="field">
                <label className="label">Teléfono</label>
                <input className="input" type="tel" name="telefono" required placeholder="612 345 678" onChange={handleChange} />
              </div>
              <div className="field">
                <label className="label">Email</label>
                <input className="input" type="email" name="email" required placeholder="tu@email.com" onChange={handleChange} />
              </div>
            </div>

            <div className="field">
              <label className="label">Servicio</label>
              <select className="select" name="servicio" required onChange={handleChange}>
                <option value="">Selecciona un servicio</option>
                <option value="Corte de pelo">Corte de pelo</option>
                <option value="Tinte">Tinte</option>
                <option value="Manicura">Manicura</option>
                <option value="Barba">Barba</option>
              </select>
            </div>

            <div className="row">
              <div className="field">
                <label className="label">Fecha</label>
                <input className="input" type="date" name="fecha" required onChange={handleChange} />
              </div>
              <div className="field">
                <label className="label">Hora</label>
                <input className="input" type="time" name="hora" required onChange={handleChange} />
              </div>
            </div>

            {estado === "exito" && <div className="msg-success">✓ Reserva enviada correctamente. ¡Te contactaremos pronto!</div>}
            {estado === "error" && <div className="msg-error">✗ Hubo un error al enviar. Inténtalo de nuevo.</div>}

            <button className="btn" type="submit" disabled={estado === "cargando"}>
              {estado === "cargando" ? "Enviando reserva..." : "Confirmar reserva →"}
            </button>
          </form>
        </div>

        <a
          href="/admin"
          style={{
            position: "fixed",
            bottom: "1.5rem",
            right: "1.5rem",
            fontSize: "0.65rem",
            color: d ? "rgba(240,236,228,0.15)" : "rgba(26,18,9,0.2)",
            textDecoration: "none",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            transition: "color 0.3s",
          }}
          onMouseEnter={e => e.target.style.color = "rgba(180,140,60,0.6)"}
          onMouseLeave={e => e.target.style.color = d ? "rgba(240,236,228,0.15)" : "rgba(26,18,9,0.2)"}
        >
          Admin
        </a>
      </div>
    </>
  );
}