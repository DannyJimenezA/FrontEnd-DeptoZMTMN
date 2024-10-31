import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface DenunciaFormData {
  nombreDenunciante: string;
  cedulaDenunciante: string;
  notificacion: boolean;
  metodoNotificacion: string;
  medioNotificacion: string;
  tipoDenuncia: number;
  descripcion: string;
  lugarDenuncia: number;
  ubicacion: string;
  evidencia: boolean;
  archivosEvidencia: File[];
  detallesEvidencia: string;
  Date: string; // Formato de fecha yyyy-mm-dd
}

const Denuncias: React.FC = () => {
  const [formData, setFormData] = useState<DenunciaFormData>({
    nombreDenunciante: '',
    cedulaDenunciante: '',
    notificacion: false,
    metodoNotificacion: '',
    medioNotificacion: '',
    tipoDenuncia: 0,
    descripcion: '',
    lugarDenuncia: 0,
    ubicacion: '',
    evidencia: false,
    archivosEvidencia: [],
    detallesEvidencia: '',
    Date: '',
  });

  const [tiposDenuncia, setTiposDenuncia] = useState<any[]>([]);
  const [lugaresDenuncia, setLugaresDenuncia] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar tipos de denuncia y lugares de denuncia desde la API
    fetch('http://localhost:3000/tipo-denuncia')
      .then((response) => response.json())
      .then((data) => setTiposDenuncia(data))
      .catch((error) => console.error('Error al cargar los tipos de denuncia:', error));

    fetch('http://localhost:3000/lugar-denuncia')
      .then((response) => response.json())
      .then((data) => setLugaresDenuncia(data))
      .catch((error) => console.error('Error al cargar los lugares de denuncia:', error));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        archivosEvidencia: Array.from(e.target.files),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Añadir los campos del formulario, excepto los archivos
    formDataToSend.append('nombreDenunciante', formData.nombreDenunciante);
    formDataToSend.append('cedulaDenunciante', formData.cedulaDenunciante);
    formDataToSend.append('notificacion', String(formData.notificacion));
    formDataToSend.append('metodoNotificacion', formData.metodoNotificacion);
    formDataToSend.append('medioNotificacion', formData.medioNotificacion);
    formDataToSend.append('tipoDenuncia', String(formData.tipoDenuncia));
    formDataToSend.append('descripcion', formData.descripcion);
    formDataToSend.append('lugarDenuncia', String(formData.lugarDenuncia));
    formDataToSend.append('ubicacion', formData.ubicacion);
    formDataToSend.append('evidencia', String(formData.evidencia));
    formDataToSend.append('detallesEvidencia', formData.detallesEvidencia);
    formDataToSend.append('Date', formData.Date); // Asegúrate de enviar en el formato correcto

    // Añadir archivos de evidencia
    formData.archivosEvidencia.forEach((file) => {
      formDataToSend.append('files', file); // Nombre del campo debe coincidir con el backend
    });

    try {
      const response = await fetch('http://localhost:3000/denuncia/upload', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formDataToSend,
      });

      if (response.ok) {
        alert('Denuncia enviada con éxito');
        navigate('/denuncias');
      } else {
        const errorData = await response.json();
        console.error('Error al enviar la denuncia:', errorData);
        alert(`Error al enviar la denuncia: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error al enviar la denuncia:', error);
      alert('Hubo un error al enviar la denuncia. Intente nuevamente.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Formulario de Denuncias</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo para seleccionar la fecha
        <div>
          <label htmlFor="Date" className="block text-sm font-medium text-gray-700">
            Fecha de la Denuncia
          </label>
          <input
            id="Date"
            name="Date"
            type="date"
            value={formData.Date}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div> */}

        <div>
          <label htmlFor="nombreDenunciante" className="block text-sm font-medium text-gray-700">
            Nombre del Denunciante *(opcional)
          </label>
          <input
            id="nombreDenunciante"
            name="nombreDenunciante"
            type="text"
            value={formData.nombreDenunciante}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="cedulaDenunciante" className="block text-sm font-medium text-gray-700">
            Cédula del Denunciante *(opcional)
          </label>
          <input
            id="cedulaDenunciante"
            name="cedulaDenunciante"
            type="text"
            value={formData.cedulaDenunciante}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="notificacion"
            name="notificacion"
            type="checkbox"
            checked={formData.notificacion}
            onChange={handleInputChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="notificacion" className="block text-sm font-medium text-gray-700">
            ¿Desea recibir notificaciones?
          </label>
        </div>

        {formData.notificacion && (
          <>
            <div>
              <label htmlFor="metodoNotificacion" className="block text-sm font-medium text-gray-700">
                Método de Notificación
              </label>
              <select
                id="metodoNotificacion"
                name="metodoNotificacion"
                value={formData.metodoNotificacion}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Seleccione un método de notificación</option>
                <option value="Teléfono">Teléfono</option>
                <option value="Correo electrónico">Correo electrónico</option>
              </select>
            </div>

            <div>
              <label htmlFor="medioNotificacion" className="block text-sm font-medium text-gray-700">
                Medio de Notificación
              </label>
              <input
                id="medioNotificacion"
                name="medioNotificacion"
                type="text"
                value={formData.medioNotificacion}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </>
        )}

        <div>
          <label htmlFor="tipoDenuncia" className="block text-sm font-medium text-gray-700">
            Tipo de Denuncia
          </label>
          <select
            id="tipoDenuncia"
            name="tipoDenuncia"
            value={formData.tipoDenuncia}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Seleccione un tipo de denuncia</option>
            {tiposDenuncia.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>

        <div>
          <label htmlFor="lugarDenuncia" className="block text-sm font-medium text-gray-700">
            Lugar de Denuncia
          </label>
          <select
            id="lugarDenuncia"
            name="lugarDenuncia"
            value={formData.lugarDenuncia}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Seleccione un lugar de denuncia</option>
            {lugaresDenuncia.map((lugar) => (
              <option key={lugar.id} value={lugar.id}>
                {lugar.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700">
            Ubicación Exacta
          </label>
          <input
            id="ubicacion"
            name="ubicacion"
            type="text"
            value={formData.ubicacion}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="archivosEvidencia" className="block text-sm font-medium text-gray-700">
            Archivos de Evidencia
          </label>
          <input
            id="archivosEvidencia"
            name="archivosEvidencia"
            type="file"
            onChange={handleFileChange}
            multiple
            accept="image/*,.pdf"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="detallesEvidencia" className="block text-sm font-medium text-gray-700">
            Detalles de la Evidencia
          </label>
          <textarea
            id="detallesEvidencia"
            name="detallesEvidencia"
            value={formData.detallesEvidencia}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Enviar Denuncia
        </button>
      </form>
    </div>
  );
};

export default Denuncias;
