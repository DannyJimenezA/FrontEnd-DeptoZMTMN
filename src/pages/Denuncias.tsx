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
  archivosEvidencia: File[] | null;
  detallesEvidencia: string;
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
    archivosEvidencia: [],
    detallesEvidencia: '',
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

    if (e.target instanceof HTMLInputElement && type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: e.target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      archivosEvidencia: e.target.files ? Array.from(e.target.files) : [],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Añadir los campos del formulario, excepto los archivos
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'archivosEvidencia' && key !== 'detallesEvidencia') {
        formDataToSend.append(key, String(value));
      }
    });

    // Validación para archivos de evidencia
    if (!formData.archivosEvidencia || formData.archivosEvidencia.length === 0) {
      alert('Debes subir al menos un archivo como evidencia.');
      return;
    }

    // Si hay archivos, los añadimos al FormData
    formData.archivosEvidencia.forEach((file) => {
      formDataToSend.append('files', file);
    });

    formDataToSend.append('detallesEvidencia', formData.detallesEvidencia);

    fetch('http://localhost:3000/denuncia/upload', {
      method: 'POST',
      body: formDataToSend,
    })
      .then((response) => {
        if (response.ok) {
          alert('Denuncia enviada con éxito');
          navigate('/denuncias');
        } else {
          return response.json().then((data) => {
            console.error('Error al enviar la denuncia:', data);
          });
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Formulario de Denuncias</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
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
          <div className="space-y-4">
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
          </div>
        )}

        <div className="space-y-4">
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
        </div>

        <div className="space-y-4">
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
        </div>

        <div className="space-y-4">
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
              accept="image/*,.jpg,.png,.jpeg"
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
