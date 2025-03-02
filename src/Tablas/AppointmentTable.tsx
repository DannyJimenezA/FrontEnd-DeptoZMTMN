import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../styles/Global.css';
import { Cita, DecodedToken } from '../Types/Types';
import { FaEye, FaTrash, FaPlus } from 'react-icons/fa';
import Paginacion from '../components/Paginacion';
import FilterButtons from '../components/FilterButton';
import ApiRoutes from '../components/ApiRoutes';
import FiltroFecha from '../components/FiltroFecha';
import SearchBar from '../components/SearchBar';
import "../styles/TableButtons.css";

interface CitasTableProps {
  onVerCita: (cita: Cita) => void;
}

const fetchCitas = async (): Promise<Cita[]> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado');

  try {
    const response = await fetch(ApiRoutes.citas.crearcita, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data: Cita[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching citas:', error);
    throw error;
  }
};

const fetchHorasOcupadas = async (fechaId: number): Promise<string[]> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado');

  try {
    const response = await fetch(`${ApiRoutes.citas.obtenerCitasOcupadas}/${fechaId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data: string[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching horas ocupadas:', error);
    throw error;
  }
};

const fetchHorasDisponibles = async (fechaId: number): Promise<string[]> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token no encontrado');

  try {
    const response = await fetch(`${ApiRoutes.horasDisponibles}/${fechaId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.horasDisponibles; // Asegúrate de que el backend devuelva un array de horas
  } catch (error) {
    console.error('Error fetching horas disponibles:', error);
    throw error;
  }
};

const obtenerFechaId = (fecha: Date): number => {
  // Aquí debes implementar la lógica para obtener el ID de la fecha
  // Por ejemplo, si tienes una lista de fechas disponibles, puedes buscar el ID correspondiente
  return 1; // Reemplaza esto con la lógica real
};

const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`; // Devuelve solo horas y minutos
};

const formatDateTime = (date: string, time: string): string => {
  if (!date || !time) {
    return 'Fecha y hora no disponibles';
  }

  const dateTimeString = `${date}T${time}`;
  const dateTime = new Date(dateTimeString);

  if (isNaN(dateTime.getTime())) {
    console.error('Fecha o hora inválida:', date, time);
    return 'Fecha y hora inválidas';
  }

  return dateTime.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const TablaCitas: React.FC<CitasTableProps> = ({ onVerCita }) => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [horasOcupadas, setHorasOcupadas] = useState<string[]>([]);
  const [horasDisponibles, setHorasDisponibles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [searchBy, setSearchBy] = useState<string>('nombre');
  const [showFormFecha, setShowFormFecha] = useState<boolean>(false);
  const [showFormHoras, setShowFormHoras] = useState<boolean>(false);
  const [nuevaFecha, setNuevaFecha] = useState<string>('');
  const [nuevasHoras, setNuevasHoras] = useState<string>('');
  const [fechasDisponibles, setFechasDisponibles] = useState<{ id: number; date: string }[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<number | null>(null);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.alert('No se ha encontrado un token de acceso. Por favor, inicie sesión.');
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const hasPermission = decodedToken.permissions.some(
        (permission) => permission.action === 'GET' && permission.resource === 'appointments'
      );

      if (!hasPermission) {
        window.alert('No tienes permiso para acceder a esta página.');
        navigate('/');
        return;
      }
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      window.alert('Ha ocurrido un error. Por favor, inicie sesión nuevamente.');
      navigate('/login');
      return;
    }

    const obtenerCitasYHoras = async () => {
      try {
        const citasFromAPI = await fetchCitas();
        console.log('Citas desde el backend:', citasFromAPI);
        setCitas(citasFromAPI);

        if (fechaFiltro) {
          const fechaId = obtenerFechaId(fechaFiltro);
          const horasOcupadasFromAPI = await fetchHorasOcupadas(fechaId);
          setHorasOcupadas(horasOcupadasFromAPI);
        }

        // Obtener las fechas disponibles
        const responseFechas = await fetch(ApiRoutes.fechaCitas, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!responseFechas.ok) {
          throw new Error(`Error: ${responseFechas.status} - ${responseFechas.statusText}`);
        }

        const fechas = await responseFechas.json();
        setFechasDisponibles(fechas);
      } catch (error) {
        console.error('Error al obtener las citas y horas ocupadas:', error);
        setError('Error al cargar las citas y horas ocupadas.');
      } finally {
        setLoading(false);
      }
    };

    obtenerCitasYHoras();
  }, [navigate, fechaFiltro]);

  const manejarEliminar = async (id: number) => {
    const confirmacion = window.confirm('¿Estás seguro de eliminar la cita?');
    if (!confirmacion) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      alert('No tienes permisos para realizar esta acción.');
      return;
    }

    try {
      const response = await fetch(`${ApiRoutes.citas.crearcita}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          alert('No tienes permisos para eliminar esta cita.');
        } else {
          alert('Error al eliminar la cita.');
        }
        throw new Error(`Error al eliminar la cita con ID: ${id}`);
      }

      setCitas((prevCitas) => prevCitas.filter((cita) => cita.id !== id));
      console.log(`Cita con ID: ${id} eliminada`);
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
    }
  };

  const handleCrearFecha = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      alert('No tienes permisos para realizar esta acción.');
      return;
    }

    try {
      // Crear la fecha
      const responseFecha = await fetch(ApiRoutes.fechaCitas, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ date: nuevaFecha }),
      });

      if (!responseFecha.ok) {
        const errorData = await responseFecha.json();
        console.error('Error al crear la fecha:', errorData);
        throw new Error(`Error al crear la fecha: ${responseFecha.statusText}`);
      }

      const fechaCreada = await responseFecha.json();
      console.log('Fecha creada:', fechaCreada);

      alert('Fecha creada correctamente');
      setNuevaFecha('');
      setShowFormFecha(false);
    } catch (error) {
      console.error('Error al crear la fecha:', error);
      alert(`Error al crear la fecha: ${error.message}`);
    }
  };

  const handleAgregarHoras = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      alert('No tienes permisos para realizar esta acción.');
      return;
    }
  
    if (!fechaSeleccionada) {
      alert('Selecciona una fecha para agregar horas.');
      return;
    }

    if (!nuevasHoras) {
      alert('Ingresa al menos una hora.');
      return;
    }
  
    try {

      const horas = nuevasHoras.split(',').map((hora) => hora.trim());
      
      // Crear la hora asociada a la fecha seleccionada
      const responseHoras = await fetch(ApiRoutes.horasCitas, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          fechaId: fechaSeleccionada, // Usa el valor de 'fechaSeleccionada'
          hora: horas, // Asegúrate de enviar 'hora' en lugar de 'horas'
        }),
      });
  
      if (!responseHoras.ok) {
        const errorData = await responseHoras.json();
        console.error('Error al crear la hora:', errorData);
        throw new Error(errorData.message || 'Error al crear la hora');
      }
  
      const horaCreada = await responseHoras.json();
      console.log('Hora creada:', horaCreada);
  
      alert('Hora agregada correctamente');
      setNuevasHoras('');
      setShowFormHoras(false);
  
      // Actualizar la lista de horas disponibles
      const horasDisponiblesActualizadas = await fetchHorasDisponibles(fechaSeleccionada);
      setHorasDisponibles(horasDisponiblesActualizadas);
    } catch (error) {
      console.error('Error al agregar horas:', error);
      alert(`Error al agregar horas: ${error.message}`);
    }
  };

  const handleFechaSeleccionadaChange = async (fechaId: number) => {
    console.log('Fecha seleccionada:', fechaId);
    setFechaSeleccionada(fechaId);
    try {
      const horasDisponibles = await fetchHorasDisponibles(fechaId);
      setHorasDisponibles(horasDisponibles);
    } catch (error) {
      console.error('Error al obtener las horas disponibles:', error);
    }
  };

  if (loading) return <p>Cargando citas...</p>;
  if (error) return <p>{error}</p>;

  const obtenerCitasFiltradas = () => {
    let citasFiltradas = citas;

    if (filtroEstado !== 'todos') {
      citasFiltradas = citasFiltradas.filter((cita) => cita.status === filtroEstado);
    }

    if (fechaFiltro) {
      const fechaSeleccionada = fechaFiltro.toISOString().split('T')[0];
      citasFiltradas = citasFiltradas.filter((cita) => cita.availableDate.date === fechaSeleccionada);
    }

    if (searchText) {
      citasFiltradas = citasFiltradas.filter((cita) =>
        searchBy === 'nombre'
          ? cita.user?.nombre?.toLowerCase().includes(searchText.toLowerCase())
          : cita.user?.cedula?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return citasFiltradas;
  };

  const citasFiltradas = obtenerCitasFiltradas();
  const indexUltimaCita = currentPage * itemsPerPage;
  const indexPrimeraCita = indexUltimaCita - itemsPerPage;
  const citasActuales = citasFiltradas.slice(indexPrimeraCita, indexUltimaCita);
  const totalPages = Math.ceil(citasFiltradas.length / itemsPerPage);

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Citas Programadas</h2>

      {/* Botones para mostrar/ocultar los formularios */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => {
            setShowFormFecha(!showFormFecha);
            setShowFormHoras(false);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          <FaPlus /> {showFormFecha ? 'Ocultar formulario de fecha' : 'Crear nueva fecha'}
        </button>
        <button
          onClick={() => {
            setShowFormHoras(!showFormHoras);
            setShowFormFecha(false);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          <FaPlus /> {showFormHoras ? 'Ocultar formulario de horas' : 'Agregar horas a fecha'}
        </button>
      </div>

      {/* Formulario para crear nuevas fechas */}
      {showFormFecha && (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Crear nueva fecha</h3>
          <div className="space-y-2">
            <input
              type="date"
              value={nuevaFecha}
              onChange={(e) => setNuevaFecha(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Fecha (YYYY-MM-DD)"
            />
            <button
              onClick={handleCrearFecha}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Crear fecha
            </button>
          </div>
        </div>
      )}

      {/* Formulario para agregar horas a una fecha existente */}
      {showFormHoras && (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Agregar horas a fecha existente</h3>
          <div className="space-y-2">
            <select
              value={fechaSeleccionada || ''}
              onChange={(e) => handleFechaSeleccionadaChange(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              <option value="">Selecciona una fecha</option>
              {fechasDisponibles.map((fecha) => (
                <option key={fecha.id} value={fecha.id}>
                  {fecha.date}
                  
                </option>
                
              ))}
            </select>
            <input
              type="text"
              value={nuevasHoras}
              onChange={(e) => setNuevasHoras(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Horas (separadas por comas, ej: ##:##, ##:##)"
            />
            <button
              onClick={handleAgregarHoras}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Agregar horas
            </button>
          </div>
          {/* Mostrar las horas disponibles */}
          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2">Horas disponibles:</h4>
            <ul>
              {horasDisponibles.map((hora, index) => (
                <li key={index} className="text-sm">
                  {formatTime(hora)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Barra de búsqueda */}
      <SearchBar
        onSearch={setSearchText}
        searchBy={searchBy}
        onSearchByChange={setSearchBy}
      />
      {/* Filtro por fecha */}
      <FiltroFecha fechaFiltro={fechaFiltro} onChangeFecha={setFechaFiltro} />

      {/* Filtro por estado */}
      <FilterButtons onFilterChange={setFiltroEstado} />

      <div className="flex-1 overflow-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">ID</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Fecha y Hora</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Cédula Solicitante</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Nombre Solicitante</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Estado</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {citasActuales.map((cita) => {
              const fecha = cita.availableDate ? cita.availableDate.date : 'No disponible';
              const hora = cita.horaCita ? cita.horaCita.hora : 'No disponible';

              console.log('Fecha:', fecha, 'Hora:', hora);
              return (
                <tr key={cita.id}>
                  <td className="px-4 py-2">{cita.id}</td>
                  <td className="px-4 py-2">
                    {formatDateTime(cita.availableDate.date, cita.horaCita.hora)}
                  </td>
                  <td className="px-4 py-2">{cita.user?.cedula || 'No disponible'}</td>
                  <td className="px-4 py-2">{cita.user?.nombre || 'No disponible'}</td>
                  <td className="px-4 py-2">{cita.status}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button onClick={() => onVerCita(cita)} className="button-view">
                      <FaEye /> Ver
                    </button>
                    <button onClick={() => manejarEliminar(cita.id)} className="button-delete">
                      <FaTrash /> Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
            {/* Mostrar horas ocupadas */}
            {horasOcupadas.map((hora, index) => (
              <tr key={`hora-ocupada-${index}`}>
                <td colSpan={6} className="px-4 py-2 text-center bg-red-100">
                  Hora ocupada: {hora}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Paginacion
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
};

export default TablaCitas;