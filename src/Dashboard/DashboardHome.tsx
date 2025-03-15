import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ApiRoutes from "../components/ApiRoutes";
//import Concesiones from "../pages/Concesiones";

interface DecodedToken {
  permissions: { action: string; resource: string }[];
}

const COLORS = ["#FFB74D", "#4CAF50", "#E53935"];

export default function DashboardHome() {
  const [stats, setStats] = useState({
    citas: { pendiente: 0, aprobada: 0, denegada: 0 },
    expedientes: { pendiente: 0, aprobada: 0, denegada: 0 },
    prorrogas: {pendiente: 0, aprobada: 0, denegada: 0},
    concesiones: {pendiente: 0, aprobada: 0, denegada: 0},
    denuncias: {pendiente: 0, aprobada: 0, denegada: 0},
    precarios: {pendiente: 0, aprobada: 0, denegada: 0},
    planos: {pendiente: 0, aprobada: 0, denegada: 0},

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
        prorrogas: decodedToken.permissions.some(p=> p.action === "GET" && p.resource === "prorroga"),
        concesiones: decodedToken.permissions.some(p=> p.action === "GET" && p.resource === "concesion"),
        denuncias: decodedToken.permissions.some(p=> p.action === "GET" && p.resource === "denuncia"),
        precarios: decodedToken.permissions.some(p=> p.action === "GET" && p.resource === "precario"),
        planos: decodedToken.permissions.some(p=> p.action === "GET" && p.resource === "revisionplano"),
      };

      if (!Object.values(permisos).includes(true)) {
        alert("No tienes permiso para acceder a esta página.");
        navigate("/");
        return;
      }

      async function fetchStats() {
        try {
          const requests = [];
          const headers = { Authorization: `Bearer ${token}`};
          if (permisos.citas) requests.push(fetch(ApiRoutes.citas.crearcita, { headers }));
          if (permisos.expedientes) requests.push(fetch(ApiRoutes.expedientes, { headers }));
          if (permisos.prorrogas) requests.push(fetch(ApiRoutes.prorrogas, {headers}));
          if (permisos.concesiones) requests.push(fetch(ApiRoutes.concesiones, {headers}));
          if (permisos.denuncias) requests.push(fetch(ApiRoutes.denuncias, {headers}));
          if (permisos.precarios) requests.push(fetch(ApiRoutes.precarios, {headers}));
          if (permisos.planos) {requests.push(fetch(ApiRoutes.planos, { headers }));
}

          
          
          const res = await Promise.all(requests.map(req => req.catch(err => null)));
          const data = await Promise.all(
            res.map(async (r, index) => {
              if (!r) return [];
              try {
                const json = await r.json();
                console.log(`Datos en index ${index}:`, json);
                return json;
              } catch (err) {
                console.error(`Error parseando JSON en index ${index}:`, err);
                return [];
              }
            })
          );
          
          console.log("Datos obtenidos:", data);

          const procesarDatos = (items: any[]) => ({
            pendiente: items.filter(item => item.status === "Pendiente").length,
            aprobada: items.filter(item => item.status === "Aprobada").length,
            denegada: items.filter(item => item.status === "Denegada").length,
          });
          
          setStats({
            citas: permisos.citas ? procesarDatos(data[0]?.flat() || []) : { pendiente: 0, aprobada: 0, denegada: 0 },
            expedientes: permisos.expedientes ? procesarDatos(data[1]?.flat() || []) : { pendiente: 0, aprobada: 0, denegada: 0 },
            prorrogas: permisos.prorrogas ? procesarDatos(data[2]?.flat() || []) : {pendiente: 0, aprobada: 0, denegada: 0},
            concesiones: permisos.concesiones ? procesarDatos(data[3]?.flat() || []) : {pendiente: 0, aprobada: 0, denegada: 0},
            denuncias: permisos.denuncias ? procesarDatos(data[4]?.flat() || []) : {pendiente: 0, aprobada: 0, denegada: 0},
            precarios: permisos.precarios ? procesarDatos(data[5]?.flat() || []) : {pendiente: 0, aprobada: 0, denegada: 0},
            planos: permisos.planos ? procesarDatos(data[6]?.flat() || []) : {pendiente: 0, aprobada: 0, denegada: 0},
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

  const renderPieChart = (title: string, data: { name: string; value: number }[]) => (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-0">{title}</h2>
      <ResponsiveContainer width= "100%" height={160}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8">
            {data.map((entry: { name: string; value: number }, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
  

  return (
    <div className="flex h-screen overflow-hidden">
  {/* Contenedor principal del contenido */}
  <div className="flex-1 overflow-y-auto p-4">
    {/* Tarjetas de estadísticas */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {Object.entries(stats).map(([key, value]: any) => (
        <div
          key={key}
          className="p-2 flex items-center gap-2 border border-red-500 bg-red-50 rounded-lg shadow w-full max-w-[120px] h-[60px]"
        >
          <AlertCircle className="text-red-500" size={14} />
          <div>
            <p className="text-[10px] font-bold">{key.toUpperCase()}</p>
            <p className="text-[10px]">{value.pendiente} pendientes</p>
          </div>
        </div>
      ))}
    </div>

    {/* Sección de gráficos */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 w-full mt-2">
      {renderPieChart("Citas", [
        { name: "Pendiente", value: stats.citas.pendiente },
        { name: "Aprobada", value: stats.citas.aprobada },
        { name: "Denegada", value: stats.citas.denegada },
      ])}
      {renderPieChart("Expedientes", [
        { name: "Pendiente", value: stats.expedientes.pendiente },
        { name: "Aprobada", value: stats.expedientes.aprobada },
        { name: "Denegada", value: stats.expedientes.denegada },
      ])}
      {renderPieChart("Prorrogas", [
        { name: "Pendiente", value: stats.prorrogas.pendiente },
        { name: "Aprobada", value: stats.prorrogas.aprobada },
        { name: "Denegada", value: stats.prorrogas.denegada },
      ])}
      {renderPieChart("Concesiones", [
        { name: "Pendiente", value: stats.concesiones.pendiente },
        { name: "Aprobada", value: stats.concesiones.aprobada },
        { name: "Denegada", value: stats.concesiones.denegada },
      ])}
      {renderPieChart("Denuncias", [
        { name: "Pendiente", value: stats.denuncias.pendiente },
        { name: "Aprobada", value: stats.denuncias.aprobada },
        { name: "Denegada", value: stats.denuncias.denegada },
      ])}
      {renderPieChart("Uso precario", [
        { name: "Pendiente", value: stats.precarios.pendiente },
        { name: "Aprobada", value: stats.precarios.aprobada },
        { name: "Denegada", value: stats.precarios.denegada },
      ])}
      {renderPieChart("Revision planos", [
        { name: "Pendiente", value: stats.planos.pendiente },
        { name: "Aprobada", value: stats.planos.aprobada },
        { name: "Denegada", value: stats.planos.denegada },
      ])}
    </div>
  </div>
</div>
  );
  
}  