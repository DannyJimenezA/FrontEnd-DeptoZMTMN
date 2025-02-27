// import React, { useState } from "react";
// import "../styles/RevisionPlanos.css";
// import { useForm } from "react-hook-form";
// import { useNavigate } from 'react-router-dom';
// import ApiRoutes from "../components/ApiRoutes";

// interface FormData {
//   expediente: string;
//   numeroPlano: string;
//   comentarios?: string;
// }

// interface DecodedToken {
//   sub: string;
// }

// const RevisionPlanos = () => {
//   const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
//   const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
//   const navigate = useNavigate();

//   const onSubmit = async (data: FormData) => {
//     const formData = new FormData();

//     if (selectedFiles && selectedFiles.length > 0) {
//       Array.from(selectedFiles).forEach((file) => {
//         formData.append('files', file);
//       });
//     } else {
//       window.alert('Debe seleccionar al menos un archivo.');
//       return;
//     }

//     const token = localStorage.getItem('token');
//     const decodedToken = parseJwt(token);
//     const userId = decodedToken?.sub;

//     if (!userId) {
//       console.error("User ID is missing from the token.");
//       return;
//     }

//     const revisionData = {
//       userId,
//       NumeroExpediente: data.expediente,
//       NumeroPlano: data.numeroPlano,
//       Comentario: data.comentarios || "",
//       ArchivosAdjuntos: selectedFiles ? Array.from(selectedFiles).map(file => ({
//         nombre: file.name,
//         ruta: `/uploads/${file.name}`
//       })) : [],
//     };

//     formData.append('userId', revisionData.userId.toString());
//     formData.append('NumeroExpediente', revisionData.NumeroExpediente);
//     formData.append('NumeroPlano', revisionData.NumeroPlano);
//     formData.append('Comentario', revisionData.Comentario);
//     formData.append('ArchivosAdjuntos', JSON.stringify(revisionData.ArchivosAdjuntos));

//     try {
//       const response = await fetch(ApiRoutes.planos, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorResponse = await response.json();
//         window.alert(errorResponse.message || 'Error al enviar los datos al servidor');
//         throw new Error('Error al enviar los datos al servidor');
//       }

//       window.alert('La revisión de planos ha sido enviada exitosamente.');
//       navigate('/');
//     } catch (error) {
//       window.alert('Hubo un error al enviar la revisión de planos. Inténtalo nuevamente.');
//     }
//   };

//   const parseJwt = (token: string | null): DecodedToken | null => {
//     if (!token) {
//       console.error('Token no disponible');
//       return null;
//     }
//     try {
//       return JSON.parse(atob(token.split('.')[1])) as DecodedToken;
//     } catch (e) {
//       console.error('Error al decodificar el token:', e);
//       return null;
//     }
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     const validFiles = files && Array.from(files).every((file) => file.type === 'application/pdf');
//     if (!validFiles) {
//       window.alert('Solo se permiten archivos PDF.');
//       setSelectedFiles(null);
//       return;
//     }
//     setSelectedFiles(files); // Aquí eliminamos el uso de `setValue` para archivos
//   };

//   return (
//     <div className="container">
//       <h1 className="form-title">Revisión de Planos</h1>
//       <p className="form-subtitle">*Complete los detalles para la revisión de planos*</p>

//       <div className="form-container">
//         <form onSubmit={handleSubmit(onSubmit)} className="form">
//           <div className="form-field">
//             <label className="form-label">Número de Expediente:</label>
//             <input
//               type="text"
//               {...register('expediente', { required: true, pattern: /^[A-Za-z0-9]+$/ })}
//               className="form-input"
//               placeholder="Ingrese el número de expediente"
//             />
//             {errors.expediente && (
//               <p className="error-message">El número de expediente es obligatorio y debe ser alfanumérico</p>
//             )}
//           </div>

//           <div className="form-field">
//             <label className="form-label">Número de Plano:</label>
//             <input
//               type="text"
//               {...register('numeroPlano', { required: true })}
//               className="form-input"
//               placeholder="Ingrese el número de plano"
//             />
//             {errors.numeroPlano && (
//               <p className="error-message">El número de plano es obligatorio</p>
//             )}
//           </div>

//           <div className="form-field">
//             <label className="form-label">Archivos de Planos:</label>
//             <input
//               type="file"
//               multiple
//               accept="application/pdf"
//               onChange={handleFileChange}
//               className="form-input"
//             />
//             {/* Validación opcional adicional aquí si lo deseas */}
//           </div>

//           <div className="form-field">
//             <label className="form-label">Comentarios:</label>
//             <textarea
//               {...register('comentarios')}
//               className="form-input"
//               placeholder="Escriba comentarios adicionales"
//             />
//           </div>

//           <button type="submit" className="submit-button">
//             Enviar
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default RevisionPlanos;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ApiRoutes from "../components/ApiRoutes";

interface FormData {
  expediente: string;
  numeroPlano: string;
  comentarios?: string;
}

interface DecodedToken {
  sub: string;
}

const MySwal = withReactContent(Swal);

const RevisionPlanos = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();

    if (selectedFiles && selectedFiles.length > 0) {
      Array.from(selectedFiles).forEach((file) => {
        formData.append('files', file);
      });
    } else {
      MySwal.fire('Error', 'Debe seleccionar al menos un archivo.', 'error');
      return;
    }

    const token = localStorage.getItem('token');
    const decodedToken = parseJwt(token);
    const userId = decodedToken?.sub;

    if (!userId) {
      console.error("User ID is missing from the token.");
      return;
    }

    formData.append('userId', userId);
    formData.append('NumeroExpediente', data.expediente);
    formData.append('NumeroPlano', data.numeroPlano);
    formData.append('Comentario', data.comentarios || "");

    try {
      const response = await fetch(ApiRoutes.planos, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        MySwal.fire('Error', errorResponse.message || 'Error al enviar los datos al servidor', 'error');
        throw new Error('Error al enviar los datos al servidor');
      }

      MySwal.fire('Éxito', 'La revisión de planos ha sido enviada exitosamente.', 'success')
        .then(() => {
          setSelectedFiles(null);
          navigate('/');
        });
    } catch (error) {
      MySwal.fire('Error', 'Hubo un error al enviar la revisión de planos. Inténtalo nuevamente.', 'error');
    }
  };

  const parseJwt = (token: string | null): DecodedToken | null => {
    if (!token) {
      console.error('Token no disponible');
      return null;
    }
    try {
      return JSON.parse(atob(token.split('.')[1])) as DecodedToken;
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const validFiles = files && Array.from(files).every((file) => file.type === 'application/pdf');
    if (!validFiles) {
      MySwal.fire('Error', 'Solo se permiten archivos PDF.', 'error');
      setSelectedFiles(null);
      return;
    }
    setSelectedFiles(files);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Revisión de Planos</h1>
      <p className="text-center text-gray-500 mb-8">*Complete los detalles para la revisión de planos*</p>

      <div className="bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700">Número de Expediente:</label>
            <input
              type="text"
              {...register('expediente', { required: true, pattern: /^[A-Za-z0-9]+$/ })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingrese el número de expediente"
            />
            {errors.expediente && (
              <p className="text-red-500 text-sm mt-1">El número de expediente es obligatorio y debe ser alfanumérico</p>
            )}
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Número de Plano:</label>
            <input
              type="text"
              {...register('numeroPlano', { required: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingrese el número de plano"
            />
            {errors.numeroPlano && (
              <p className="text-red-500 text-sm mt-1">El número de plano es obligatorio</p>
            )}
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Archivos de Planos:</label>
            <input
              type="file"
              multiple
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Comentarios:</label>
            <textarea
              {...register('comentarios')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Escriba comentarios adicionales"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-400 transition-colors"
            >
              Volver
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RevisionPlanos;
