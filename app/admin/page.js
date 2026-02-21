"use client";
import { useState, useEffect, useRef } from "react";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [autenticado, setAutenticado] = useState(false);
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    if (saved) setDarkMode(saved === "dark");
    const savedPassword = sessionStorage.getItem("admin_password");
    if (savedPassword) fetchReservas(savedPassword);
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const fetchReservas = async (pwd) => {
    try {
      const response = await fetch("/api/admin/reservas", {
        headers: { Authorization: `Bearer ${pwd}` },
      });
      if (response.ok) {
        const data = await response.json();
        setReservas(data.reservas);
        setAutenticado(true);
        setUltimaActualizacion(new Date());
        sessionStorage.setItem("admin_password", pwd);
      } else {
        sessionStorage.removeItem("admin_password");
        setAutenticado(false);
      }
    } catch {
      console.error("Error al obtener reservas");
    } finally {
      setCargando(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");
    const response = await fetch("/api/admin/reservas", {
      headers: { Authorization: `Bearer ${password}` },
    });
    if (response.ok) {
      fetchReservas(password);
    } else {
      setError("Contraseña incorrecta");
      setCargando(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_password");
    setAutenticado(false);
    setReservas([]);
    setPassword("");
  };

  const hoy = new Date().toLocaleDateString("sv-SE");
  const reservasHoy = reservas.filter((r) => r.fecha === hoy);
  const d = darkMode;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .page {
          min-height: 100vh;
          background-color: ${d ? "#0d1117" : "#ede8df"};
          background-image: radial-gradient(ellipse at 20% 50%, rgba(180,140,60,0.08) 0%, transparent 60%);
          font-family: 'DM Sans', sans-serif;
          color: ${d ? "#f0ece4" : "#1a1209"};
          opacity: ${mounted ? 1 : 0};
          transition: opacity 0.5s ease, background-color 0.3s ease, color 0.3s ease;
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
          z-index: 100;
        }

        .theme-btn:hover {
          background: ${d ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
          color: ${d ? "rgba(240,236,228,0.9)" : "rgba(26,18,9,0.9)"};
        }

        /* LOGIN */
        .login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .login-card {
          background: ${d ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.95)"};
          border: 1px solid ${d ? "rgba(180,140,60,0.2)" : "rgba(180,140,60,0.3)"};
          border-radius: 24px;
          padding: 3rem;
          width: 100%;
          max-width: 380px;
          box-shadow: ${d ? "0 0 60px rgba(0,0,0,0.4)" : "0 8px 40px rgba(0,0,0,0.08)"};
        }

        .login-tag {
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #b48c3c;
          background: rgba(180,140,60,0.1);
          border: 1px solid rgba(180,140,60,0.25);
          padding: 0.3rem 0.75rem;
          border-radius: 100px;
          display: inline-block;
          margin-bottom: 1rem;
        }

        .login-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 300;
          color: ${d ? "#f0ece4" : "#1a1209"};
          margin-bottom: 0.5rem;
        }

        .login-subtitle {
          font-size: 0.82rem;
          color: ${d ? "rgba(240,236,228,0.4)" : "rgba(26,18,9,0.5)"};
          margin-bottom: 2rem;
        }

        .login-form { display: flex; flex-direction: column; gap: 1rem; }

        .login-label {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${d ? "rgba(240,236,228,0.5)" : "rgba(26,18,9,0.6)"};
          display: block;
          margin-bottom: 0.4rem;
        }

        .login-input {
          width: 100%;
          background: ${d ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)"};
          border: 1px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(120,90,20,0.25)"};
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          font-family: 'DM Sans', sans-serif;
          color: ${d ? "#f0ece4" : "#1a1209"};
          outline: none;
          transition: border-color 0.2s;
        }

        .login-input:focus { border-color: rgba(180,140,60,0.5); }

        .login-btn {
          padding: 0.9rem;
          background: linear-gradient(135deg, #b48c3c, #d4a853);
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          color: #fff;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
        }

        .login-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .login-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .login-error {
          font-size: 0.8rem;
          color: #eb5757;
          background: rgba(220,80,80,0.1);
          border: 1px solid rgba(220,80,80,0.2);
          border-radius: 8px;
          padding: 0.65rem 0.9rem;
        }

        /* PANEL */
        .panel { max-width: 1100px; margin: 0 auto; padding: 3rem 2rem; }

        .panel-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .panel-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.2rem;
          font-weight: 300;
          color: ${d ? "#f0ece4" : "#1a1209"};
        }

        .panel-subtitle {
          font-size: 0.82rem;
          color: ${d ? "rgba(240,236,228,0.4)" : "rgba(26,18,9,0.5)"};
          margin-top: 0.25rem;
        }

        .header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem; }

        .action-btns { display: flex; gap: 0.5rem; }

        .action-btn {
          background: ${d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"};
          border: 1px solid ${d ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
          border-radius: 8px;
          padding: 0.5rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          color: ${d ? "rgba(240,236,228,0.5)" : "rgba(26,18,9,0.6)"};
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: ${d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"};
          color: ${d ? "rgba(240,236,228,0.9)" : "rgba(26,18,9,0.9)"};
        }

        .action-btn.gold {
          color: rgba(180,140,60,0.8);
          border-color: rgba(180,140,60,0.25);
          background: rgba(180,140,60,0.05);
        }

        .actualizacion {
          font-size: 0.68rem;
          color: ${d ? "rgba(240,236,228,0.25)" : "rgba(26,18,9,0.35)"};
          letter-spacing: 0.05em;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: ${d ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.7)"};
          border: 1px solid ${d ? "rgba(180,140,60,0.15)" : "rgba(180,140,60,0.2)"};
          border-radius: 16px;
          padding: 1.25rem 1.5rem;
        }

        .stat-label {
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${d ? "rgba(240,236,228,0.4)" : "rgba(26,18,9,0.5)"};
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.2rem;
          font-weight: 400;
          color: #b48c3c;
          line-height: 1;
        }

        .table-wrapper {
          background: ${d ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.7)"};
          border: 1px solid ${d ? "rgba(180,140,60,0.15)" : "rgba(180,140,60,0.2)"};
          border-radius: 16px;
          overflow: hidden;
        }

        .table-title {
          padding: 1.25rem 1.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: ${d ? "rgba(240,236,228,0.5)" : "rgba(26,18,9,0.5)"};
          border-bottom: 1px solid ${d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"};
        }

        .table { width: 100%; border-collapse: collapse; }

        .table th {
          padding: 0.85rem 1.25rem;
          text-align: left;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${d ? "rgba(240,236,228,0.35)" : "rgba(26,18,9,0.4)"};
          border-bottom: 1px solid ${d ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"};
        }

        .table td {
          padding: 1rem 1.25rem;
          font-size: 0.85rem;
          color: ${d ? "rgba(240,236,228,0.8)" : "rgba(26,18,9,0.8)"};
          border-bottom: 1px solid ${d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"};
        }

        .table tr:last-child td { border-bottom: none; }
        .table tr:hover td { background: rgba(180,140,60,0.04); }

        .badge-hoy {
          display: inline-block;
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #b48c3c;
          background: rgba(180,140,60,0.12);
          border: 1px solid rgba(180,140,60,0.25);
          padding: 0.2rem 0.5rem;
          border-radius: 100px;
          margin-left: 0.5rem;
          vertical-align: middle;
        }

        .empty {
          text-align: center;
          padding: 3rem;
          color: ${d ? "rgba(240,236,228,0.25)" : "rgba(26,18,9,0.3)"};
          font-size: 0.85rem;
        }

        @media (max-width: 640px) {
          .panel {
            padding: 2rem 1rem;
            padding-top: 4rem;
          }

          .panel-title { font-size: 1.7rem; }

          .panel-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-right {
            align-items: flex-start;
            width: 100%;
          }

          .action-btns { width: 100%; }

          .action-btn {
            flex: 1;
            text-align: center;
          }

          .stats { grid-template-columns: 1fr 1fr; }

          .theme-btn { top: 1rem; right: 1rem; }

          .table thead { display: none; }

          .table tr {
            display: block;
            border: 1px solid ${d ? "rgba(180,140,60,0.15)" : "rgba(180,140,60,0.2)"};
            border-radius: 12px;
            margin: 0.75rem 1rem;
            padding: 1rem;
            background: ${d ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.6)"};
          }

          .table td {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.4rem 0;
            font-size: 0.82rem;
            border-bottom: 1px solid ${d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"};
          }

          .table td:last-child { border-bottom: none; }

          .table td::before {
            content: attr(data-label);
            font-size: 0.65rem;
            font-weight: 500;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: ${d ? "rgba(240,236,228,0.35)" : "rgba(26,18,9,0.4)"};
          }

          .table-wrapper { border-radius: 12px; }
        }
      `}</style>

      <div className="page">
        <button className="theme-btn" onClick={toggleTheme}>
          {d ? "☀ Modo claro" : "☾ Modo oscuro"}
        </button>

        {!autenticado ? (
          <div className="login-wrapper">
            <div className="login-card">
              <span className="login-tag">Panel de administración</span>
              <h1 className="login-title">Acceso restringido</h1>
              <p className="login-subtitle">Introduce la contraseña para ver las reservas</p>
              <form className="login-form" onSubmit={handleLogin}>
                <div>
                  <label className="login-label">Contraseña</label>
                  <input
                    className="login-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                {error && <div className="login-error">✗ {error}</div>}
                <button className="login-btn" type="submit" disabled={cargando}>
                  {cargando ? "Verificando..." : "Entrar →"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="panel">
            <div className="panel-header">
              <div>
                <h1 className="panel-title">Panel de reservas</h1>
                <p className="panel-subtitle">Gestión de citas del negocio</p>
              </div>
              <div className="header-right">
                <div className="action-btns">
                  <button
                    className="action-btn gold"
                    onClick={() => fetchReservas(sessionStorage.getItem("admin_password"))}
                  >
                    ↻ Actualizar
                  </button>
                  <button className="action-btn" onClick={handleLogout}>Cerrar sesión</button>
                </div>
                {ultimaActualizacion && (
                  <span className="actualizacion">
                    Actualizado a las {ultimaActualizacion.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </div>
            </div>

            <div className="stats">
              <div className="stat-card">
                <div className="stat-label">Total reservas</div>
                <div className="stat-value">{reservas.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Reservas hoy</div>
                <div className="stat-value">{reservasHoy.length}</div>
              </div>
            </div>

            <div className="table-wrapper">
              <div className="table-title">Todas las reservas</div>
              {reservas.length === 0 ? (
                <div className="empty">No hay reservas todavía</div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Teléfono</th>
                      <th>Email</th>
                      <th>Servicio</th>
                      <th>Fecha</th>
                      <th>Hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservas.map((r, i) => (
                      <tr key={i}>
                        <td data-label="Nombre">{r.nombre}</td>
                        <td data-label="Teléfono">{r.telefono}</td>
                        <td data-label="Email">{r.email}</td>
                        <td data-label="Servicio">{r.servicio}</td>
                        <td data-label="Fecha">
                          {r.fecha}
                          {r.fecha === hoy && <span className="badge-hoy">Hoy</span>}
                        </td>
                        <td>{r.hora}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}