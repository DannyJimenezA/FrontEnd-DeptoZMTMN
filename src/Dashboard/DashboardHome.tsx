import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ApiRoutes from "../components/ApiRoutes";
import "../Dashboard/DashboardHome.css";

interface DecodedToken {
  permissions: { action: string; resource: string }[];
}

const COLORS = ["#FFB74D", "#4CAF50", "#E53935"];

export default function DashboardHome() {
  const [stats, setStats] = useState({
    citas: { pendiente: 0, aprobada: 0, denegada: 0 },
    expedientes: { pendiente: 0, aprobada: 0, denegada: 0 },
    prorrogas: { pendiente: 0, aprobada: 0, denegada: 0 },
    concesiones: { pendiente: 0, aprobada: 0, denegada: 0 },
    denuncias: { pendiente: 0, aprobada: 0, denegada: 0 },
    precarios: { pendiente: 0, aprobada: 0, denegada: 0 },
    planos: { pendiente: 0, aprobada: 0, denegada: 0 },
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No se ha encontrado un token de acceso. Por favor, inicie sesión.");
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);

      const permisos = {
        citas: decodedToken.permissions.some(p => p.action === "GET" && p.resource === "appointments"),
        expedientes: decodedToken.permissions.some(p => p.action === "GET" && p.resource === "copia_expediente"),
        prorrogas: decodedToken.permissions.some(p => p.action === "GET" && p.resource === "prorroga"),
        concesiones: decodedToken.permissions.some(p => p.action === "GET" && p.resource === "concesion"),
        denuncias: decodedToken.permissions.some(p => p.action === "GET" && p.resource === "denuncia"),
        precarios: decodedToken.permissions.some(p => p.action === "GET" && p.resource === "precario"),
        planos: decodedToken.permissions.some(p => p.action === "GET" && p.resource === "revisionplano"),
      };

      if (!Object.values(permisos).includes(true)) {
        alert("No tienes permiso para acceder a esta página.");
        navigate("/");
        return;
      }

      async function fetchStats() {
        try {
          const requests = [];
          const headers = { Authorization: `Bearer ${token}` };

          if (permisos.citas) requests.push(fetch(ApiRoutes.citas.crearcita, { headers }));
          if (permisos.expedientes) requests.push(fetch(ApiRoutes.expedientes, { headers }));
          if (permisos.prorrogas) requests.push(fetch(ApiRoutes.prorrogas, { headers }));
          if (permisos.concesiones) requests.push(fetch(ApiRoutes.concesiones, { headers }));
          if (permisos.denuncias) requests.push(fetch(ApiRoutes.denuncias, { headers }));
          if (permisos.precarios) requests.push(fetch(ApiRoutes.precarios, { headers }));
          if (permisos.planos) requests.push(fetch(ApiRoutes.planos, { headers }));

          const res = await Promise.all(requests.map(req => req.catch(() => null)));
          const data = await Promise.all(
            res.map(async (r, index) => {
              if (!r) return [];
              try {
                return await r.json();
              } catch (err) {
                console.error(`Error parseando JSON en index ${index}:`, err);
                return [];
              }
            })
          );

          const procesarDatos = (items: any[]) => ({
            pendiente: items.filter(item => item.status === "Pendiente").length,
            aprobada: items.filter(item => item.status === "Aprobada").length,
            denegada: items.filter(item => item.status === "Denegada").length,
          });

          setStats({
            citas: permisos.citas ? procesarDatos(data[0]?.flat() || []) : { pendiente: 0, aprobada: 0, denegada: 0 },
            expedientes: permisos.expedientes ? procesarDatos(data[1]?.flat() || []) : { pendiente: 0, aprobada: 0, denegada: 0 },
            prorrogas: permisos.prorrogas ? procesarDatos(data[2]?.flat() || []) : { pendiente: 0, aprobada: 0, denegada: 0 },
            concesiones: permisos.concesiones ? procesarDatos(data[3]?.flat() || []) : { pendiente: 0, aprobada: 0, denegada: 0 },
            denuncias: permisos.denuncias ? procesarDatos(data[4]?.flat() || []) : { pendiente: 0, aprobada: 0, denegada: 0 },
            precarios: permisos.precarios ? procesarDatos(data[5]?.flat() || []) : { pendiente: 0, aprobada: 0, denegada: 0 },
            planos: permisos.planos ? procesarDatos(data[6]?.flat() || []) : { pendiente: 0, aprobada: 0, denegada: 0 },
          });
        } catch (error) {
          console.error("Error al obtener estadísticas", error);
        }
      }

      fetchStats();
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      alert("Ha ocurrido un error. Por favor, inicie sesión nuevamente.");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
      {/* 🔴 Tarjetas de pendientes */}
      <div className="stats-grid">
        {Object.entries(stats).map(([key, value]: any) => (
          <div key={key} className="stat-card">
            <AlertCircle className="stat-icon" size={18} />
            <div>
              <p className="stat-text">{key.toUpperCase()}</p>
              <p className="stat-count">{value.pendiente} pendientes</p>
            </div>
          </div>
        ))}
      </div>

      {/* 📊 Sección de gráficos en filas de 3 columnas */}
      <div className="charts-container">
        {[
          { title: "Citas", data: stats.citas },
          { title: "Expedientes", data: stats.expedientes },
          { title: "Prórrogas", data: stats.prorrogas },
          { title: "Concesiones", data: stats.concesiones },
          { title: "Denuncias", data: stats.denuncias },
          { title: "Uso Precario", data: stats.precarios },
          { title: "Revisión Planos", data: stats.planos },
        ].map(({ title, data }) => (
          <div key={title} className="chart-box">
            <h2 className="chart-title">{title}</h2>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={Object.entries(data).map(([name, value]) => ({ name, value }))} dataKey="value" cx="50%" cy="50%" outerRadius={60} fill="#8884d8">
                  {Object.entries(data).map(([_name, _value], index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}
